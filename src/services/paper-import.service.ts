import { prisma } from "@/lib/prisma";
import type { SearchPaper } from "@/types/paper";

// OpenAlex has no difficulty data, so every paper starts at the same value
// until something better (e.g. an AI estimate) replaces it.
const DEFAULT_DIFFICULTY = 1;

// Used when OpenAlex has no page range to estimate from.
const DEFAULT_READING_TIME = 30;

// Saving a full page of papers can take longer than Prisma's 5-second default.
const TRANSACTION_TIMEOUT_MS = 120_000;

/** Keeps the first item for each key. OpenAlex occasionally repeats an author. */
function uniqueBy<T>(items: T[], key: (item: T) => string) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const value = key(item);

    if (seen.has(value)) {
      return false;
    }

    seen.add(value);
    return true;
  });
}

/**
 * Saves a batch of papers with their authors and topics, and returns how many
 * were added. All of it runs in one transaction, so a failure part-way can't
 * leave papers with no authors or missing from search.
 */
export async function savePapers(papers: SearchPaper[]) {
  if (papers.length === 0) {
    return 0;
  }

  const allAuthors = uniqueBy(papers.flatMap((p) => p.authors), (a) => a.openAlexId);
  const allTopics = uniqueBy(papers.flatMap((p) => p.topics), (t) => t.name);

  return prisma.$transaction(
    async (tx) => {
      // skipDuplicates also covers a URL that already belongs to another paper.
      const saved = await tx.paper.createManyAndReturn({
        data: papers.map((paper) => ({
          externalId: paper.externalId,
          title: paper.title,
          abstract: paper.abstract ?? "",
          publishedDate: paper.publishedDate,
          paperUrl: paper.paperUrl,
          pdfUrl: paper.pdfUrl,
          readingTime: paper.readingTime ?? DEFAULT_READING_TIME,
          difficulty: DEFAULT_DIFFICULTY,
        })),
        skipDuplicates: true,
        select: { id: true, externalId: true },
      });

      await tx.author.createMany({ data: allAuthors, skipDuplicates: true });
      await tx.topic.createMany({
        data: allTopics.map((topic) => ({ name: topic.name, description: "" })),
        skipDuplicates: true,
      });

      const [authors, topics] = await Promise.all([
        tx.author.findMany({
          where: { openAlexId: { in: allAuthors.map((a) => a.openAlexId) } },
          select: { id: true, openAlexId: true },
        }),
        tx.topic.findMany({
          where: { name: { in: allTopics.map((t) => t.name) } },
          select: { id: true, name: true },
        }),
      ]);

      const authorIds = new Map(authors.map((a) => [a.openAlexId, a.id]));
      const topicIds = new Map(topics.map((t) => [t.name, t.id]));
      const sourceById = new Map(papers.map((p) => [p.externalId, p]));

      await tx.paperAuthor.createMany({
        data: saved.flatMap((paper) =>
          uniqueBy(sourceById.get(paper.externalId!)!.authors, (a) => a.openAlexId).map(
            (author, index) => ({
              paperId: paper.id,
              authorId: authorIds.get(author.openAlexId)!,
              authorOrder: index + 1,
            })
          )
        ),
      });

      await tx.paperTopic.createMany({
        data: saved.flatMap((paper) =>
          uniqueBy(sourceById.get(paper.externalId!)!.topics, (t) => t.name).map(
            (topic) => ({
              paperId: paper.id,
              topicId: topicIds.get(topic.name)!,
            })
          )
        ),
      });

      const ids = saved.map((paper) => paper.id);
      await tx.$executeRaw`SELECT refresh_paper_search(${ids}::text[])`;

      return saved.length;
    },
    { timeout: TRANSACTION_TIMEOUT_MS }
  );
}
