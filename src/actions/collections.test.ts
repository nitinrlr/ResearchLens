import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createCollectionAction,
  deleteCollectionAction,
  removeFromReadingAction,
  removePaperFromCollectionAction,
} from "@/actions/collections";

const db = vi.hoisted(() => ({
  collection: {
    findFirst: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  collectionPaper: {
    deleteMany: vi.fn(),
  },
  readingHistory: {
    deleteMany: vi.fn(),
  },
}));

const session = vi.hoisted(() => ({
  getCurrentUserId: vi.fn(),
}));

const navigation = vi.hoisted(() => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: db }));
vi.mock("@/lib/session", () => session);
vi.mock("next/navigation", () => navigation);
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const ALICE = "user-alice";

function form(fields: Record<string, string>) {
  const formData = new FormData();

  for (const [name, value] of Object.entries(fields)) {
    formData.set(name, value);
  }

  return formData;
}

/** Every write the actions can make. None should happen when access is denied. */
function expectNoWrites() {
  expect(db.collection.create).not.toHaveBeenCalled();
  expect(db.collection.delete).not.toHaveBeenCalled();
  expect(db.collectionPaper.deleteMany).not.toHaveBeenCalled();
  expect(db.readingHistory.deleteMany).not.toHaveBeenCalled();
}

beforeEach(() => {
  session.getCurrentUserId.mockResolvedValue(ALICE);
  // Hide the expected console.error from failed-write tests.
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("signed out", () => {
  beforeEach(() => {
    session.getCurrentUserId.mockResolvedValue(null);
  });

  it.each([
    ["createCollectionAction", createCollectionAction],
    ["deleteCollectionAction", deleteCollectionAction],
    ["removePaperFromCollectionAction", removePaperFromCollectionAction],
    ["removeFromReadingAction", removeFromReadingAction],
  ])("%s refuses and changes nothing", async (_name, action) => {
    const result = await action(
      form({ title: "Mine", collectionId: "collection-1", paperId: "paper-1" })
    );

    expect(result?.error).toMatch(/signed out/);
    expectNoWrites();
  });
});

describe("createCollectionAction", () => {
  it("rejects an empty title", async () => {
    const result = await createCollectionAction(form({ title: "   " }));

    expect(result?.error).toMatch(/title/);
    expectNoWrites();
  });

  it("rejects a title over 100 characters", async () => {
    const result = await createCollectionAction(form({ title: "a".repeat(101) }));

    expect(result?.error).toMatch(/title/);
    expectNoWrites();
  });

  it("creates the collection for the signed-in user and opens it", async () => {
    db.collection.create.mockResolvedValue({ id: "new-collection" });

    await createCollectionAction(form({ title: "  Transformers  " }));

    expect(db.collection.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          userId: ALICE,
          title: "Transformers",
          description: null,
        },
      })
    );
    expect(navigation.redirect).toHaveBeenCalledWith(
      "/collections/new-collection"
    );
  });

  it("returns a friendly error when the database fails", async () => {
    db.collection.create.mockRejectedValue(new Error("connection timeout"));

    const result = await createCollectionAction(form({ title: "Transformers" }));

    expect(result).toEqual({
      error: "Couldn't create the collection. Try again.",
    });
    expect(navigation.redirect).not.toHaveBeenCalled();
  });
});

describe("deleteCollectionAction", () => {
  it("won't delete someone else's collection", async () => {
    // Scoped to Alice, the ownership check finds nothing.
    db.collection.findFirst.mockResolvedValue(null);

    const result = await deleteCollectionAction(
      form({ collectionId: "bobs-collection" })
    );

    expect(result?.error).toMatch(/no longer exists/);
    expectNoWrites();
  });

  it("won't delete the Saved collection", async () => {
    db.collection.findFirst.mockResolvedValue({ id: "saved", isDefault: true });

    const result = await deleteCollectionAction(form({ collectionId: "saved" }));

    expect(result?.error).toMatch(/Saved collection/);
    expectNoWrites();
  });

  it("deletes the user's own collection and goes back to the list", async () => {
    db.collection.findFirst.mockResolvedValue({
      id: "collection-1",
      isDefault: false,
    });

    await deleteCollectionAction(form({ collectionId: "collection-1" }));

    expect(db.collection.delete).toHaveBeenCalledWith({
      where: {
        id: "collection-1",
      },
    });
    expect(navigation.redirect).toHaveBeenCalledWith("/collections");
  });
});

describe("removePaperFromCollectionAction", () => {
  it("won't touch someone else's collection", async () => {
    db.collection.findFirst.mockResolvedValue(null);

    const result = await removePaperFromCollectionAction(
      form({ collectionId: "bobs-collection", paperId: "paper-1" })
    );

    expect(result?.error).toMatch(/no longer exists/);
    expectNoWrites();
  });

  it("removes the paper from the user's own collection", async () => {
    db.collection.findFirst.mockResolvedValue({
      id: "collection-1",
      isDefault: false,
    });

    const result = await removePaperFromCollectionAction(
      form({ collectionId: "collection-1", paperId: "paper-1" })
    );

    expect(result).toBeNull();
    expect(db.collectionPaper.deleteMany).toHaveBeenCalledWith({
      where: {
        collectionId: "collection-1",
        paperId: "paper-1",
      },
    });
  });
});

describe("removeFromReadingAction", () => {
  it("only removes from the signed-in user's own reading list", async () => {
    await removeFromReadingAction(form({ paperId: "paper-1" }));

    expect(db.readingHistory.deleteMany).toHaveBeenCalledWith({
      where: {
        userId: ALICE,
        paperId: "paper-1",
      },
    });
  });
});
