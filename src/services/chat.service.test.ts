import { describe, expect, it, vi } from "vitest";

import { DAILY_MESSAGE_LIMIT, refundChatMessage, spendChatMessage } from "@/services/chat.service";

const db = vi.hoisted(() => ({
  chatUsage: {
    upsert: vi.fn(),
    updateMany: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: db }));

describe("spendChatMessage", () => {
  it("allows messages up to the daily limit", async () => {
    db.chatUsage.upsert.mockResolvedValue({ messages: DAILY_MESSAGE_LIMIT });

    expect(await spendChatMessage("user-1")).toBe(true);
  });

  it("refuses once the limit is used up", async () => {
    db.chatUsage.upsert.mockResolvedValue({ messages: DAILY_MESSAGE_LIMIT + 1 });

    expect(await spendChatMessage("user-1")).toBe(false);
  });

  it("counts in the database, per user and per day", async () => {
    db.chatUsage.upsert.mockResolvedValue({ messages: 1 });

    await spendChatMessage("user-1");

    const call = db.chatUsage.upsert.mock.calls[0][0];
    expect(call.where.userId_day.userId).toBe("user-1");
    expect(call.where.userId_day.day.toISOString()).toMatch(/T00:00:00.000Z$/);
    expect(call.update).toEqual({ messages: { increment: 1 } });
  });
});

describe("refundChatMessage", () => {
  it("never takes the count below zero", async () => {
    await refundChatMessage("user-1");

    expect(db.chatUsage.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: "user-1", messages: { gt: 0 } }),
        data: { messages: { decrement: 1 } },
      })
    );
  });
});
