import type { Metadata } from "next";
import Link from "next/link";
import { Folder, Bookmark } from "lucide-react";
import { Card, Heading, Text } from "@radix-ui/themes";

import { getCollections } from "@/services/collection.service";
import CollectionDialog from "@/components/collection-dialog";
import PageHeader from "@/components/page-header";
import SearchField from "@/components/search-field";
import { collectionColor } from "@/lib/collection-colors";

export const metadata: Metadata = {
  title: "Collections",
};

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function CollectionsPage({ searchParams }: Props) {
  const query = (await searchParams).q ?? "";
  const collections = await getCollections(query);

  return (
    <>
      <section className="glass-panel">
        <PageHeader
          title="Collections"
          description="Organize papers into custom collections."
        >
          <form
            action="/collections"
            className="w-full max-w-md self-center"
          >
            <SearchField
              defaultValue={query}
              placeholder="Search collections..."
              label="Search collections"
            />
          </form>
        </PageHeader>
      </section>

      <section className="glass-panel">
        {query && collections.length === 0 && (
          <Text
            as="p"
            color="gray"
            mb="5"
          >
            No collections match &ldquo;{query}&rdquo;.
          </Text>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => {
            const color = collectionColor(collection.color);
            const Icon = collection.isDefault ? Bookmark : Folder;

            return (
              <Card
                key={collection.id}
                asChild
                size="3"
                className="solid-glass tinted-card relative transition-shadow duration-200 hover:shadow-lg has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-(--focus-8)"
                style={{ "--tint": color.fill } as React.CSSProperties}
              >
                <article>
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-9 shrink-0 place-items-center rounded-lg ring-1 ring-white/15"
                      style={{ background: color.fill, color: color.ink }}
                    >
                      <Icon size={18} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <Heading
                        as="h2"
                        size="4"
                        weight="medium"
                        className="break-words"
                      >
                        {/* Stretched over the card, so the "…" button can sit outside the link. */}
                        <Link
                          href={`/collections/${collection.id}`}
                          className="outline-none after:absolute after:inset-0"
                        >
                          {collection.title}
                        </Link>
                      </Heading>

                      {collection.description && (
                        <Text
                          as="p"
                          size="2"
                          color="gray"
                          mt="2"
                        >
                          {collection.description}
                        </Text>
                      )}
                    </div>

                    {/* The Saved collection is the bookmark button's target, so it keeps its name. */}
                    {!collection.isDefault && (
                      <div className="relative">
                        <CollectionDialog collection={collection} />
                      </div>
                    )}
                  </div>

                  <Text
                    as="p"
                    size="2"
                    color="gray"
                    mt="4"
                  >
                    {collection.paperCount}{" "}
                    {collection.paperCount === 1 ? "paper" : "papers"}
                  </Text>
                </article>
              </Card>
            );
          })}

          <CollectionDialog />
        </div>
      </section>
    </>
  );
}
