import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Inset,
  Text,
} from "@radix-ui/themes";

import { getPaperById } from "@/services/paper.service";
import AskAiSelection from "@/components/ask-ai-selection";
import CollectionPicker from "@/components/collection-picker";
import LightTheme from "@/components/light-theme";
import PaperChat from "@/components/paper-chat";
import RecordPaperRead from "@/components/record-paper-read";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const paper = await getPaperById(id);

  return {
    title: paper?.title ?? "Paper not found",
  };
}

export default async function PaperDetailsPage({ params }: Props) {
  const { id } = await params;

  const paper = await getPaperById(id);

  if (!paper) {
    notFound();
  }

  const stats = [
    {
      label: "Published",
      value: new Date(paper.publishedDate).getFullYear(),
    },
    {
      label: "Difficulty",
      value: `${paper.difficulty}/5`,
    },
    {
      label: "Reading Time",
      value: `${paper.readingTime} min`,
    },
  ];

  return (
    <>
      <RecordPaperRead paperId={paper.id} />

      <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <div className="flex min-w-0 flex-col gap-3">
          <section className="glass-panel">
            <div>
              <Flex
                justify="between"
                align="start"
                gap="4"
                wrap="wrap"
                mb="6"
              >
                <div>
                  <Text
                    as="p"
                    size="2"
                    color="gray"
                  >
                    Paper Details
                  </Text>
                  <Heading
                    as="h1"
                    size="8"
                    mt="2"
                  >
                    {paper.title}
                  </Heading>
                  <Text
                    as="p"
                    color="gray"
                    mt="4"
                  >
                    {paper.authors.length > 0
                      ? paper.authors.join(", ")
                      : "Unknown authors"}
                  </Text>
                </div>

                <CollectionPicker
                  paperId={paper.id}
                  initialSaved={paper.saved}
                  variant="button"
                />
              </Flex>

              <Flex
                wrap="wrap"
                gap="2"
              >
                {paper.topics.map((topic) => (
                  <Badge
                    key={topic}
                    size="1"
                    radius="full"
                    color="gray"
                    className="max-w-full whitespace-normal"
                  >
                    {topic}
                  </Badge>
                ))}
              </Flex>
            </div>
          </section>

          <section className="glass-panel">
            <LightTheme>
              <div>
                <Card
                  asChild
                  size="3"
                  mb="6"
                >
                  <section>
                    <Heading
                      as="h2"
                      size="5"
                    >
                      Abstract
                    </Heading>
                    <AskAiSelection>
                      <Text
                        as="p"
                        color="gray"
                        mt="4"
                        className="leading-7"
                      >
                        {paper.abstract || "No abstract available for this paper yet."}
                      </Text>
                    </AskAiSelection>
                  </section>
                </Card>

                <Grid
                  columns={{ initial: "1", md: "3" }}
                  gap="4"
                  mb="6"
                >
                  {stats.map((stat) => (
                    <Card
                      key={stat.label}
                      size="3"
                    >
                      <Text
                        as="p"
                        size="2"
                        color="gray"
                      >
                        {stat.label}
                      </Text>
                      <Text
                        as="p"
                        weight="medium"
                        mt="1"
                      >
                        {stat.value}
                      </Text>
                    </Card>
                  ))}
                </Grid>

                {paper.pdfUrl ? (
                  <Card
                    asChild
                    size="3"
                  >
                    <section>
                      <Flex
                        justify="between"
                        align="center"
                        gap="4"
                        wrap="wrap"
                      >
                        <div>
                          <Heading
                            as="h2"
                            size="5"
                          >
                            Read Paper
                          </Heading>
                          <Text
                            as="p"
                            size="2"
                            color="gray"
                            mt="1"
                          >
                            Embedded from the open-access PDF link provided by OpenAlex.
                            If the publisher blocks embedding, open the PDF in a new tab.
                          </Text>
                        </div>

                        <Flex
                          gap="3"
                          wrap="wrap"
                        >
                          <Button asChild>
                            <a
                              href={paper.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open PDF
                            </a>
                          </Button>

                          <Button
                            asChild
                            variant="soft"
                            color="gray"
                          >
                            <a
                              href={paper.paperUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Source Page
                            </a>
                          </Button>
                        </Flex>
                      </Flex>

                      {/* Inset lets the PDF run edge to edge, past the card's padding. */}
                      <Inset
                        side="bottom"
                        clip="padding-box"
                        mt="4"
                      >
                        <iframe
                          src={paper.pdfUrl}
                          title={`PDF for ${paper.title}`}
                          className="block h-[75vh] w-full border-t border-line bg-canvas"
                        />
                      </Inset>
                    </section>
                  </Card>
                ) : (
                  <Card
                    asChild
                    size="3"
                  >
                    <section>
                      <Heading
                        as="h2"
                        size="5"
                      >
                        Read Paper
                      </Heading>
                      <Text
                        as="p"
                        color="gray"
                        mt="2"
                      >
                        OpenAlex does not have a direct PDF link for this paper. You can
                        still read it from the source or publisher page.
                      </Text>

                      <Button
                        asChild
                        size="3"
                        mt="5"
                      >
                        <a
                          href={paper.paperUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open Source Page
                        </a>
                      </Button>
                    </section>
                  </Card>
                )}
              </div>
            </LightTheme>
          </section>
        </div>

        <PaperChat paperId={paper.id} />
      </div>
    </>
  );
}
