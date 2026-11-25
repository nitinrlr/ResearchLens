import { mkdirSync, writeFileSync } from "node:fs";

import { fetchWorkFacts, fullOpenAlexId, PAGE_RANGE_BATCH_SIZE, shortOpenAlexId, type WorkFacts } from "@/lib/openalex";
import { pickPapersToTrim } from "@/lib/paper-trim";
import { prisma } from "@/lib/prisma";

import { readIdsFile } from "./ids-file";

const DELETE_BATCH_SIZE = 500;

/**
 * Removes the least-cited papers whose topics are all AI or computer vision,
 * to make room for other areas of computer science. Papers anyone has read,
 * saved or chatted about are never removed, nor are those in `--keep-file`.
 */
async function main() {
  // `npm run trim:papers -- 10000 --dry-run --keep-file keep.txt`
  const args = process.argv.slice(2);
  const count = Number(args.find((arg) => /^\d+$/.test(arg)));
  const dryRun = args.includes("--dry-run");
  const keepFile = args.includes("--keep-file") ? args[args.indexOf("--keep-file") + 1] : undefined;
  const keepIds = new Set(keepFile ? readIdsFile(keepFile).map(fullOpenAlexId) : []);

  if (!Number.isInteger(count) || count < 1) {
    throw new Error("Expected how many papers to remove, like `npm run trim:papers -- 10000 --dry-run`");
  }

  const papers = await prisma.paper.findMany({
    where: { externalId: { not: null } },
    select: { id: true, externalId: true, title: true },
    orderBy: { id: "asc" },
  });

  const keep = new Set(
    (
      await prisma.$queryRaw<{ id: string }[]>`
        SELECT "paperId" AS id FROM "ReadingHistory"
        UNION SELECT "paperId" FROM "CollectionPaper"
        UNION SELECT "paperId" FROM "PaperChatAnswer"
      `
    ).map((row) => row.id)
  );

  for (const paper of papers) {
    if (keepIds.has(paper.externalId!)) keep.add(paper.id);
  }

  const facts = new Map<string, WorkFacts>();

  for (let start = 0; start < papers.length; start += PAGE_RANGE_BATCH_SIZE) {
    const batch = papers.slice(start, start + PAGE_RANGE_BATCH_SIZE);
    for (const [id, fact] of await fetchWorkFacts(batch.map((paper) => paper.externalId!))) {
      facts.set(id, fact);
    }
    if ((start / PAGE_RANGE_BATCH_SIZE) % 50 === 0) {
      console.log(`OpenAlex: ${start}/${papers.length} looked up`);
    }
  }

  const picked = pickPapersToTrim(
    papers.map((paper) => ({ id: paper.id, facts: facts.get(paper.externalId!) })),
    keep,
    count
  );
  const byId = new Map(papers.map((paper) => [paper.id, paper]));
  const lines = picked.map(
    (paper) => `${shortOpenAlexId(byId.get(paper.id)!.externalId!)}\t${paper.facts.citations}\t${byId.get(paper.id)!.title}`
  );

  console.log(
    `\n${picked.length} papers picked, cited ${picked[0]?.facts.citations} to ${picked.at(-1)?.facts.citations} times. ` +
      `${keep.size} papers are protected.`
  );

  // A record of what was removed. Each line starts with the OpenAlex id, so
  // `npm run import:papers -- --ids-file <file>` can bring them back.
  mkdirSync("backups", { recursive: true });
  const file = `backups/${dryRun ? "trim-preview" : "removed-papers"}-${new Date().toISOString().slice(0, 10)}.txt`;
  writeFileSync(file, `# OpenAlex id\tcitations\ttitle\n${lines.join("\n")}\n`);
  console.log(`List written to ${file}`);

  if (dryRun) {
    return;
  }

  for (let start = 0; start < picked.length; start += DELETE_BATCH_SIZE) {
    const ids = picked.slice(start, start + DELETE_BATCH_SIZE).map((paper) => paper.id);
    // Authors, topics, saves and history links cascade with the paper.
    await prisma.paper.deleteMany({ where: { id: { in: ids } } });
    console.log(`Removed ${Math.min(start + DELETE_BATCH_SIZE, picked.length)}/${picked.length}`);
  }

  const authors = await prisma.$executeRaw`
    DELETE FROM "Author" a WHERE NOT EXISTS (SELECT 1 FROM "PaperAuthor" pa WHERE pa."authorId" = a.id)
  `;
  const topics = await prisma.$executeRaw`
    DELETE FROM "Topic" t WHERE NOT EXISTS (SELECT 1 FROM "PaperTopic" pt WHERE pt."topicId" = t.id)
  `;

  console.log(`\nAlso removed ${authors} authors and ${topics} topics left with no papers.`);
  console.log(`Papers in database: ${await prisma.paper.count()}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
