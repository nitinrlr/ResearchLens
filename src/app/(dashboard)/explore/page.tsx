import PaperCard from "@/components/papercard";

type Paper = {
  id: string;
  title: string;
  publishedDate: string;
  readingTime: number;
  difficulty: number;
  authors: string[];
  topics: string[];
};

async function getPapers(): Promise<Paper[]> {
  const res = await fetch("http://localhost:3000/api/papers", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch papers");
  }

  return res.json();
}

export default async function ExplorePage() {
  const papers = await getPapers();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Explore Papers
      </h1>
        <input
            type="text"
            placeholder="Search papers..."
            className="
                mb-8
                w-full
                rounded-lg
                border
                border-zinc-700
                bg-zinc-900
                p-3
                outline-none
                focus:border-blue-500"
            />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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