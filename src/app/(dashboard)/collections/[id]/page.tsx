import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import PaperCard from "@/components/papercard";
import { getCollectionById } from "@/services/collection.service";
import {
  deleteCollectionAction,
  removePaperFromCollectionAction,
} from "@/actions/collections";

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
    <main className="p-10 text-white">
      <Link
        href="/collections"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
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
            <p className="mt-2 text-zinc-400">
              {collection.description}
            </p>
          )}

          <p className="mt-2 text-sm text-zinc-500">
            {collection.papers.length}{" "}
            {collection.papers.length === 1 ? "paper" : "papers"}
          </p>
        </div>

        {!collection.isDefault && (
          <form action={deleteCollectionAction}>
            <input
              type="hidden"
              name="collectionId"
              value={collection.id}
            />
            <button
              type="submit"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium transition hover:border-red-500/60 hover:bg-red-950/40 hover:text-red-400"
            >
              Delete collection
            </button>
          </form>
        )}
      </div>

      {collection.papers.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-zinc-700 p-16 text-center">
          <h2 className="text-2xl font-semibold">
            No papers in here yet
          </h2>
          <p className="mt-3 text-zinc-500">
            {collection.isDefault
              ? "Tap the bookmark on any paper to add it here."
              : "Papers you add to this collection will appear here."}
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {collection.papers.map((paper) => (
            <div key={paper.id}>
              <PaperCard paper={paper} />

              <div className="mt-2 flex justify-end px-1 text-xs text-zinc-500">
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
                  <button
                    type="submit"
                    className="transition hover:text-red-400"
                  >
                    Remove from collection
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
