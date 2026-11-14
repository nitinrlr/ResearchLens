import { describe, expect, it } from "vitest";

import { buildDifficultyPrompt, parseDifficultyReply } from "./difficulty";

describe("buildDifficultyPrompt", () => {
  it("numbers each paper with its title, topics and abstract", () => {
    const prompt = buildDifficultyPrompt([
      { title: "A", abstract: "About A.", topics: ["Topic Modeling"] },
      { title: "B", abstract: "About B.", topics: [] },
    ]);

    expect(prompt).toContain("Paper 1\nTitle: A\nTopics: Topic Modeling\nAbstract: About A.");
    expect(prompt).toContain("Paper 2\nTitle: B\nTopics: none listed");
  });
});

describe("parseDifficultyReply", () => {
  it("reads ratings, even with text or code fences around the JSON", () => {
    const reply = 'Here you go:\n```json\n[{"n": 1, "difficulty": 2, "reason": " Basic ML "}, {"n": 2, "difficulty": 5, "reason": "Proofs"}]\n```';

    expect(parseDifficultyReply(reply, 2)).toEqual(
      new Map([
        [1, { difficulty: 2, reason: "Basic ML" }],
        [2, { difficulty: 5, reason: "Proofs" }],
      ])
    );
  });

  it("skips ratings that are out of range, for unknown papers, or missing a reason", () => {
    const reply = JSON.stringify([
      { n: 1, difficulty: 0, reason: "x" },
      { n: 2, difficulty: 3.5, reason: "x" },
      { n: 3, difficulty: 3, reason: "" },
      { n: 9, difficulty: 3, reason: "x" },
      { n: 4, difficulty: 4, reason: "Fine" },
    ]);

    expect([...parseDifficultyReply(reply, 4).keys()]).toEqual([4]);
  });

  it("returns nothing for a reply that isn't JSON", () => {
    expect(parseDifficultyReply("Sorry, I can't help with that.", 3).size).toBe(0);
    expect(parseDifficultyReply("[not json]", 3).size).toBe(0);
  });
});
