import type { Metadata } from "next";
import Link from "next/link";
import { Folder, Bookmark } from "lucide-react";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";

import { getCollections } from "@/services/collection.service";
import NewCollectionForm from "@/components/new-collection-form";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Collections",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <main className="p-10 text-ink">
      <PageHeader
        title="Collections"
        description="Organize papers into custom collections."
      >
        <NewCollectionForm />
      </PageHeader>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {collections.map((collection) => (
          // As a link, the Card darkens its own border on hover.
          <Card
            key={collection.id}
            asChild
            size="3"
            className="transition-shadow duration-200 hover:shadow-lg"
          >
            <Link href={`/collections/${collection.id}`}>
              <Flex
                align="center"
                gap="3"
              >
                {collection.isDefault ? (
                  <Bookmark
                    size={20}
                    className="text-accent"
                  />
                ) : (
                  <Folder
                    size={20}
                    className="text-ink-muted"
                  />
                )}

                <Heading
                  as="h2"
                  size="4"
                  weight="medium"
                >
                  {collection.title}
                </Heading>
              </Flex>

              {collection.description && (
                <Text
                  as="p"
                  size="2"
                  color="gray"
                  mt="3"
                >
                  {collection.description}
                </Text>
              )}

              <Text
                as="p"
                size="2"
                color="gray"
                mt="4"
              >
                {collection.paperCount}{" "}
                {collection.paperCount === 1 ? "paper" : "papers"}
              </Text>
            </Link>
          </Card>
        ))}
      </div>
    </main>
  );
}
