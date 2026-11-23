"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/actions/collections";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { getSkillTree } from "@/lib/skill-trees";

const SIGNED_OUT: ActionResult = {
  error: "You've been signed out. Sign in again to keep going.",
};

function failed(what: string, error: unknown): ActionResult {
  console.error(`Couldn't ${what}:`, error);
  return { error: `Couldn't ${what}. Try again.` };
}

/** Adds a role to the user's goals. Following twice is harmless. */
export async function followTreeAction(formData: FormData): Promise<ActionResult> {
  const userId = await getCurrentUserId();
  if (!userId) return SIGNED_OUT;

  const tree = getSkillTree(String(formData.get("treeId") ?? ""));
  if (!tree) return { error: "That role doesn't exist. Refresh the page." };

  try {
    await prisma.goal.upsert({
      where: { userId_treeId: { userId, treeId: tree.id } },
      update: {},
      create: { userId, treeId: tree.id, title: tree.title },
    });
  } catch (error) {
    return failed("follow this role", error);
  }

  revalidatePath("/goals", "layout");
  return null;
}

/** Removes a role from the user's goals. Papers they finished stay finished. */
export async function unfollowTreeAction(formData: FormData): Promise<ActionResult> {
  const userId = await getCurrentUserId();
  if (!userId) return SIGNED_OUT;

  const treeId = String(formData.get("treeId") ?? "");

  try {
    await prisma.goal.deleteMany({ where: { userId, treeId } });
  } catch (error) {
    return failed("stop following this role", error);
  }

  revalidatePath("/goals", "layout");
  return null;
}

/**
 * Marks a paper finished, or not. Finishing a paper also puts it in Continue
 * Reading if it isn't there yet, since the reader has clearly been reading it.
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
