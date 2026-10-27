import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@radix-ui/themes";

import DeleteCollectionButton from "@/components/delete-collection-button";
import PaperCard from "@/components/papercard";
import { getCollectionById } from "@/services/collection.service";
import { removePaperFromCollectionAction } from "@/actions/collections";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CollectionDetailPage({ params }: Props) {
  const { id } = await params;
  const collection = await getCollectionById(id);

  // getCollectionById returns null for collections owned by someone else, so
  // guessing an id gives a 404 rather than a peek at another user's list.
  if (!collection) {
    notFound();
  }

  return (
    <main className="p-10 text-ink">
      <Link
        href="/collections"
        className="inline-flex items-center gap-2 text-sm text-ink-muted transition hover:text-ink"
      >
        <ArrowLeft size={16} />
        All collections
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            {collection.title}
          </h1>

          {collection.description && (
            <p className="mt-2 text-ink-muted">
              {collection.description}
            </p>
          )}

          <p className="mt-2 text-sm text-ink-faint">
            {collection.papers.length}{" "}
            {collection.papers.length === 1 ? "paper" : "papers"}
          </p>
        </div>

        {!collection.isDefault && (
          <DeleteCollectionButton
            collectionId={collection.id}
            title={collection.title}
          />
        )}
      </div>

      {collection.papers.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-line-strong p-16 text-center">
          <h2 className="text-2xl font-semibold">
            No papers in here yet
          </h2>
          <p className="mt-3 text-ink-faint">
            Use the bookmark on any paper to add it here.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {collection.papers.map((paper) => (
            <div key={paper.id}>
              <PaperCard paper={paper} />

              <div className="mt-3 flex justify-end px-1">
                <form action={removePaperFromCollectionAction}>
                  <input
                    type="hidden"
                    name="collectionId"
                    value={collection.id}
                  />
                  <input
                    type="hidden"
                    name="paperId"
                    value={paper.id}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    color="gray"
                    size="1"
                  >
                    Remove from collection
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
