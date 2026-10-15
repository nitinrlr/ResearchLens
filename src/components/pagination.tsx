import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getPageItems, pageHref } from "@/lib/pagination";

type PaginationProps = {
  page: number;
  totalPages: number;
  pathname: string;
  /** Search params to keep on every page link, such as the search query. */
  params?: Record<string, string>;
  /**
   * Element id each link jumps to. Next.js keeps the scroll position on
   * navigation while the page is still on screen, so without this, clicking a
   * number at the bottom would leave you at the bottom of the next page.
   */
  scrollTarget?: string;
};

const itemClass =
  "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm transition";

export default function Pagination({
  page,
  totalPages,
  pathname,
  params = {},
  scrollTarget,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const href = (target: number) =>
    pageHref(pathname, target, params, scrollTarget);

  const previous = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-1.5"
    >
      {previous ? (
        <Link
          href={href(previous)}
          className={`${itemClass} gap-1 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900`}
        >
          <ChevronLeft size={16} />
          Previous
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={`${itemClass} gap-1 border-zinc-900 text-zinc-600`}
        >
          <ChevronLeft size={16} />
          Previous
        </span>
      )}

      {getPageItems(page, totalPages).map((item, index) =>
        item === "gap" ? (
          <span
            key={`gap-${index}`}
            aria-hidden="true"
            className="px-1.5 text-zinc-500"
          >
            …
          </span>
        ) : item === page ? (
          <span
            key={item}
            aria-current="page"
            className={`${itemClass} border-blue-600 bg-blue-600 font-medium text-white`}
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            aria-label={`Page ${item}`}
            className={`${itemClass} border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900`}
          >
            {item}
          </Link>
        )
      )}

      {next ? (
        <Link
          href={href(next)}
          className={`${itemClass} gap-1 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900`}
        >
          Next
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={`${itemClass} gap-1 border-zinc-900 text-zinc-600`}
        >
          Next
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
