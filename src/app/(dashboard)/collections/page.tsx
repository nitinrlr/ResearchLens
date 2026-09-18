import Link from "next/link";
import { Folder, Bookmark } from "lucide-react";

import { getCollections } from "@/services/collection.service";
import NewCollectionForm from "@/components/new-collection-form";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <main className="p-10 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            Collections
          </h1>
          <p className="mt-2 text-zinc-400">
            Organize papers into custom collections.
          </p>
        </div>

        <NewCollectionForm />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-200 hover:border-zinc-600 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              {collection.isDefault ? (
                <Bookmark
                  size={20}
                  className="text-blue-500"
                />
              ) : (
                <Folder
                  size={20}
                  className="text-zinc-400"
                />
              )}

              <h2 className="text-lg font-semibold">
                {collection.title}
              </h2>
            </div>

            {collection.description && (
              <p className="mt-3 text-sm text-zinc-400">
                {collection.description}
              </p>
            )}

            <p className="mt-4 text-sm text-zinc-500">
              {collection.paperCount}{" "}
              {collection.paperCount === 1 ? "paper" : "papers"}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
