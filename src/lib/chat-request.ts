import { CHAT_STARTERS, isChatStarter } from "@/lib/chat-starters";
import type { ChatStarter } from "@/lib/chat-starters";

const MAX_MESSAGE_LENGTH = 2_000;
const MAX_QUOTE_LENGTH = 4_000;

export type ChatRequest = {
  /** What the reader typed. Empty is allowed with a quote or a starter. */
  message: string;
  /** A passage the reader highlighted with "Ask AI". */
  quote: string | null;
  starter: ChatStarter | null;
  /** The previous turn, so the model remembers the conversation. */
  previousId: string | null;
  /** Whether the full paper was already sent earlier in this conversation. */
  paperAttached: boolean;
  /** The PDF couldn't be read earlier, so don't try again. */
  paperUnavailable: boolean;
};

function optionalString(value: unknown, maxLength: number) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > maxLength) return undefined;
  return value.trim() || null;
}

/** Checks the request body. Returns null when it isn't a valid chat request. */
export function parseChatRequest(body: unknown): ChatRequest | null {
  if (typeof body !== "object" || body === null) return null;
  const input = body as Record<string, unknown>;

  const message = optionalString(input.message, MAX_MESSAGE_LENGTH);
  const quote = optionalString(input.quote, MAX_QUOTE_LENGTH);
  const previousId = optionalString(input.previousId, 500);
  const starter = input.starter === undefined || input.starter === null ? null : input.starter;

  if (message === undefined || quote === undefined || previousId === undefined) return null;
  if (starter !== null && !isChatStarter(starter)) return null;
  if (!message && !quote && !starter) return null;

  return {
    message: message ?? "",
    quote,
    starter,
    previousId,
    paperAttached: input.paperAttached === true,
    paperUnavailable: input.paperUnavailable === true,
  };
}

/** The text sent to the model for this turn. */
export function buildUserText(request: ChatRequest) {
  if (request.starter) {
    return CHAT_STARTERS[request.starter].prompt;
  }

  if (request.quote) {
    const question = request.message || "Explain this passage simply.";
    return `Passage from the paper:\n"""\n${request.quote}\n"""\n\n${question}`;
  }

  return request.message;
}

export function buildSystemInstruction(paper: {
  title: string;
  authors: string[];
  abstract: string;
  hasFullPaper: boolean;
}) {
  return [
    "You help computer science students understand one research paper.",
    `Title: ${paper.title}`,
    `Authors: ${paper.authors.join(", ") || "Unknown"}`,
    `Abstract: ${paper.abstract || "Not available."}`,
    paper.hasFullPaper
      ? "The full paper has been provided in this conversation."
      : "Only the title and abstract are available, not the full paper. If a question needs more than the abstract, say so plainly.",
    "For anything about what this paper says, did or found, use only the paper. If it doesn't say, say so instead of guessing.",
    "To explain a concept or term, you may use general computer science knowledge, and say when you're going beyond the paper.",
    "Use plain language and briefly explain any jargon. Keep answers short: a few short paragraphs or a short list.",
    'Write plain text. Use "-" for list items, and no headings, tables or bold text.',
    "If the reader quotes a passage, focus on explaining that passage.",
  ].join("\n");
}
