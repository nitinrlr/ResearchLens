import { redirect } from "next/navigation";

import Pagination from "@/components/pagination";
import PaperCard from "@/components/papercard";
import SearchField from "@/components/search-field";
import { PAGE_SIZE, pageHref, parsePage } from "@/lib/pagination";
import { getPapersPage } from "@/services/paper.service";

type Props = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function ExplorePage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q ?? "";
  const requestedPage = parsePage(params.page);

  const { papers, total, page, totalPages } = await getPapersPage(
    query,
    requestedPage
  );

  // Only search params worth carrying from page to page.
  const linkParams: Record<string, string> = query ? { q: query } : {};

  // ?page=40 on a 17-page list, or an old link after the results shrank: send
  // the visitor to the last real page so the URL matches what they see.
  if (page !== requestedPage) {
    redirect(pageHref("/explore", page, linkParams));
  }

  const firstShown = (page - 1) * PAGE_SIZE + 1;
  const lastShown = firstShown + papers.length - 1;

  return (
    <main
      id="papers"
      className="p-10"
    >
      <h1 className="mb-6 text-3xl font-bold">
        Explore Papers
      </h1>
      <form
        action="/explore"
        className="mb-8"
      >
        <SearchField
          defaultValue={query}
          placeholder="Search by title, author, or topic..."
          label="Search papers"
        />
      </form>

      {papers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line-strong p-12 text-center">
          <h2 className="text-xl font-semibold">
            No papers found
          </h2>
          <p className="mt-2 text-ink-faint">
            Try searching for another title, author, or topic.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-ink-faint">
            Showing {firstShown}–{lastShown} of {total}{" "}
            {total === 1 ? "paper" : "papers"}
            {query && (
              <>
                {" "}for &ldquo;{query}&rdquo;
              </>
            )}
          </p>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {papers.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            pathname="/explore"
            params={linkParams}
            scrollTarget="papers"
          />
        </>
      )}
    </main>
  );
}
