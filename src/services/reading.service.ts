import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { paperCardInclude, searchWhere, toPaperCard } from "@/services/paper.service";

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
        include: paperCardInclude(userId),
      },
    },
  });

  return entries.map((entry) => ({
    ...toPaperCard(entry.paper),
    lastReadAt: entry.lastReadAt,
  }));
}
