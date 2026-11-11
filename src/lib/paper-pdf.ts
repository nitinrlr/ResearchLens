// Gemini reads up to 50 MB, but each page costs about 520 tokens, so the chat
// skips very long papers to stay inside the free tier's per-minute limit.
const MAX_BYTES = 20 * 1024 * 1024;
const MAX_PAGES = 80;
const FETCH_TIMEOUT_MS = 20_000;
const USER_AGENT = "Mozilla/5.0 (compatible; ResearchLens/0.1; paper chat)";

// Recent downloads, so follow-up questions about the same paper don't refetch.
const CACHE_SIZE = 20;
const cache = new Map<string, Buffer | null>();

/** The PDF link publisher pages give search engines in a citation_pdf_url tag. */
export function findCitationPdfUrl(html: string, pageUrl: string) {
  const match =
    html.match(/<meta[^>]+name=["']citation_pdf_url["'][^>]*content=["']([^"']+)["']/i) ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*name=["']citation_pdf_url["']/i);

  return match ? new URL(match[1], pageUrl).toString() : null;
}

export function isPdf(buffer: Buffer) {
  return buffer.subarray(0, 1024).includes("%PDF");
}

/** Approximate: counts page objects, which is right for nearly every PDF. */
export function countPdfPages(buffer: Buffer) {
  return buffer.toString("latin1").match(/\/Type\s*\/Page(?!s)/g)?.length ?? 0;
}

async function download(url: string) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { "User-Agent": USER_AGENT, Accept: "application/pdf,text/html;q=0.9,*/*;q=0.8" },
  });

  if (!response.ok) return null;

  const length = Number(response.headers.get("content-length") ?? 0);
  if (length > MAX_BYTES) return null;

  const buffer = Buffer.from(await response.arrayBuffer());
  const type = response.headers.get("content-type") ?? "";

  return { buffer, finalUrl: response.url, isHtml: type.includes("html") };
}

async function fetchPdf(url: string): Promise<Buffer | null> {
  const first = await download(url);
  if (!first) return null;

  if (isPdf(first.buffer)) return first.buffer;

  // A publisher page instead of the PDF: follow its citation_pdf_url tag.
  const tagged = first.isHtml ? findCitationPdfUrl(first.buffer.toString("utf8"), first.finalUrl) : null;
  const second = tagged ? await download(tagged) : null;

  return second && isPdf(second.buffer) ? second.buffer : null;
}

/**
 * Downloads a paper's PDF, following a publisher page to its PDF when needed.
 * Returns null when the publisher blocks downloads or the file is too big.
 */
export async function downloadPaperPdf(url: string | null): Promise<Buffer | null> {
  if (!url) return null;
  if (cache.has(url)) return cache.get(url)!;

  let pdf: Buffer | null = null;

  try {
    pdf = await fetchPdf(url);
  } catch {
    pdf = null;
  }

  if (pdf && pdf.length > MAX_BYTES) pdf = null;

  cache.set(url, pdf);
  if (cache.size > CACHE_SIZE) cache.delete(cache.keys().next().value!);

  return pdf;
}

/** The PDF for the chat, or null when it can't be read or is too long to send. */
export async function fetchPaperPdf(url: string | null): Promise<Buffer | null> {
  const pdf = await downloadPaperPdf(url);
  return pdf && countPdfPages(pdf) <= MAX_PAGES ? pdf : null;
}
