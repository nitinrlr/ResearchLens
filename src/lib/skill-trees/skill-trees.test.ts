import { describe, expect, it } from "vitest";

import { getSkillTree, SKILL_TREES } from "./index";

describe("SKILL_TREES", () => {
  it("has unique tree ids that work in a URL", () => {
    const ids = SKILL_TREES.map((tree) => tree.id);

    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/));
  });

  it.each(SKILL_TREES)("$title has unique concept ids, a reason and OpenAlex papers for each", (tree) => {
    const concepts = tree.branches.flatMap((branch) => branch.concepts);
    const ids = concepts.map((concept) => concept.id);

    expect(new Set(ids).size).toBe(ids.length);

    for (const concept of concepts) {
      expect(concept.why).not.toBe("");
      expect(concept.papers.length).toBeGreaterThan(0);
      concept.papers.forEach((paper) => expect(paper).toMatch(/^W\d+$/));
    }
  });

  it("finds a tree by id", () => {
    expect(getSkillTree("web-developer")?.title).toBe("Web Developer");
    expect(getSkillTree("nope")).toBeNull();
  });
});
