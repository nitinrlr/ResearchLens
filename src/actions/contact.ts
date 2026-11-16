"use server";

import type { ActionResult } from "@/actions/collections";
import { isLikelyBot, readContactForm } from "@/lib/contact-form";
import { prisma } from "@/lib/prisma";

// More than this from one email in an hour is almost certainly not a person.
const MAX_MESSAGES_PER_HOUR = 3;

/**
 * Saves a message from the landing page's Contact menu. Anyone can send one,
 * signed in or not, so it checks every field again on the server.
 */
export async function sendContactMessageAction(formData: FormData): Promise<ActionResult> {
  // Pretend it worked, so a bot has no reason to try again.
  if (isLikelyBot(formData)) {
    return null;
  }

  const fields = readContactForm(formData);

  if ("error" in fields) {
    return fields;
  }

  try {
    const recent = await prisma.contactMessage.count({
      where: {
        email: fields.email,
        createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) },
      },
    });

    if (recent >= MAX_MESSAGES_PER_HOUR) {
      return { error: "We've got your earlier messages. Try again in an hour." };
    }

    await prisma.contactMessage.create({ data: fields });
  } catch (error) {
    console.error("Couldn't save a contact message:", error);
    return { error: "Couldn't send your message. Try again." };
  }

  return null;
}
