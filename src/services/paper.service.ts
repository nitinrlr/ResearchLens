import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/pagination";
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
 * A paper counts as saved when it is in any of the user's collections, so the
 * bookmark is filled whether it went into "Saved" or a collection of their own.
 */
function paperInclude(userId: string | null) {
  return {
    collectionPapers: {
      where: userId
        ? {
            collection: {
              userId,
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

/**
 * One page of papers matching `query`, newest first.
 *
 * A page past the end is clamped to the last page, and the returned `page` says
 * which page was actually loaded so the caller can fix the URL.
 */
export async function getPapersPage(query = "", page = 1) {
  const where = searchWhere(query);

  // Counting first lets us clamp the page before querying, so an out-of-range
  // ?page= never turns into a huge OFFSET.
  const [userId, total] = await Promise.all([
    getCurrentUserId(),
    prisma.paper.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const papers = await prisma.paper.findMany({
    where,

    // Many papers share a publication date. Without a unique tiebreaker the
    // database may order those differently on each query, so a paper could
    // show up on two pages, or on none.
    orderBy: [
      { publishedDate: "desc" },
      { id: "asc" },
    ],

    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,

    include: paperInclude(userId),
  });

  return {
    papers: papers.map(mapPaper),
    total,
    page: currentPage,
    totalPages,
  };
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
