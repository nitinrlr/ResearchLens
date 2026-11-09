import { describe, expect, it } from "vitest";

import { isEnglish, paperKeys, selectNewPapers } from "./paper-import-filter";
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

describe("isEnglish", () => {
  it("accepts an English abstract", () => {
    expect(isEnglish("We present a framework for the training of networks that are deeper.")).toBe(true);
  });

  it("accepts an abstract that is only a list of authors", () => {
    expect(isEnglish("Dan Jurafsky, Maria de la Cruz, Jan van der Berg, Ana Del Rio, Dan Klein")).toBe(true);
  });

  it("accepts an English abstract followed by a translation", () => {
    const english = "We show that the model and the data are useful for this task. ".repeat(4);
    const french = "On montre que les modèles dans des cas pour une méthode sur les données. ".repeat(4);

    expect(isEnglish(`${english} ${french}`)).toBe(true);
  });

  it.each([
    ["Indonesian", "Media yang digunakan dalam proses belajar untuk siswa dengan guru pada sekolah dari kota adalah baik"],
    ["Spanish", "En los ultimos años, el aumento para las decisiones que por una empresa con datos para los clientes"],
    ["French", "On introduit dans les espaces des fonctions une notion pour les équations et une méthode dans des cas pour"],
    ["German", "Das System ist mit der Methode und das Modell ist für die Daten und das Ergebnis ist mit dem Test"],
    ["Dutch", "Dit proefschrift heeft als onderwerp het clusteren van grafen en een methode voor het zoeken dit wordt in een model"],
    ["Chinese", "在对提出的归一化差异水体指数分析的基础上提出了改进的指数"],
  ])("rejects %s", (_language, text) => {
    expect(isEnglish(text)).toBe(false);
  });
});

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
