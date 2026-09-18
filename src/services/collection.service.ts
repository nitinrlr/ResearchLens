import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

export const DEFAULT_COLLECTION_TITLE = "Saved";
export const DEFAULT_COLLECTION_DESCRIPTION =
  "Papers you bookmarked for later.";

/** The id of the user's default ("Saved") collection, or null if they have none. */
export async function findDefaultCollectionId(userId: string) {
  const collection = await prisma.collection.findFirst({
    where: {
      userId,
      isDefault: true,
    },
    select: {
      id: true,
    },
  });

  return collection?.id ?? null;
}

/**
 * Returns the id of the user's default ("Saved") collection, creating it if it
 * somehow went missing.
 *
 * Every user gets one at registration and the migration backfilled existing
 * users, so the create branch is a safety net rather than the normal path.
 *
 * Note: Postgres could enforce "one default per user" with a partial unique
 * index, but Prisma's schema language cannot express one, so `prisma migrate`
 * would see it as drift and try to drop it. We enforce it here instead.
 */
export async function getDefaultCollectionId(userId: string) {
  const existingId = await findDefaultCollectionId(userId);

  if (existingId) {
    return existingId;
  }

  const created = await prisma.collection.create({
    data: {
      userId,
      title: DEFAULT_COLLECTION_TITLE,
      description: DEFAULT_COLLECTION_DESCRIPTION,
      isDefault: true,
    },
    select: {
      id: true,
    },
  });

  return created.id;
}

/** Every collection owned by the signed-in user, default one first. */
export async function getCollections() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  const collections = await prisma.collection.findMany({
    where: {
      userId,
    },

    orderBy: [
      { isDefault: "desc" },
      { createdAt: "desc" },
    ],

    include: {
      _count: {
        select: {
          collectionPapers: true,
        },
      },
    },
  });

  return collections.map((collection) => ({
    id: collection.id,
    title: collection.title,
    description: collection.description,
    isDefault: collection.isDefault,
    paperCount: collection._count.collectionPapers,
  }));
}

/**
 * One collection and its papers.
 *
 * Returns null when the collection does not exist *or* belongs to someone
 * else, so a user cannot read another account's collection by guessing its id.
 */
export async function getCollectionById(collectionId: string) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  // The bookmark icon reflects the default collection specifically, so we need
  // its id even when viewing some other collection.
  const defaultCollectionId = await findDefaultCollectionId(userId);

  const collection = await prisma.collection.findFirst({
    where: {
      id: collectionId,
      userId,
    },

    include: {
      collectionPapers: {
        orderBy: {
          paper: {
            publishedDate: "desc",
          },
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
      },
    },
  });

  if (!collection) {
    return null;
  }

  return {
    id: collection.id,
    title: collection.title,
    description: collection.description,
    isDefault: collection.isDefault,

    papers: collection.collectionPapers.map(({ paper }) => ({
      id: paper.id,
      title: paper.title,
      publishedDate: paper.publishedDate,
      readingTime: paper.readingTime,
      difficulty: paper.difficulty,
      saved: paper.collectionPapers.length > 0,
      authors: paper.paperAuthors.map((pa) => pa.author.name),
      topics: paper.paperTopics.map((pt) => pt.topic.name),
    })),
  };
}

/** Confirms the collection exists and the signed-in user owns it. */
export async function assertOwnedCollection(
  userId: string,
  collectionId: string
) {
  const collection = await prisma.collection.findFirst({
    where: {
      id: collectionId,
      userId,
    },
    select: {
      id: true,
      isDefault: true,
    },
  });

  return collection;
}
