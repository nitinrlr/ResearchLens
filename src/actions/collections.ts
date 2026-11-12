"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { DEFAULT_COLLECTION_COLOR, isCollectionColor } from "@/lib/collection-colors";
import type { CollectionColor } from "@/lib/collection-colors";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { assertOwnedCollection } from "@/services/collection.service";

/** null when the action worked, otherwise a message to show the user. */
export type ActionResult = { error: string } | null;

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 300;

const SIGNED_OUT: ActionResult = {
  error: "You've been signed out. Sign in again to keep going.",
};

const COLLECTION_GONE: ActionResult = {
  error: "That collection no longer exists. Refresh the page.",
};

/** Logs the real error for us and returns a plain one for the user. */
function failed(what: string, error: unknown): ActionResult {
  console.error(`Couldn't ${what}:`, error);

  return {
    error: `Couldn't ${what}. Try again.`,
  };
}

/** Reads the collection form, or returns the message for what's wrong with it. */
function readCollectionForm(
  formData: FormData
): { title: string; description: string | null; color: CollectionColor } | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const color = formData.get("color") ?? DEFAULT_COLLECTION_COLOR;

  if (!title || title.length > MAX_TITLE_LENGTH) {
    return {
      error: `Give the collection a title of up to ${MAX_TITLE_LENGTH} characters.`,
    };
  }

  if (!isCollectionColor(color)) {
    return {
      error: "Pick one of the colors shown.",
    };
  }

  return {
    title,
    description: description.slice(0, MAX_DESCRIPTION_LENGTH) || null,
    color,
  };
}

/*
  Server Actions are reachable by direct POST, not just through our forms, so
  each one re-checks who is signed in and whether they own the target row.

  They return an ActionResult rather than throwing. A thrown error would swap
  the whole page for the error page, which is too much for a failed click.
*/

export async function createCollectionAction(
  formData: FormData
): Promise<ActionResult> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return SIGNED_OUT;
  }

  const fields = readCollectionForm(formData);

  if ("error" in fields) {
    return fields;
  }

  let collectionId: string;

  try {
    const collection = await prisma.collection.create({
      data: {
        userId,
        ...fields,
      },
      select: {
        id: true,
      },
    });

    collectionId = collection.id;
  } catch (error) {
    return failed("create the collection", error);
  }

  // Outside the try: redirect() works by throwing, and the catch would eat it.
  revalidatePath("/collections");
  redirect(`/collections/${collectionId}`);
}

/** Changes a collection's title, description and color. */
export async function updateCollectionAction(
  formData: FormData
): Promise<ActionResult> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return SIGNED_OUT;
  }

  const collectionId = String(formData.get("collectionId") ?? "");
  const fields = readCollectionForm(formData);

  if ("error" in fields) {
    return fields;
  }

  try {
    const collection = await assertOwnedCollection(userId, collectionId);

    if (!collection) {
      return COLLECTION_GONE;
    }

    await prisma.collection.update({
      where: {
        id: collection.id,
      },
      data: fields,
    });
  } catch (error) {
    return failed("save the collection", error);
  }

  revalidatePath("/collections");
  revalidatePath(`/collections/${collectionId}`);

  return null;
}

export async function deleteCollectionAction(
  formData: FormData
): Promise<ActionResult> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return SIGNED_OUT;
  }

  const collectionId = String(formData.get("collectionId") ?? "");

  try {
    const collection = await assertOwnedCollection(userId, collectionId);

    if (!collection) {
      return COLLECTION_GONE;
    }

    // The default "Saved" collection is where the bookmark button writes, so
    // it has to stay.
    if (collection.isDefault) {
      return {
        error: "Your Saved collection can't be deleted.",
      };
    }

    await prisma.collection.delete({
      where: {
        id: collection.id,
      },
    });
  } catch (error) {
    return failed("delete the collection", error);
  }

  revalidatePath("/collections");
  redirect("/collections");
}

export async function removePaperFromCollectionAction(
  formData: FormData
): Promise<ActionResult> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return SIGNED_OUT;
  }

  const collectionId = String(formData.get("collectionId") ?? "");
  const paperId = String(formData.get("paperId") ?? "");

  try {
    const collection = await assertOwnedCollection(userId, collectionId);

    if (!collection) {
      return COLLECTION_GONE;
    }

    await prisma.collectionPaper.deleteMany({
      where: {
        collectionId,
        paperId,
      },
    });
  } catch (error) {
    return failed("remove the paper", error);
  }

  revalidatePath(`/collections/${collectionId}`);
  revalidatePath("/collections");

  return null;
}

/** Drops a paper off the Continue Reading list without touching collections. */
export async function removeFromReadingAction(
  formData: FormData
): Promise<ActionResult> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return SIGNED_OUT;
  }

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
