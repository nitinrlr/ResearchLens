import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { getDefaultCollectionId } from "@/services/collection.service";

/** Adds a paper to the user's default "Saved" collection. */
export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id: paperId } = await params;
  const collectionId = await getDefaultCollectionId(userId);

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

  return NextResponse.json({
    success: true,
  });
}
