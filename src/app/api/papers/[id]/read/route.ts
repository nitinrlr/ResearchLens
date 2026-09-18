import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { recordPaperRead } from "@/services/reading.service";

/**
 * Called once from the paper detail page after it mounts.
 *
 * This is deliberately a POST from the client rather than a write inside the
 * page's server render: Next.js prefetches links, so rendering the page would
 * mark papers as read merely because the user hovered a card.
 */
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

  await recordPaperRead(userId, paperId);

  return NextResponse.json({
    success: true,
  });
}
