import type { SearchPaper } from "@/types/paper";

// Shorter than this is a stub or a placeholder, not a real abstract.
const MIN_ABSTRACT_LENGTH = 100;

const MIN_ENGLISH_WORDS = 20;

const ENGLISH_WORDS = new Set(
  "the of and to for that with this are by".split(" ")
);

// Common words in other languages that are rarely also people's names, since
// some OpenAlex abstracts are just a list of authors.
const FOREIGN_WORDS = new Set(
  (
    "yang dengan untuk dalam pada dari adalah " +
    "los las para por una que con " +
    "les des une est dans pour sur " +
    "das und ist mit für " +
    "het een voor wordt dit zijn " +
    "uma não della che"
  ).split(" ")
);

/**
 * OpenAlex's own language label is often wrong, and it can call a paper English
 * when only its title is. So this checks the words actually used.
 */
export function isEnglish(text: string) {
  const letters = text.match(/\p{L}/gu) ?? [];
  const latin = text.match(/\p{Script=Latin}/gu) ?? [];

  if (latin.length < letters.length * 0.7) {
    return false;
  }

  const words = text.toLowerCase().match(/\p{L}+/gu) ?? [];
  const english = words.filter((word) => ENGLISH_WORDS.has(word)).length;
  const foreign = words.filter((word) => FOREIGN_WORDS.has(word)).length;

  // Plenty of English means an English paper, even with a translation attached.
  return foreign < 5 || foreign <= english || english >= MIN_ENGLISH_WORDS;
}

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
    isEnglish(`${paper.title} ${paper.abstract}`) &&
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
