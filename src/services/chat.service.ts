import { prisma } from "@/lib/prisma";
import type { ChatStarter } from "@/lib/chat-starters";

/** Messages each reader can send per day, to stay within the free AI tier. */
export const DAILY_MESSAGE_LIMIT = 30;

/** Today's date in UTC, which is what the daily limit counts by. */
function today() {
  return new Date(new Date().toISOString().slice(0, 10));
}

/**
 * Counts one chat message against the reader's daily limit. Returns false
 * when they've already used it up. The increment happens in the database, so
 * two messages sent at once can't both slip under the limit.
 */
export async function spendChatMessage(userId: string) {
  const day = today();

  const usage = await prisma.chatUsage.upsert({
    where: { userId_day: { userId, day } },
    create: { userId, day, messages: 1 },
    update: { messages: { increment: 1 } },
    select: { messages: true },
  });

  return usage.messages <= DAILY_MESSAGE_LIMIT;
}

/** Gives a message back when the AI failed before answering it. */
export async function refundChatMessage(userId: string) {
  await prisma.chatUsage.updateMany({
    where: { userId, day: today(), messages: { gt: 0 } },
    data: { messages: { decrement: 1 } },
  });
}

export function getSavedAnswer(paperId: string, starter: ChatStarter) {
  return prisma.paperChatAnswer.findUnique({
    where: { paperId_starter: { paperId, starter } },
    select: { answer: true, source: true },
  });
}

export async function saveAnswer(
  paperId: string,
  starter: ChatStarter,
  answer: string,
  source: "pdf" | "abstract"
) {
  await prisma.paperChatAnswer.upsert({
    where: { paperId_starter: { paperId, starter } },
    create: { paperId, starter, answer, source },
    update: {},
  });
}
