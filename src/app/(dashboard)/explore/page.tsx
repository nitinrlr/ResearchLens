import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Heading, Text } from "@radix-ui/themes";

import EmptyState from "@/components/empty-state";
import Pagination from "@/components/pagination";
import PaperCard from "@/components/papercard";
import PaperList from "@/components/paper-list";
import SearchField from "@/components/search-field";
import TopicMarquee from "@/components/topic-marquee";
import { filterParams } from "@/lib/explore-filters";
import { PAGE_SIZE, pageHref, parsePage } from "@/lib/pagination";
import { PAPER_VIEW_COOKIE, parsePaperView } from "@/lib/paper-view";
import { getPapersPage, getPopularTopics } from "@/services/paper.service";

export const metadata: Metadata = {
  title: "Explore",
};

type Props = {
  searchParams: Promise<{
    q?: string;
    topic?: string;
    page?: string;
  }>;
};

export default async function ExplorePage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q ?? "";
  const topic = params.topic ?? "";
  const requestedPage = parsePage(params.page);

  const [{ papers, total, page, totalPages }, topics] = await Promise.all([
    getPapersPage(query, requestedPage, topic),
    getPopularTopics(),
  ]);

  // Only search params worth carrying from page to page.
  const linkParams = filterParams({ query, topic });

  // ?page=40 on a 17-page list, or an old link after the results shrank: send
  // the visitor to the last real page so the URL matches what they see.
  if (page !== requestedPage) {
    redirect(pageHref("/explore", page, linkParams));
  }

  const firstShown = (page - 1) * PAGE_SIZE + 1;
  const lastShown = firstShown + papers.length - 1;
  const view = parsePaperView((await cookies()).get(PAPER_VIEW_COOKIE)?.value);

  return (
    <>
      <section
        id="papers"
        className="glass-panel scroll-mt-3"
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Heading
            as="h1"
            size="8"
            className="shrink-0"
          >
            Explore Papers
          </Heading>

          <TopicMarquee
            topics={topics}
            activeTopic={topic}
            query={query}
          />
        </div>

        <form
          action="/explore"
          className="mt-6"
        >
          {/* A new search keeps the picked topic. */}
          {topic && (
            <input
              type="hidden"
              name="topic"
              value={topic}
            />
          )}
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
            description={
              topic
                ? "Try another search, or click the highlighted topic to clear it."
                : "Try searching for another title, author, or topic."
            }
          />
        ) : (
          <>
            <PaperList
              initialView={view}
              summary={
                <Text
                  as="p"
                  size="2"
                  color="gray"
                >
                  Showing {firstShown}–{lastShown} of {total}{" "}
                  {total === 1 ? "paper" : "papers"}
                  {query && (
                    <>
                      {" "}for &ldquo;{query}&rdquo;
                    </>
                  )}
                  {topic && <> in {topic}</>}
                </Text>
              }
            >
              {papers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                />
              ))}
            </PaperList>

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
