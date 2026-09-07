import PaperCard from "@/components/papercard";
import { getSavedPapers } from "@/services/paper.service";

export default async function SavedPage() {
  const papers = await getSavedPapers();

  return (
    <main className="p-10">
      <h1 className="mb-6 text-3xl font-bold">
        Saved Papers
      </h1>

      <div className="grid grid-cols-3 gap-6">
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