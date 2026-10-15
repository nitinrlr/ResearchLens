import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { SearchPaper } from "@/types/paper";

// OpenAlex has no difficulty data, so every paper starts at the same value
// until something better (e.g. an AI estimate) replaces it.
const DEFAULT_DIFFICULTY = 1;

// Used when OpenAlex has no page range to estimate from.
const DEFAULT_READING_TIME = 30;

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
 * Upserts one paper with its authors and topics.
 *
 * Authors and topics are written with createMany + skipDuplicates, so the
 * number of queries stays fixed no matter how many authors a paper has. Every
 * step is idempotent: running the import again only fills in what is missing.
 */
async function importPaper(paper: SearchPaper) {
  // Fields that come from OpenAlex. Re-running the import refreshes them,
  // which is how older rows pick up abstracts and reading times.
  const sourceFields = {
    title: paper.title,
    abstract: paper.abstract ?? "",
    publishedDate: paper.publishedDate,
    paperUrl: paper.paperUrl,
    pdfUrl: paper.pdfUrl,
    readingTime: paper.readingTime ?? DEFAULT_READING_TIME,
  };

  const dbPaper = await prisma.paper.upsert({
    where: {
      externalId: paper.externalId,
    },

    update: sourceFields,

    // Difficulty is only set on create so a re-import never overwrites a
    // value someone set by hand.
    create: {
      ...sourceFields,
      externalId: paper.externalId,
      difficulty: DEFAULT_DIFFICULTY,
      thumbnailUrl: null,
    },

    select: {
      id: true,
    },
  });

  const authors = uniqueBy(paper.authors, (author) => author.openAlexId);

  if (authors.length > 0) {
    await prisma.author.createMany({
      data: authors,
      skipDuplicates: true,
    });

    const dbAuthors = await prisma.author.findMany({
      where: {
        openAlexId: {
          in: authors.map((author) => author.openAlexId),
        },
      },
      select: {
        id: true,
        openAlexId: true,
      },
    });

    const authorIds = new Map(
      dbAuthors.map((author) => [author.openAlexId, author.id])
    );

    await prisma.paperAuthor.createMany({
      data: authors.map((author, index) => ({
        paperId: dbPaper.id,
        authorId: authorIds.get(author.openAlexId)!,
        authorOrder: index + 1,
      })),
      skipDuplicates: true,
    });
  }

  const topics = uniqueBy(paper.topics, (topic) => topic.name);

  if (topics.length > 0) {
    await prisma.topic.createMany({
      data: topics.map((topic) => ({
        name: topic.name,
        description: "",
      })),
      skipDuplicates: true,
    });

    const dbTopics = await prisma.topic.findMany({
      where: {
        name: {
          in: topics.map((topic) => topic.name),
        },
      },
      select: {
        id: true,
      },
    });

    await prisma.paperTopic.createMany({
      data: dbTopics.map((topic) => ({
        paperId: dbPaper.id,
        topicId: topic.id,
      })),
      skipDuplicates: true,
    });
  }
}

/**
 * Imports a batch of papers. A paper whose URL already belongs to a different
 * paper (OpenAlex sometimes has two records for one work) is skipped rather
 * than failing the whole batch.
 */
export async function importPapers(papers: SearchPaper[]) {
  let imported = 0;
  const skipped: string[] = [];

  for (const paper of papers) {
    try {
      await importPaper(paper);
      imported++;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        skipped.push(paper.title);
        continue;
      }

      throw error;
    }
  }

  return {
    imported,
    skipped,
  };
}
