// arXiv lets browsers fetch its PDFs from other sites; most publishers don't.
const DIRECT_HOSTS = new Set(["arxiv.org", "export.arxiv.org"]);

export const ZOOM_LEVELS = [0.75, 1, 1.25, 1.5, 2];

/** Where the viewer loads a paper's PDF from: arXiv directly, anything else through our server. */
export function pdfViewerSource(paperId: string, pdfUrl: string) {
  try {
    const url = new URL(pdfUrl);
    if (url.protocol === "https:" && DIRECT_HOSTS.has(url.hostname)) return url.toString();
  } catch {
    // Not a valid URL: let the server try it.
  }

  return `/api/papers/${paperId}/pdf`;
}

/** The page at the reading line a third of the way down the viewer, given each page's top offset. */
export function pageAt(tops: number[], readingLine: number) {
  let page = 1;

  for (let i = 0; i < tops.length && tops[i] <= readingLine; i++) {
    page = i + 1;
  }

  return page;
}
