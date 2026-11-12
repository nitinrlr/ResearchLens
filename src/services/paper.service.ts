import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/pagination";
import { toSearchQuery } from "@/lib/search-query";
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

/** Plain text matching, for a person's own short lists. */
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
export async function getPapersPage(query = "", page = 1, topic = "") {
  const hasQuery = query.trim() !== "";
  const searchQuery = toSearchQuery(query);

  // Only punctuation: nothing can match, so don't query at all.
  if (hasQuery && !searchQuery) {
    return { papers: [], total: 0, page: 1, totalPages: 1 };
  }

  const conditions: Prisma.Sql[] = [];

  if (searchQuery) {
    conditions.push(Prisma.sql`"searchVector" @@ to_tsquery('english', ${searchQuery})`);
  }

  if (topic) {
    conditions.push(Prisma.sql`id IN (
      SELECT pt."paperId" FROM "PaperTopic" pt
      JOIN "Topic" t ON t.id = pt."topicId"
      WHERE t.name = ${topic}
    )`);
  }

  const filter = conditions.length > 0
    ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
    : Prisma.empty;

  // Counting first lets us clamp the page before querying, so an out-of-range
  // ?page= never turns into a huge OFFSET.
  const [userId, [{ total }]] = await Promise.all([
    getCurrentUserId(),
    prisma.$queryRaw<[{ total: number }]>`
      SELECT count(*)::int AS total FROM "Paper" ${filter}
    `,
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  // Many papers share a publication date. Without a unique tiebreaker the
  // database may order those differently on each query, so a paper could
  // show up on two pages, or on none.
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM "Paper" ${filter}
    ORDER BY "publishedDate" DESC, id ASC
    LIMIT ${PAGE_SIZE} OFFSET ${(currentPage - 1) * PAGE_SIZE}
  `;

  const found = await prisma.paper.findMany({
    where: { id: { in: rows.map((row) => row.id) } },
    include: paperInclude(userId),
  });
  const byId = new Map(found.map((paper) => [paper.id, paper]));

  return {
    papers: rows.map((row) => mapPaper(byId.get(row.id)!)),
    total,
    page: currentPage,
    totalPages,
  };
}

// Counting topics across every paper takes about a second, and the answer only
// changes after an import, so it's kept in memory for a day.
const POPULAR_TOPICS_TTL_MS = 24 * 60 * 60 * 1000;
let popularTopics: { names: string[]; expires: number } | null = null;

/** The topics with the most papers, most popular first. */
export async function getPopularTopics(limit = 24) {
  if (popularTopics && popularTopics.expires > Date.now() && popularTopics.names.length >= limit) {
    return popularTopics.names.slice(0, limit);
  }

  const rows = await prisma.$queryRaw<{ name: string }[]>`
    SELECT t.name FROM "PaperTopic" pt
    JOIN "Topic" t ON t.id = pt."topicId"
    GROUP BY t.name
    ORDER BY count(*) DESC, t.name
    LIMIT ${limit}
  `;

  popularTopics = { names: rows.map((row) => row.name), expires: Date.now() + POPULAR_TOPICS_TTL_MS };
  return popularTopics.names;
}

// Wrapped in React's cache() so the page and its generateMetadata share one
// database query per request instead of running it twice.
export const getPaperById = cache(async (id: string) => {
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
});
