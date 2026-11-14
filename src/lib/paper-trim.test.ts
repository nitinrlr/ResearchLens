import { describe, expect, it } from "vitest";

import { pickPapersToTrim } from "./paper-trim";

const AI = 1702;
const VISION = 1707;
const THEORY = 1703;

function paper(id: string, citations: number, subfields: number[], type = "article") {
  return { id, facts: { citations, type, subfields } };
}

describe("pickPapersToTrim", () => {
  it("picks the least-cited papers whose topics are all AI or vision", () => {
    const papers = [paper("a", 900, [AI]), paper("b", 100, [AI, VISION]), paper("c", 500, [VISION])];

    expect(pickPapersToTrim(papers, new Set(), 2).map((p) => p.id)).toEqual(["b", "c"]);
  });

  it("keeps papers with any other topic, reviews, kept papers and unknown ones", () => {
    const papers = [
      paper("mixed", 1, [AI, THEORY]),
      paper("review", 1, [AI], "review"),
      paper("saved", 1, [AI]),
      { id: "unknown", facts: undefined },
      paper("no-topics", 1, []),
    ];

    expect(pickPapersToTrim(papers, new Set(["saved"]), 10)).toEqual([]);
  });
});
