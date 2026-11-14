// Minutes per page at each difficulty: harder papers take longer per page.
export const MINUTES_PER_PAGE: Record<number, number> = {
  1: 1.5,
  2: 2.5,
  3: 3.3,
  4: 4.1,
  5: 5.1,
};

/** "35 min", or a dash while the reading time isn't known yet. */
export function formatReadingTime(minutes: number | null) {
  return minutes ? `${minutes} min` : "—";
}

/** "3/5", or a dash while the paper isn't rated yet. */
export function formatDifficulty(difficulty: number | null) {
  return difficulty ? `${difficulty}/5` : "—";
}

/** Minutes to read a paper, or null until both its page count and difficulty are known. */
export function readingTimeFor(pageCount: number | null, difficulty: number | null) {
  const perPage = difficulty === null ? undefined : MINUTES_PER_PAGE[difficulty];

  if (!pageCount || pageCount < 1 || perPage === undefined) {
    return null;
  }

  return Math.max(1, Math.round(pageCount * perPage));
}
