import { notFound } from "next/navigation";
import { getPaperById } from "@/services/paper.service";
import SavePaperButton from "@/components/save-paper-button";
import RecordPaperRead from "@/components/record-paper-read";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PaperDetailsPage({ params }: Props) {
  const { id } = await params;

  const paper = await getPaperById(id);

  if (!paper) {
    notFound();
  }

  return (
    <main className="p-10 text-white">
      <RecordPaperRead paperId={paper.id} />

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">
              Paper Details
            </p>
            <h1 className="mt-2 text-4xl font-bold leading-tight">
              {paper.title}
            </h1>
            <p className="mt-4 text-zinc-400">
              {paper.authors.length > 0
                ? paper.authors.join(", ")
                : "Unknown authors"}
            </p>
          </div>

          <SavePaperButton
            paperId={paper.id}
            initialSaved={paper.saved}
          />
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {paper.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300"
            >
              {topic}
            </span>
          ))}
        </div>
        <section className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold">
            Abstract
          </h2>

          <p className="mt-4 leading-7 text-zinc-300">
            {paper.abstract || "No abstract available for this paper yet."}
          </p>
        </section>
        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-500">Published</p>
            <p className="mt-1 font-medium">
              {new Date(paper.publishedDate).getFullYear()}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-500">Difficulty</p>
            <p className="mt-1 font-medium">
              {paper.difficulty}/5
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-500">Reading Time</p>
            <p className="mt-1 font-medium">
              {paper.readingTime} min
            </p>
          </div>
        </section>
        {paper.pdfUrl ? (
          <section className="mb-8 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 p-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Read Paper
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Embedded from the open-access PDF link provided by OpenAlex.
                  If the publisher blocks embedding, open the PDF in a new tab.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-blue-600 px-4 py-2 font-medium transition hover:bg-blue-500"
                >
                  Open PDF
                </a>

                <a
                  href={paper.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-zinc-700 px-4 py-2 font-medium transition hover:bg-zinc-800"
                >
                  Source Page
                </a>
              </div>
            </div>

            <iframe
              src={paper.pdfUrl}
              title={`PDF for ${paper.title}`}
              className="h-[75vh] w-full bg-white"
            />
          </section>
        ) : (
          <section className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-semibold">
              Read Paper
            </h2>
            <p className="mt-2 text-zinc-400">
              OpenAlex does not have a direct PDF link for this paper. You can
              still read it from the source or publisher page.
            </p>

            <a
              href={paper.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500"
            >
              Open Source Page
            </a>
          </section>
        )}
      </div>
    </main>
  );
}
