"use server";

import { revalidatePath } from "next/cache";

import { failed, SIGNED_OUT } from "@/lib/action-result";
import type { ActionResult } from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { getSkillTree } from "@/lib/skill-trees";

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
