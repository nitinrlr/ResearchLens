// Minutes per page at each difficulty: harder papers take longer per page.
export const MINUTES_PER_PAGE: Record<number, number> = {
  1: 1.5,
  2: 2.5,
  3: 3.3,
  4: 4.1,
  5: 5.1,
};

/**
 * "35 min", "1 h 30 min", or whole hours ("30 h") past ten hours, where the
 * minutes stop mattering (some entries are whole books). A dash while unknown.
 */
export function formatReadingTime(minutes: number | null) {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes} min`;
  if (minutes >= 600) return `${Math.round(minutes / 60)} h`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return rest ? `${hours} h ${rest} min` : `${hours} h`;
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
