import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  assertOwnedCollection,
  getCollectionById,
  getDefaultCollectionId,
} from "@/services/collection.service";

const db = vi.hoisted(() => ({
  collection: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
}));

const session = vi.hoisted(() => ({
  getCurrentUserId: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: db }));
vi.mock("@/lib/session", () => session);

const ALICE = "user-alice";

describe("getCollectionById", () => {
  it("returns null when nobody is signed in, without querying", async () => {
    session.getCurrentUserId.mockResolvedValue(null);

    expect(await getCollectionById("collection-1")).toBeNull();
    expect(db.collection.findFirst).not.toHaveBeenCalled();
  });

  it("only looks among the signed-in user's own collections", async () => {
    session.getCurrentUserId.mockResolvedValue(ALICE);
    db.collection.findFirst.mockResolvedValue(null);

    await getCollectionById("collection-1");

    expect(db.collection.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "collection-1",
          userId: ALICE,
        },
      })
    );
  });

  it("returns null for someone else's collection", async () => {
    session.getCurrentUserId.mockResolvedValue(ALICE);
    // Scoped to Alice, the query finds nothing for Bob's collection.
    db.collection.findFirst.mockResolvedValue(null);

    expect(await getCollectionById("bobs-collection")).toBeNull();
  });
});

describe("assertOwnedCollection", () => {
  it("checks the id and the owner together", async () => {
    db.collection.findFirst.mockResolvedValue(null);

    await assertOwnedCollection(ALICE, "collection-1");

    expect(db.collection.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "collection-1",
          userId: ALICE,
        },
      })
    );
  });

  it("returns the collection when the user owns it", async () => {
    const owned = { id: "collection-1", isDefault: false };
    db.collection.findFirst.mockResolvedValue(owned);

    expect(await assertOwnedCollection(ALICE, "collection-1")).toEqual(owned);
  });
});

describe("getDefaultCollectionId", () => {
  beforeEach(() => {
    db.collection.create.mockResolvedValue({ id: "new-saved" });
  });

  it("returns the existing Saved collection", async () => {
    db.collection.findFirst.mockResolvedValue({ id: "saved-1" });

    expect(await getDefaultCollectionId(ALICE)).toBe("saved-1");
    expect(db.collection.create).not.toHaveBeenCalled();
  });

  it("recreates Saved if it went missing", async () => {
    db.collection.findFirst.mockResolvedValue(null);

    expect(await getDefaultCollectionId(ALICE)).toBe("new-saved");
    expect(db.collection.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: ALICE,
          title: "Saved",
          isDefault: true,
        }),
      })
    );
  });
});
