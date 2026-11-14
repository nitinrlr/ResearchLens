export type PaperToRate = {
  title: string;
  abstract: string;
  topics: string[];
};

export type DifficultyRating = {
  difficulty: number;
  reason: string;
};

const MAX_REASON_LENGTH = 120;

// Long abstracts add tokens without changing the rating much.
const MAX_ABSTRACT_LENGTH = 1_500;

export const DIFFICULTY_INSTRUCTION = `You rate how hard computer science research papers are to read for a university computer science student.

Use this scale:
1 = Introductory: a survey, tutorial, overview or position paper that a first- or second-year student could follow.
2 = Accessible: an applied, systems or empirical paper with little math; CS fundamentals are enough.
3 = Intermediate: needs one upper-level course of background (such as machine learning, algorithms, networking or databases) and follows some equations.
4 = Advanced: dense math or specialized methods; assumes graduate-level background in the subfield.
5 = Expert: proof-heavy theory, or a niche specialty that assumes research-level familiarity with the field.

Judge only from the title, topics and abstract. Rate how hard the paper is to read, not how important or well known it is. Use the whole scale.

For each paper, also give a reason of at most 12 words naming the main background it assumes, such as "Assumes probability and linear algebra".

Reply with only a JSON array, one object per paper, in this form:
[{"n": 1, "difficulty": 3, "reason": "Assumes basic machine learning and neural networks"}]`;

/** The numbered list of papers sent with the instruction. */
export function buildDifficultyPrompt(papers: PaperToRate[]) {
  return papers
    .map((paper, index) =>
      [
        `Paper ${index + 1}`,
        `Title: ${paper.title}`,
        `Topics: ${paper.topics.join(", ") || "none listed"}`,
        `Abstract: ${paper.abstract.slice(0, MAX_ABSTRACT_LENGTH)}`,
      ].join("\n")
    )
    .join("\n\n");
}

/**
 * Reads the model's JSON reply. Returns a rating per paper position, skipping
 * any that are missing or malformed so those papers are simply tried again
 * on the next run.
 */
export function parseDifficultyReply(reply: string, paperCount: number) {
  const ratings = new Map<number, DifficultyRating>();
  const start = reply.indexOf("[");
  const end = reply.lastIndexOf("]");

  if (start === -1 || end < start) {
    return ratings;
  }

  let items: unknown;

  try {
    items = JSON.parse(reply.slice(start, end + 1));
  } catch {
    return ratings;
  }

  if (!Array.isArray(items)) {
    return ratings;
  }

  for (const item of items) {
    const { n, difficulty, reason } = (item ?? {}) as Record<string, unknown>;

    if (
      Number.isInteger(n) &&
      (n as number) >= 1 &&
      (n as number) <= paperCount &&
      Number.isInteger(difficulty) &&
      (difficulty as number) >= 1 &&
      (difficulty as number) <= 5 &&
      typeof reason === "string" &&
      reason.trim()
    ) {
      ratings.set(n as number, {
        difficulty: difficulty as number,
        reason: reason.trim().slice(0, MAX_REASON_LENGTH),
      });
    }
  }

  return ratings;
}
