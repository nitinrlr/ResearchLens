"use server";

import { revalidatePath } from "next/cache";

import { failed, SIGNED_OUT } from "@/lib/action-result";
import type { ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

/** Drops a paper off the Continue Reading list without touching collections. */
export async function removeFromReadingAction(formData: FormData): Promise<ActionResult> {
  const userId = await getCurrentUserId();
  if (!userId) return SIGNED_OUT;

  const paperId = String(formData.get("paperId") ?? "");

  try {
    await prisma.readingHistory.deleteMany({
      where: {
        userId,
        paperId,
      },
    });
  } catch (error) {
    return failed("remove the paper", error);
  }

  revalidatePath("/reading");
  return null;
}

/**
 * Marks a paper finished, or not, which is what moves a goal's progress.
 * Finishing a paper also puts it in Continue Reading if it isn't there yet,
 * since the reader has clearly been reading it.
 */
export async function setPaperFinishedAction(formData: FormData): Promise<ActionResult> {
  const userId = await getCurrentUserId();
  if (!userId) return SIGNED_OUT;

  const paperId = String(formData.get("paperId") ?? "");
  const readingStatus = formData.get("finished") === "true" ? "COMPLETED" : "READING";

  try {
    await prisma.readingHistory.upsert({
      where: { userId_paperId: { userId, paperId } },
      update: { readingStatus },
      create: { userId, paperId, readingStatus },
    });
  } catch (error) {
    return failed("update the paper", error);
  }

  revalidatePath("/goals", "layout");
  revalidatePath(`/papers/${paperId}`);
  return null;
}
