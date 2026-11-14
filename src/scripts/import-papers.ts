import { fetchMostCitedPage, PAGE_RANGE_BATCH_SIZE, type WorksQuery } from "@/lib/openalex";
import { paperKeys, selectNewPapers } from "@/lib/paper-import-filter";
import { prisma } from "@/lib/prisma";
import { savePapers } from "@/services/paper-import.service";

import { readIdsFile } from "./ids-file";

const DEFAULT_TARGET = 50_000;

function option(args: string[], name: string) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

/**
 * Usage:
 *   npm run import:papers -- 50000                     fill the database to 50,000 papers
 *   npm run import:papers -- --add 1000 --subfield 1703 --type review
 *                                                      add 1,000 theory surveys
 *   npm run import:papers -- --ids-file papers.txt     add these exact OpenAlex works
 */
async function main() {
  const args = process.argv.slice(2);
  const add = option(args, "--add");
  const idsFile = option(args, "--ids-file");
  const subfields = option(args, "--subfield")?.split(",").map(Number);
  const type = option(args, "--type");

  const existing = await prisma.paper.findMany({
    select: { externalId: true, title: true, abstract: true },
  });
  const seen = new Set(existing.flatMap(paperKeys));

  // Each query is read from the top, most-cited first, until the target is reached.
  const ids = idsFile ? readIdsFile(idsFile) : [];
  const queries: WorksQuery[] = idsFile
    ? Array.from({ length: Math.ceil(ids.length / PAGE_RANGE_BATCH_SIZE) }, (_, i) => ({
        ids: ids.slice(i * PAGE_RANGE_BATCH_SIZE, (i + 1) * PAGE_RANGE_BATCH_SIZE),
      }))
    : [{ subfields, type }];

  const target = idsFile
    ? Infinity
    : add
      ? existing.length + Number(add)
      : Number(args.find((arg) => /^\d+$/.test(arg)) ?? DEFAULT_TARGET);

  if (Number.isNaN(target) || target < 1) {
    throw new Error(`Expected a number of papers, got "${add ?? args[0]}"`);
  }

  let total = existing.length;
  console.log(`Starting at ${total} papers${Number.isFinite(target) ? `, importing up to ${target}` : ""}.\n`);

  for (const query of queries) {
    let cursor: string | null = "*";

    while (total < target && cursor) {
      const page: Awaited<ReturnType<typeof fetchMostCitedPage>> = await fetchMostCitedPage(cursor, query);
      const fresh = selectNewPapers(page.papers, seen).slice(0, target - total);

      total += await savePapers(fresh);
      cursor = page.nextCursor;

      console.log(`+${String(fresh.length).padStart(3)}  total ${total}`);
    }
  }

  console.log(`\nPapers in database: ${await prisma.paper.count()}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
