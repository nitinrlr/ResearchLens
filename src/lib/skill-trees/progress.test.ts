import { describe, expect, it } from "vitest";

import { treePaperIds, treeProgress } from "./progress";
import type { SkillTree } from "./types";

const tree: SkillTree = {
  id: "test",
  title: "Test role",
  summary: "",
  branches: [
    {
      title: "Basics",
      concepts: [
        { id: "a", title: "A", why: "", papers: ["W1"] },
        { id: "b", title: "B", why: "", papers: ["W2", "W3"] },
        { id: "c", title: "C", why: "", papers: ["W4"] },
      ],
    },
    { title: "Other", concepts: [{ id: "d", title: "D", why: "", papers: ["W5"] }] },
  ],
};

describe("treeProgress", () => {
  it("marks the first unfinished concept in each branch as next, and the rest as later", () => {
    const progress = treeProgress(tree, new Set(["W1", "W2"]));
    const [basics, other] = progress.branches;

    expect(basics.concepts.map((c) => c.state)).toEqual(["done", "next", "later"]);
    expect(basics.concepts[1].finished).toBe(1);
    expect(basics.concepts[2].after?.id).toBe("b");
    expect(other.concepts[0].state).toBe("next");
    expect(progress).toMatchObject({ done: 1, total: 4 });
  });

  it("counts a concept done even when it's finished out of order", () => {
    const [basics] = treeProgress(tree, new Set(["W4"])).branches;

    expect(basics.concepts.map((c) => c.state)).toEqual(["next", "later", "done"]);
  });
});

describe("treePaperIds", () => {
  it("lists every paper in the tree", () => {
    expect(treePaperIds(tree)).toEqual(["W1", "W2", "W3", "W4", "W5"]);
  });
});
