import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { Prisma } from "@prisma/client";

type PaperWithRelations = Prisma.PaperGetPayload<{
  include: {
    collectionPapers: true;
    paperAuthors: {
      include: {
        author: true;
      };
    };
    paperTopics: {
      include: {
        topic: true;
      };
    };
  };
}>;

/**
 * "Saved" now means "in the user's default collection", so the bookmark state
 * comes from CollectionPaper rather than a dedicated table.
 */
function paperInclude(userId: string | null) {
  return {
    collectionPapers: {
      where: userId
        ? {
            collection: {
              userId,
              isDefault: true,
            },
          }
        : {
            collectionId: "__no_user__",
          },
    },

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
  };
}

export function searchWhere(query: string): Prisma.PaperWhereInput {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {};
  }

  return {
    OR: [
      {
        title: {
          contains: trimmedQuery,
          mode: "insensitive",
        },
      },
      {
        abstract: {
          contains: trimmedQuery,
          mode: "insensitive",
        },
      },
      {
        paperAuthors: {
          some: {
            author: {
              name: {
                contains: trimmedQuery,
                mode: "insensitive",
              },
            },
          },
        },
      },
      {
        paperTopics: {
          some: {
            topic: {
              name: {
                contains: trimmedQuery,
                mode: "insensitive",
              },
            },
          },
        },
      },
    ],
  };
}

function mapPaper(paper: PaperWithRelations) {
  return {
    id: paper.id,
    title: paper.title,
    publishedDate: paper.publishedDate,
    readingTime: paper.readingTime,
    difficulty: paper.difficulty,
    saved: paper.collectionPapers.length > 0,
    authors: paper.paperAuthors.map((pa) => pa.author.name),

    topics: paper.paperTopics.map((pt) => pt.topic.name),
  };
}

export async function getAllPapers(query = "") {
  const userId = await getCurrentUserId();

  const papers = await prisma.paper.findMany({
    where: searchWhere(query),

    orderBy: {
      publishedDate: "desc",
    },

    include: paperInclude(userId),
  });

  return papers.map(mapPaper);
}

export async function getPaperById(id: string) {
  const userId = await getCurrentUserId();

  const paper = await prisma.paper.findUnique({
    where: {
      id,
    },

    include: paperInclude(userId),
  });

  if (!paper) {
    return null;
  }

  return {
    id: paper.id,
    title: paper.title,
    abstract: paper.abstract,
    publishedDate: paper.publishedDate,
    readingTime: paper.readingTime,
    difficulty: paper.difficulty,
    paperUrl: paper.paperUrl,
    pdfUrl: paper.pdfUrl,
    saved: paper.collectionPapers.length > 0,

    authors: paper.paperAuthors.map((pa) => pa.author.name),

    topics: paper.paperTopics.map((pt) => pt.topic.name),
  };
}
