import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Text } from "@radix-ui/themes";

import EmptyState from "@/components/empty-state";
import PageHeader from "@/components/page-header";
import Pagination from "@/components/pagination";
import PaperCard from "@/components/papercard";
import SearchField from "@/components/search-field";
import { PAGE_SIZE, pageHref, parsePage } from "@/lib/pagination";
import { getPapersPage } from "@/services/paper.service";

export const metadata: Metadata = {
  title: "Explore",
};

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
    <>
      <section
        id="papers"
        className="glass-panel scroll-mt-3"
      >
        <PageHeader title="Explore Papers" />

        <form
          action="/explore"
          className="mt-6"
        >
          <SearchField
            defaultValue={query}
            placeholder="Search by title, author, or topic..."
            label="Search papers"
          />
        </form>
      </section>

      <section className="glass-panel">
        {papers.length === 0 ? (
          <EmptyState
            title="No papers found"
            description="Try searching for another title, author, or topic."
          />
        ) : (
          <>
            <Text
              as="p"
              size="2"
              color="gray"
              mb="5"
            >
              Showing {firstShown}–{lastShown} of {total}{" "}
              {total === 1 ? "paper" : "papers"}
              {query && (
                <>
                  {" "}for &ldquo;{query}&rdquo;
                </>
              )}
            </Text>

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
      </section>
    </>
  );
}
