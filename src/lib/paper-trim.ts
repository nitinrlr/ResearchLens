import { SUBFIELDS, type WorkFacts } from "@/lib/openalex";

// Subfields whose papers are the most over-represented in the library.
const TRIMMABLE_SUBFIELDS = new Set<number>([SUBFIELDS.artificialIntelligence, SUBFIELDS.computerVision]);

type Candidate = { id: string; facts: WorkFacts | undefined };

/**
 * The `count` least-cited papers whose topics are all AI or computer vision.
 * Reviews are kept, since surveys suit beginners, and so is anything in `keep`.
 */
export function pickPapersToTrim(papers: Candidate[], keep: Set<string>, count: number) {
  return papers
    .filter(
      (paper): paper is { id: string; facts: WorkFacts } =>
        paper.facts !== undefined &&
        paper.facts.type !== "review" &&
        paper.facts.subfields.length > 0 &&
        paper.facts.subfields.every((subfield) => TRIMMABLE_SUBFIELDS.has(subfield)) &&
        !keep.has(paper.id)
    )
    .sort((a, b) => a.facts.citations - b.facts.citations || a.id.localeCompare(b.id))
    .slice(0, count);
}
