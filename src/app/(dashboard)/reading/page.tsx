import type { Metadata } from "next";

import EmptyState from "@/components/empty-state";
import PageHeader from "@/components/page-header";
import PaperCard from "@/components/papercard";
import RemoveButton from "@/components/remove-button";
import SearchField from "@/components/search-field";
import { getContinueReading } from "@/services/reading.service";
import { removeFromReadingAction } from "@/actions/collections";

export const metadata: Metadata = {
  title: "Continue Reading",
};

const DESCRIPTION = "Papers you've opened, most recent first.";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function lastReadLabel(date: Date) {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  return days === 1 ? "Yesterday" : `${days}d ago`;
}

export default async function ReadingPage({ searchParams }: Props) {
  const query = (await searchParams).q ?? "";
  const papers = await getContinueReading(query);

  if (papers.length === 0 && !query) {
    return (
      <main className="p-10 text-ink">
        <PageHeader
          title="Continue Reading"
          description={DESCRIPTION}
        />

        <div className="mt-12">
          <EmptyState
            title="Nothing here yet"
            description="Open a paper from Discover and it will show up here automatically."
          />
        </div>
      </main>
    );
  }

  return (
    <main className="p-10 text-ink">
      <PageHeader
        title="Continue Reading"
        description={DESCRIPTION}
      />

      <form
        action="/reading"
        className="mt-8"
      >
        <SearchField
          defaultValue={query}
          placeholder="Search papers you've read..."
          label="Search papers you've read"
        />
      </form>

      {papers.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="No matches"
            description="Try a different title, author, or topic."
          />
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {papers.map((paper) => (
            <div key={paper.id}>
              <PaperCard paper={paper} />

              <div className="mt-2 flex items-center justify-between px-1 text-xs text-ink-faint">
                <span>Opened {lastReadLabel(paper.lastReadAt)}</span>

                <RemoveButton
                  action={removeFromReadingAction}
                  fields={{
                    paperId: paper.id,
                  }}
                >
                  Remove
                </RemoveButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
