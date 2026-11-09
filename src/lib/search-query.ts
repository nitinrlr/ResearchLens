/**
 * Turns what someone typed into a Postgres search query. Every word must match,
 * and `:*` lets a partial word match, so "transf" finds "transformer".
 *
 * Returns null when there's nothing searchable, such as only punctuation.
 */
export function toSearchQuery(query: string): string | null {
  const words = query.toLowerCase().match(/[\p{L}\p{N}]+/gu);

  return words ? words.map((word) => `${word}:*`).join(" & ") : null;
}
