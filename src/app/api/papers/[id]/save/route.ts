import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

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

  await prisma.savedPaper.upsert({
    where: {
      userId_paperId: {
        userId,
        paperId,
      },
    },

    update: {},

    create: {
      userId,
      paperId,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
