import PaperCard from "@/components/papercard";
import { getAllPapers } from "@/services/paper.service";

type Paper = {
  id: string;
  title: string;
  publishedDate: Date | string;
  readingTime: number;
  difficulty: number;
  saved: boolean;
  authors: string[];
  topics: string[];
};

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function ExplorePage({ searchParams }: Props) {
  const query = (await searchParams).q ?? "";
  const papers: Paper[] = await getAllPapers(query);

  return (
    <main className="p-10">
      <h1 className="mb-6 text-3xl font-bold">
        Explore Papers
      </h1>
      <form action="/explore">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search by title, author, or topic..."
          className="mb-8 w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none focus:border-blue-500"
        />
      </form>

      {papers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 p-12 text-center">
          <h2 className="text-xl font-semibold">
            No papers found
          </h2>
          <p className="mt-2 text-zinc-500">
            Try searching for another title, author, or topic.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {papers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
            />
          ))}
        </div>
      )}
    </main>
  );
}
