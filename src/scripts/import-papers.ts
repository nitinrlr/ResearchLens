import { searchWorks } from "@/lib/openalex";
import { prisma } from "@/lib/prisma";
import { importPapers } from "@/services/paper-import.service";

// Each phrase is matched exactly in titles and abstracts, and the most-cited
// open-access CS papers for it are imported. Mostly ML because that is what
// most students are reading, with systems, databases, theory and security
// mixed in so Explore is not one topic deep.
const DEFAULT_TOPICS = [
  "transformer",
  "large language model",
  "diffusion model",
  "reinforcement learning",
  "graph neural network",
  "object detection",
  "generative adversarial network",
  "machine translation",
  "self-supervised learning",
  "federated learning",
  "recommender system",
  "distributed consensus",
  "operating system",
  "query optimization",
  "compiler optimization",
  "approximation algorithm",
  "intrusion detection",
];

const PAPERS_PER_TOPIC = 25;

async function main() {
  // `npm run import:papers -- "topic one" "topic two"` overrides the list.
  const cliTopics = process.argv.slice(2);
  const topics = cliTopics.length > 0 ? cliTopics : DEFAULT_TOPICS;

  const before = await prisma.paper.count();

  console.log(
    `Importing up to ${PAPERS_PER_TOPIC} papers for each of ${topics.length} topics...\n`
  );

  const failed: string[] = [];

  for (const topic of topics) {
    // One topic failing (even after searchWorks' retries) should not throw
    // away the rest of the run. Re-running later picks up what was missed.
    try {
      const papers = await searchWorks(topic, PAPERS_PER_TOPIC);
      const { imported, skipped } = await importPapers(papers);

      console.log(
        `${topic.padEnd(32)} ${String(imported).padStart(3)} imported` +
          (skipped.length > 0 ? `, ${skipped.length} skipped (duplicate URL)` : "")
      );
    } catch (error) {
      failed.push(topic);
      console.error(
        `${topic.padEnd(32)} FAILED: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  const after = await prisma.paper.count();

  // Topics overlap (a paper can match several), so "imported" above counts
  // some papers more than once. The table count is the real total.
  console.log(`\nPapers in database: ${before} -> ${after} (+${after - before})`);

  if (failed.length > 0) {
    console.error(
      `\n${failed.length} topic(s) failed. Retry just those with:\n` +
        `npm run import:papers -- ${failed.map((topic) => `"${topic}"`).join(" ")}`
    );
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
