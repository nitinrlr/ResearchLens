import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { getCollectionsForPaper } from "@/services/collection.service";

/** The signed-in user's collections, each marked with whether it holds this paper. */
export async function GET(
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

  const collections = await getCollectionsForPaper(userId, paperId);

  return NextResponse.json({
    collections,
  });
}
