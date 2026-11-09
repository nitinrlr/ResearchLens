export type PaperView = "grid" | "list";

export const PAPER_VIEW_COOKIE = "paper-view";

/** Anything other than "list" falls back to the default boxes. */
export function parsePaperView(value: string | undefined): PaperView {
  return value === "list" ? "list" : "grid";
}
