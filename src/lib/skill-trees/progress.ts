import type { Concept, SkillTree } from "./types";

/**
 * done: every paper finished. next: the first unfinished concept in its branch.
 * later: after that one. Later concepts can still be opened; the lock is a hint.
 */
type ConceptState = "done" | "next" | "later";

type ConceptProgress = {
  concept: Concept;
  state: ConceptState;
  /** How many of the concept's papers are finished. */
  finished: number;
  /** The concept to finish first, for later concepts. */
  after: Concept | null;
};

type TreeProgress = {
  branches: { title: string; concepts: ConceptProgress[] }[];
  done: number;
  total: number;
};

/** Each concept's state, from the OpenAlex ids of the papers the reader has finished. */
export function treeProgress(tree: SkillTree, finishedIds: Set<string>): TreeProgress {
  let done = 0;
  let total = 0;

  const branches = tree.branches.map((branch) => {
    let next: Concept | null = null;

    const concepts = branch.concepts.map((concept): ConceptProgress => {
      const finished = concept.papers.filter((id) => finishedIds.has(id)).length;
      const complete = finished === concept.papers.length;
      total++;

      if (complete) {
        done++;
        return { concept, state: "done", finished, after: null };
      }

      if (!next) {
        next = concept;
        return { concept, state: "next", finished, after: null };
      }

      return { concept, state: "later", finished, after: next };
    });

    return { title: branch.title, concepts };
  });

  return { branches, done, total };
}

/** Every paper id in a tree, for looking them all up at once. */
export function treePaperIds(tree: SkillTree) {
  return tree.branches.flatMap((branch) => branch.concepts.flatMap((concept) => concept.papers));
}
