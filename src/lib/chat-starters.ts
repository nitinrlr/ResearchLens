/**
 * The paper chat's starter buttons. Their answers are saved per paper, so each
 * runs on the AI model once and every later reader gets the saved copy.
 */
export const CHAT_STARTERS = {
  simple: {
    label: "Explain this simply",
    prompt:
      "Explain what this paper does and why it matters, in plain language a first-year computer science student can follow.",
  },
  mainIdea: {
    label: "What's the main idea?",
    prompt: "What is the main idea or contribution of this paper, in a few sentences?",
  },
  background: {
    label: "What should I know first?",
    prompt:
      "What background should I understand before reading this paper? List the most important concepts, each with a one-line explanation.",
  },
} as const;

export type ChatStarter = keyof typeof CHAT_STARTERS;

export function isChatStarter(value: unknown): value is ChatStarter {
  return typeof value === "string" && Object.hasOwn(CHAT_STARTERS, value);
}
