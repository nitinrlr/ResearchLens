export const PAGE_SIZE = 25;

/**
 * Turns a `?page=` search param into a page number. Anything that isn't a
 * positive whole number (missing, "abc", "0", "2.5") falls back to page 1.
 */
export function parsePage(value: string | undefined) {
  const page = Number(value);

  return Number.isInteger(page) && page >= 1 ? page : 1;
}

/**
 * Builds the URL for one page of a list, keeping its other search params.
 * Page 1 gets no `page` param so each page has exactly one URL.
 */
export function pageHref(
  pathname: string,
  page: number,
  params: Record<string, string> = {},
  hash?: string
) {
  const search = new URLSearchParams(params);

  if (page > 1) {
    search.set("page", String(page));
  }

  const query = search.toString();

  return `${pathname}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

/**
 * The page numbers to show, with "gap" where a run of pages is skipped.
 *
 * Always shows the first page, the last page, and the current page with one
 * neighbor on each side: 1 … 7 8 9 … 17. Near either end it shows the first or
 * last five pages instead (1 2 3 4 5 … 17), so the row stays the same width as
 * you click through.
 */
export function getPageItems(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set([1, total, current - 1, current, current + 1]);

  if (current <= 4) {
    [2, 3, 4, 5].forEach((page) => pages.add(page));
  }

  if (current >= total - 3) {
    [total - 4, total - 3, total - 2, total - 1].forEach((page) =>
      pages.add(page)
    );
  }

  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const items: (number | "gap")[] = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      items.push("gap");
    }

    items.push(page);
  });

  return items;
}
