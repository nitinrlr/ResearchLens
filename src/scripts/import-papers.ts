import { fetchMostCitedPage } from "@/lib/openalex";
import { paperKeys, selectNewPapers } from "@/lib/paper-import-filter";
import { prisma } from "@/lib/prisma";
import { savePapers } from "@/services/paper-import.service";

const DEFAULT_TARGET = 50_000;

async function main() {
  // `npm run import:papers -- 10000` sets the total to reach.
  const target = Number(process.argv[2] ?? DEFAULT_TARGET);

  if (!Number.isInteger(target) || target < 1) {
    throw new Error(`Expected a total number of papers, got "${process.argv[2]}"`);
  }

  const existing = await prisma.paper.findMany({
    select: { externalId: true, title: true, abstract: true },
  });
  const seen = new Set(existing.flatMap(paperKeys));

  let total = existing.length;
  let cursor: string | null = "*";

  console.log(`Starting at ${total} papers, importing up to ${target}.\n`);

  while (total < target && cursor) {
    const page: Awaited<ReturnType<typeof fetchMostCitedPage>> =
      await fetchMostCitedPage(cursor);
    const fresh = selectNewPapers(page.papers, seen).slice(0, target - total);

    total += await savePapers(fresh);
    cursor = page.nextCursor;

    console.log(`+${String(fresh.length).padStart(3)}  total ${total}`);
  }

  console.log(`\nPapers in database: ${await prisma.paper.count()}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
