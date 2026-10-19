import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { assertOwnedCollection } from "@/services/collection.service";

type RouteParams = {
  params: Promise<{
    collectionId: string;
    paperId: string;
  }>;
};

/**
 * Shared checks for both methods: someone is signed in and owns the collection.
 * Returns the ids on success, or the error response to send back.
 */
async function authorize({ params }: RouteParams) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const { collectionId, paperId } = await params;

  // 404 rather than 403 for someone else's collection, so ids can't be probed.
  const collection = await assertOwnedCollection(userId, collectionId);

  if (!collection) {
    return {
      error: NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      ),
    };
  }

  return {
    collectionId,
    paperId,
  };
}

/** Adds a paper to a collection. Adding it twice is a no-op. */
export async function PUT(request: Request, context: RouteParams) {
  const result = await authorize(context);

  if ("error" in result) {
    return result.error;
  }

  const { collectionId, paperId } = result;

  try {
    await prisma.collectionPaper.upsert({
      where: {
        collectionId_paperId: {
          collectionId,
          paperId,
        },
      },

      update: {},

      create: {
        collectionId,
        paperId,
      },
    });
  } catch (error) {
    // P2003: the foreign key failed, meaning no paper has this id.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        { error: "Paper not found" },
        { status: 404 }
      );
    }

    throw error;
  }

  return NextResponse.json({
    success: true,
  });
}

/** Removes a paper from a collection. Removing one that isn't there is a no-op. */
export async function DELETE(request: Request, context: RouteParams) {
  const result = await authorize(context);

  if ("error" in result) {
    return result.error;
  }

  const { collectionId, paperId } = result;

  await prisma.collectionPaper.deleteMany({
    where: {
      collectionId,
      paperId,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
