import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

import { fetchPageCounts, PAGE_RANGE_BATCH_SIZE } from "@/lib/openalex";
import { fetchPdf } from "@/lib/paper-pdf";
import { prisma } from "@/lib/prisma";
import { readingTimeFor } from "@/lib/reading-time";

// arXiv asks automated clients for no more than one request every 3 seconds,
// and to use its export mirror.
const ARXIV_DELAY_MS = 3_000;
const ARXIV_HOST = /^https?:\/\/(www\.)?arxiv\.org\//;
const OTHER_PUBLISHER_WORKERS = 4;

// Much higher than the chat's limit: only the page count is read.
const MAX_PDF_BYTES = 100 * 1024 * 1024;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// The first Ctrl+C lets the papers in progress finish and be saved, so the
// next run carries on from there. A second one quits straight away.
let stopping = false;

process.on("SIGINT", () => {
  if (stopping) {
    process.exit(130);
  }

  stopping = true;
  console.log("\nStopping after the papers in progress. Press Ctrl+C again to quit now.");
});

type Paper = { id: string; pdfUrl: string | null; difficulty: number | null };

async function savePageCount(paper: Paper, pageCount: number | null) {
  await prisma.paper.update({
    where: { id: paper.id },
    data: {
      pagesCheckedAt: new Date(),
      ...(pageCount && { pageCount, readingTime: readingTimeFor(pageCount, paper.difficulty) }),
    },
  });
}

/** Step 1: exact page ranges from OpenAlex, 100 papers per request. */
async function fromOpenAlex() {
  const papers = await prisma.paper.findMany({
    where: { pageCount: null, externalId: { not: null } },
    select: { id: true, externalId: true, difficulty: true },
    orderBy: { id: "asc" },
  });

  let found = 0;

  for (let start = 0; start < papers.length && !stopping; start += PAGE_RANGE_BATCH_SIZE) {
    const batch = papers.slice(start, start + PAGE_RANGE_BATCH_SIZE);
    const pages = await fetchPageCounts(batch.map((paper) => paper.externalId!));

    const counted = batch.filter((paper) => pages.has(paper.externalId!));
    const pageCounts = counted.map((paper) => pages.get(paper.externalId!)!);

    // One statement per batch: separate updates are too slow over the network.
    await prisma.$executeRaw`
      UPDATE "Paper" AS p
      SET "pageCount" = v.pages, "readingTime" = v.minutes
      FROM unnest(
        ${counted.map((paper) => paper.id)}::text[],
        ${pageCounts}::int[],
        ${counted.map((paper, i) => readingTimeFor(pageCounts[i], paper.difficulty))}::int[]
      ) AS v(id, pages, minutes)
      WHERE p.id = v.id
    `;

    found += pages.size;
    console.log(`OpenAlex: ${Math.min(start + PAGE_RANGE_BATCH_SIZE, papers.length)}/${papers.length} checked, ${found} page counts`);
  }
}

/** The real page count of a PDF, read with PDF.js. */
async function countPages(url: string) {
  const pdf = await fetchPdf(url, MAX_PDF_BYTES);
  if (!pdf) return null;

  const task = getDocument({ data: new Uint8Array(pdf), verbosity: 0 });

  try {
    return (await task.promise).numPages;
  } finally {
    await task.destroy();
  }
}

/** Step 2: download the PDFs of papers OpenAlex had no page range for. */
async function fromPdfs(limit: number) {
  const papers = await prisma.paper.findMany({
    where: { pageCount: null, pagesCheckedAt: null, pdfUrl: { not: null } },
    select: { id: true, pdfUrl: true, difficulty: true },
    // Newest first, matching Explore's order, so the papers people see first fill in first.
    orderBy: [{ publishedDate: "desc" }, { id: "asc" }],
    take: limit,
  });

  const arxiv = papers.filter((paper) => ARXIV_HOST.test(paper.pdfUrl!));
  const others = papers.filter((paper) => !ARXIV_HOST.test(paper.pdfUrl!));
  let done = 0;
  let counted = 0;

  async function check(paper: Paper, url: string) {
    let pages: number | null = null;

    try {
      pages = await countPages(url);
    } catch {
      pages = null;
    }

    await savePageCount(paper, pages);
    done++;
    if (pages) counted++;
    if (done % 25 === 0 || done === papers.length) {
      console.log(`PDFs: ${done}/${papers.length} checked, ${counted} counted`);
    }
  }

  console.log(`PDFs: ${arxiv.length} on arXiv (about ${Math.ceil((arxiv.length * ARXIV_DELAY_MS) / 60_000)} min), ${others.length} elsewhere`);

  const arxivWorker = async () => {
    for (const paper of arxiv) {
      if (stopping) return;
      const started = Date.now();
      await check(paper, paper.pdfUrl!.replace(ARXIV_HOST, "https://export.arxiv.org/"));
      await sleep(Math.max(0, ARXIV_DELAY_MS - (Date.now() - started)));
    }
  };

  const queue = [...others];
  const otherWorker = async () => {
    for (let paper = queue.shift(); paper && !stopping; paper = queue.shift()) {
      await check(paper, paper.pdfUrl!);
    }
  };

  await Promise.all([arxivWorker(), ...Array.from({ length: OTHER_PUBLISHER_WORKERS }, otherWorker)]);
}

async function main() {
  // `npm run count:pages -- --pdfs-only --limit 200`
  const args = process.argv.slice(2);
  const limitIndex = args.indexOf("--limit");
  const limit = limitIndex === -1 ? undefined : Number(args[limitIndex + 1]);

  if (!args.includes("--pdfs-only")) {
    await fromOpenAlex();
  }

  if (!stopping) {
    await fromPdfs(limit ?? 100_000);
  }

  if (stopping) {
    console.log("\nStopped early. Run the same command again to carry on.");
  }

  const [{ missing }] = await prisma.$queryRaw<[{ missing: number }]>`
    SELECT count(*)::int AS missing FROM "Paper" WHERE "pageCount" IS NULL
  `;
  console.log(`\nPapers still without a page count: ${missing}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
