import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@radix-ui/themes";

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
        <Button
          asChild
          variant="soft"
          color="gray"
        >
          <Link href={href(previous)}>
            <ChevronLeft size={16} />
            Previous
          </Link>
        </Button>
      ) : (
        <Button
          variant="soft"
          color="gray"
          disabled
        >
          <ChevronLeft size={16} />
          Previous
        </Button>
      )}

      {getPageItems(page, totalPages).map((item, index) =>
        item === "gap" ? (
          <span
            key={`gap-${index}`}
            aria-hidden="true"
            className="px-1.5 text-ink-faint"
          >
            …
          </span>
        ) : item === page ? (
          <Button
            key={item}
            asChild
            className="min-w-8"
          >
            <span aria-current="page">{item}</span>
          </Button>
        ) : (
          <Button
            key={item}
            asChild
            variant="soft"
            color="gray"
            className="min-w-8"
          >
            <Link
              href={href(item)}
              aria-label={`Page ${item}`}
            >
              {item}
            </Link>
          </Button>
        )
      )}

      {next ? (
        <Button
          asChild
          variant="soft"
          color="gray"
        >
          <Link href={href(next)}>
            Next
            <ChevronRight size={16} />
          </Link>
        </Button>
      ) : (
        <Button
          variant="soft"
          color="gray"
          disabled
        >
          Next
          <ChevronRight size={16} />
        </Button>
      )}
    </nav>
  );
}
