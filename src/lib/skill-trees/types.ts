/** One idea to learn, with the papers that teach it. */
export type Concept = {
  /** Unique within its tree, used in URLs and as a React key. */
  id: string;
  title: string;
  /** One line on why this matters for the role. */
  why: string;
  /** OpenAlex work ids ("W2194775991"). Finishing all of them completes the concept. */
  papers: string[];
};

/** An area of the role. Its concepts are in order: each builds on the one before. */
export type Branch = {
  title: string;
  concepts: Concept[];
};

/** A role a student can work toward, such as "Machine Learning Engineer". */
export type SkillTree = {
  /** Used in the URL, /goals/[id], and stored on the Goal. */
  id: string;
  title: string;
  summary: string;
  branches: Branch[];
};
