"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { assertOwnedCollection } from "@/services/collection.service";

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 300;

/**
 * Server Actions are reachable by direct POST, not just through our forms, so
 * each one re-checks who is signed in and whether they own the target row.
 */
async function requireUserId() {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

export async function createCollectionAction(formData: FormData) {
  const userId = await requireUserId();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title || title.length > MAX_TITLE_LENGTH) {
    return;
  }

  const collection = await prisma.collection.create({
    data: {
      userId,
      title,
      description: description.slice(0, MAX_DESCRIPTION_LENGTH) || null,
    },
    select: {
      id: true,
    },
  });

  revalidatePath("/collections");
  redirect(`/collections/${collection.id}`);
}

export async function deleteCollectionAction(formData: FormData) {
  const userId = await requireUserId();

  const collectionId = String(formData.get("collectionId") ?? "");
  const collection = await assertOwnedCollection(userId, collectionId);

  if (!collection) {
    throw new Error("Collection not found");
  }

  // The default "Saved" collection is where the bookmark button writes, so it
  // has to stay.
  if (collection.isDefault) {
    throw new Error("The default collection cannot be deleted");
  }

  await prisma.collection.delete({
    where: {
      id: collection.id,
    },
  });

  revalidatePath("/collections");
  redirect("/collections");
}

export async function removePaperFromCollectionAction(formData: FormData) {
  const userId = await requireUserId();

  const collectionId = String(formData.get("collectionId") ?? "");
  const paperId = String(formData.get("paperId") ?? "");

  const collection = await assertOwnedCollection(userId, collectionId);

  if (!collection) {
    throw new Error("Collection not found");
  }

  await prisma.collectionPaper.deleteMany({
    where: {
      collectionId,
      paperId,
    },
  });

  revalidatePath(`/collections/${collectionId}`);
  revalidatePath("/collections");
}

/** Drops a paper off the Continue Reading list without touching collections. */
export async function removeFromReadingAction(formData: FormData) {
  const userId = await requireUserId();

  const paperId = String(formData.get("paperId") ?? "");

  await prisma.readingHistory.deleteMany({
    where: {
      userId,
      paperId,
    },
  });

  revalidatePath("/reading");
}
