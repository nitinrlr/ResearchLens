import PaperCard from "@/components/papercard";
import { getSavedPapers } from "@/services/paper.service";

export default async function SavedPage() {
  const papers = await getSavedPapers();

  if (papers.length === 0) {
    return (
      <main className="p-10 text-white">
        <h1 className="text-4xl font-bold">
          Saved Papers
        </h1>

        <p className="mt-2 text-zinc-400">
          Papers you've bookmarked for later reading.
        </p>

        <div className="mt-12 rounded-xl border border-dashed border-zinc-700 p-16 text-center">
          <h2 className="text-2xl font-semibold">
            Nothing saved yet
          </h2>

          <p className="mt-3 text-zinc-500">
            Bookmark papers from the Explore page to build your reading list.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="mb-6 text-3xl font-bold">
        Saved Papers
      </h1>
      <input
        type="text"
        placeholder="Search saved papers..."
        className="mt-8 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 outline-none transition focus:border-blue-500"
      />

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {papers.map((paper) => (
          <PaperCard
            key={paper.id}
            paper={paper}
          />
        ))}
      </div>
    </main>
  );
}