import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { findDefaultCollectionId } from "@/services/collection.service";
import { searchWhere } from "@/services/paper.service";

/**
 * Records that the signed-in user opened a paper.
 *
 * First visit inserts the row; later visits only bump `lastReadAt`, so
 * "Continue Reading" stays ordered by most recently opened.
 */
export async function recordPaperRead(userId: string, paperId: string) {
  await prisma.readingHistory.upsert({
    where: {
      userId_paperId: {
        userId,
        paperId,
      },
    },

    update: {
      lastReadAt: new Date(),
    },

    create: {
      userId,
      paperId,
    },
  });
}

/** Papers the user has opened, most recent first. */
export async function getContinueReading(query = "") {
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  const defaultCollectionId = await findDefaultCollectionId(userId);

  const entries = await prisma.readingHistory.findMany({
    where: {
      userId,
      paper: searchWhere(query),
    },

    orderBy: {
      lastReadAt: "desc",
    },

    include: {
      paper: {
        include: {
          paperAuthors: {
            include: {
              author: true,
            },
          },
          paperTopics: {
            include: {
              topic: true,
            },
          },
          collectionPapers: {
            where: {
              collectionId: defaultCollectionId ?? "__none__",
            },
            select: {
              collectionId: true,
            },
          },
        },
      },
    },
  });

  return entries.map((entry) => ({
    id: entry.paper.id,
    title: entry.paper.title,
    publishedDate: entry.paper.publishedDate,
    readingTime: entry.paper.readingTime,
    difficulty: entry.paper.difficulty,
    saved: entry.paper.collectionPapers.length > 0,
    authors: entry.paper.paperAuthors.map((pa) => pa.author.name),
    topics: entry.paper.paperTopics.map((pt) => pt.topic.name),
    lastReadAt: entry.lastReadAt,
  }));
}
