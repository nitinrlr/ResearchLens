import { dataVisualizationEngineer } from "./data-visualization-engineer";
import { machineLearningEngineer } from "./machine-learning-engineer";
import { softwareEngineer } from "./software-engineer";
import type { SkillTree } from "./types";
import { webDeveloper } from "./web-developer";

export type { Branch, Concept, SkillTree } from "./types";

/**
 * Every role a student can choose on the Goals page, in display order, most
 * common first. The full list of drafted roles is in docs/planning/skill-trees.md.
 */
export const SKILL_TREES: SkillTree[] = [softwareEngineer, webDeveloper, machineLearningEngineer, dataVisualizationEngineer];

export function getSkillTree(id: string) {
  return SKILL_TREES.find((tree) => tree.id === id) ?? null;
}
