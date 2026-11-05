import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Text } from "@radix-ui/themes";

import DeleteCollectionButton from "@/components/delete-collection-button";
import EmptyState from "@/components/empty-state";
import PageHeader from "@/components/page-header";
import PaperCard from "@/components/papercard";
import RemoveButton from "@/components/remove-button";
import { getCollectionById } from "@/services/collection.service";
import { removePaperFromCollectionAction } from "@/actions/collections";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const collection = await getCollectionById(id);

  return {
    title: collection?.title ?? "Collection not found",
  };
}

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

      <div className="mt-6">
        <PageHeader
          title={collection.title}
          description={collection.description ?? undefined}
        >
          {!collection.isDefault && (
            <DeleteCollectionButton
              collectionId={collection.id}
              title={collection.title}
            />
          )}
        </PageHeader>

        <Text
          as="p"
          size="2"
          color="gray"
          mt="2"
        >
          {collection.papers.length}{" "}
          {collection.papers.length === 1 ? "paper" : "papers"}
        </Text>
      </div>

      {collection.papers.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="No papers in here yet"
            description="Use the bookmark on any paper to add it here."
          />
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {collection.papers.map((paper) => (
            <div key={paper.id}>
              <PaperCard paper={paper} />

              <div className="mt-3 flex justify-end px-1">
                <RemoveButton
                  action={removePaperFromCollectionAction}
                  fields={{
                    collectionId: collection.id,
                    paperId: paper.id,
                  }}
                >
                  Remove from collection
                </RemoveButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
