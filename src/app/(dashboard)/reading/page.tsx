import PaperCard from "@/components/papercard";
import { getContinueReading } from "@/services/reading.service";
import { removeFromReadingAction } from "@/actions/collections";

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
      <main className="p-10 text-white">
        <h1 className="text-4xl font-bold">
          Continue Reading
        </h1>
        <p className="mt-2 text-zinc-400">
          Papers you&apos;ve opened, most recent first.
        </p>
        <div className="mt-12 rounded-xl border border-dashed border-zinc-700 p-16 text-center">
          <h2 className="text-2xl font-semibold">
            Nothing here yet
          </h2>
          <p className="mt-3 text-zinc-500">
            Open a paper from Discover and it will show up here automatically.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-10 text-white">
      <h1 className="text-3xl font-bold">
        Continue Reading
      </h1>
      <p className="mt-2 text-zinc-400">
        Papers you&apos;ve opened, most recent first.
      </p>

      <form action="/reading">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search papers you've read..."
          className="mt-8 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 outline-none transition focus:border-blue-500"
        />
      </form>

      {papers.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-zinc-700 p-12 text-center">
          <h2 className="text-xl font-semibold">
            No matches
          </h2>
          <p className="mt-2 text-zinc-500">
            Try a different title, author, or topic.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {papers.map((paper) => (
            <div key={paper.id}>
              <PaperCard paper={paper} />

              <div className="mt-2 flex items-center justify-between px-1 text-xs text-zinc-500">
                <span>Opened {lastReadLabel(paper.lastReadAt)}</span>

                <form action={removeFromReadingAction}>
                  <input
                    type="hidden"
                    name="paperId"
                    value={paper.id}
                  />
                  <button
                    type="submit"
                    className="transition hover:text-red-400"
                  >
                    Remove
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
