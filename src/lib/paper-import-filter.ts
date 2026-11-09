import type { SearchPaper } from "@/types/paper";

// Shorter than this is a stub or a placeholder, not a real abstract.
const MIN_ABSTRACT_LENGTH = 100;

/** Ignores case, spacing and punctuation, so "A-B" and "A–B" count as equal. */
function normalize(text: string) {
  return text.normalize("NFKD").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

/**
 * OpenAlex can list one work under several records, so a paper counts as
 * already known if its id, its title or its full abstract has been seen.
 */
export function paperKeys(paper: {
  externalId: string | null;
  title: string;
  abstract: string | null;
}) {
  return [
    `id:${paper.externalId}`,
    `title:${normalize(paper.title)}`,
    `abstract:${normalize(paper.abstract ?? "")}`,
  ];
}

function isComplete(paper: SearchPaper) {
  return (
    paper.pdfUrl !== null &&
    paper.authors.length > 0 &&
    (paper.abstract?.length ?? 0) >= MIN_ABSTRACT_LENGTH &&
    !Number.isNaN(paper.publishedDate.getTime())
  );
}

/** The complete, not-yet-seen papers. Adds each one it keeps to `seen`. */
export function selectNewPapers(papers: SearchPaper[], seen: Set<string>) {
  return papers.filter((paper) => {
    const keys = paperKeys(paper);

    if (!isComplete(paper) || keys.some((key) => seen.has(key))) {
      return false;
    }

    keys.forEach((key) => seen.add(key));
    return true;
  });
}
