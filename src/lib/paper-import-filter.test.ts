import { describe, expect, it } from "vitest";

import { paperKeys, selectNewPapers } from "./paper-import-filter";
import type { SearchPaper } from "@/types/paper";

const ABSTRACT = "This abstract is long enough to count as a real one. ".repeat(3);

function paper(overrides: Partial<SearchPaper> = {}): SearchPaper {
  return {
    externalId: "W1",
    title: "Learning Phrase Representations",
    abstract: ABSTRACT,
    publishedDate: new Date("2014-01-01"),
    paperUrl: "https://example.com/1",
    pdfUrl: "https://example.com/1.pdf",
    readingTime: 30,
    authors: [{ openAlexId: "A1", name: "Kyunghyun Cho", institution: null }],
    topics: [{ name: "Topic Modeling" }],
    ...overrides,
  };
}

describe("selectNewPapers", () => {
  it("keeps a complete paper it hasn't seen", () => {
    const seen = new Set<string>();

    expect(selectNewPapers([paper()], seen)).toHaveLength(1);
    expect(seen.has(paperKeys(paper())[0])).toBe(true);
  });

  it("skips a paper already in the database", () => {
    const seen = new Set(paperKeys(paper()));

    expect(selectNewPapers([paper()], seen)).toHaveLength(0);
  });

  it("treats titles differing only by case or punctuation as the same paper", () => {
    const papers = [
      paper({ title: "RNN Encoder-Decoder" }),
      paper({ externalId: "W2", title: "rnn encoder–decoder", abstract: `Other. ${ABSTRACT}` }),
    ];

    expect(selectNewPapers(papers, new Set())).toHaveLength(1);
  });

  it("treats a matching abstract under a different title as the same paper", () => {
    const papers = [paper(), paper({ externalId: "W2", title: "Same Work: A Survey" })];

    expect(selectNewPapers(papers, new Set())).toHaveLength(1);
  });

  it.each([
    ["no PDF link", { pdfUrl: null }],
    ["no authors", { authors: [] }],
    ["a stub abstract", { abstract: "Too short." }],
    ["an invalid date", { publishedDate: new Date("not a date") }],
  ])("skips a paper with %s", (_label, overrides) => {
    expect(selectNewPapers([paper(overrides)], new Set())).toHaveLength(0);
  });
});
