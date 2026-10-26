import { notFound } from "next/navigation";
import { getPaperById } from "@/services/paper.service";
import CollectionPicker from "@/components/collection-picker";
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
    <main className="p-10 text-ink">
      <RecordPaperRead paperId={paper.id} />

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink-faint">
              Paper Details
            </p>
            <h1 className="mt-2 text-4xl font-bold leading-tight">
              {paper.title}
            </h1>
            <p className="mt-4 text-ink-muted">
              {paper.authors.length > 0
                ? paper.authors.join(", ")
                : "Unknown authors"}
            </p>
          </div>

          <CollectionPicker
            paperId={paper.id}
            initialSaved={paper.saved}
            variant="button"
          />
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {paper.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-subtle px-3 py-1 text-sm text-ink-muted"
            >
              {topic}
            </span>
          ))}
        </div>
        <section className="mb-8 rounded-xl border border-line bg-canvas p-6">
          <h2 className="text-xl font-semibold">
            Abstract
          </h2>

          <p className="mt-4 leading-7 text-ink-muted">
            {paper.abstract || "No abstract available for this paper yet."}
          </p>
        </section>
        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-line bg-canvas p-5">
            <p className="text-sm text-ink-faint">Published</p>
            <p className="mt-1 font-medium">
              {new Date(paper.publishedDate).getFullYear()}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-canvas p-5">
            <p className="text-sm text-ink-faint">Difficulty</p>
            <p className="mt-1 font-medium">
              {paper.difficulty}/5
            </p>
          </div>
          <div className="rounded-xl border border-line bg-canvas p-5">
            <p className="text-sm text-ink-faint">Reading Time</p>
            <p className="mt-1 font-medium">
              {paper.readingTime} min
            </p>
          </div>
        </section>
        {paper.pdfUrl ? (
          <section className="mb-8 overflow-hidden rounded-xl border border-line bg-canvas">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Read Paper
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Embedded from the open-access PDF link provided by OpenAlex.
                  If the publisher blocks embedding, open the PDF in a new tab.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-accent text-white px-4 py-2 font-medium transition hover:bg-accent-strong"
                >
                  Open PDF
                </a>

                <a
                  href={paper.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-line-strong px-4 py-2 font-medium transition hover:bg-subtle"
                >
                  Source Page
                </a>
              </div>
            </div>

            <iframe
              src={paper.pdfUrl}
              title={`PDF for ${paper.title}`}
              className="h-[75vh] w-full bg-canvas"
            />
          </section>
        ) : (
          <section className="mb-8 rounded-xl border border-line bg-canvas p-6">
            <h2 className="text-xl font-semibold">
              Read Paper
            </h2>
            <p className="mt-2 text-ink-muted">
              OpenAlex does not have a direct PDF link for this paper. You can
              still read it from the source or publisher page.
            </p>

            <a
              href={paper.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-lg bg-accent text-white px-5 py-3 font-medium transition hover:bg-accent-strong"
            >
              Open Source Page
            </a>
          </section>
        )}
      </div>
    </main>
  );
}
