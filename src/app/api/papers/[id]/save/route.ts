import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const { id: paperId } = await params;

  await prisma.savedPaper.upsert({
    where: {
      userId_paperId: {
        userId: user.id,
        paperId,
      },
    },

    update: {},

    create: {
      userId: user.id,
      paperId,
    },
  });

  return NextResponse.json({
    success: true,
  });
}