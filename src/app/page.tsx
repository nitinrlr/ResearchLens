import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  Calendar,
  Clock3,
  FileText,
  FolderOpen,
  Search,
} from "lucide-react";

import { Badge, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";

import { auth } from "@/auth";

// absolute skips the "| ResearchLens" template from the root layout, which
// would repeat the name here.
export const metadata: Metadata = {
  title: {
    absolute: "ResearchLens: Find the papers worth reading",
  },
};

const FEATURES = [
  {
    icon: Search,
    title: "Discover",
    body: "Search titles, abstracts, authors, and topics across the most-cited open-access CS papers.",
    wide: true,
  },
  {
    icon: BookOpen,
    title: "Continue Reading",
    body: "Papers are added the moment you open them, most recent first.",
    wide: false,
  },
  {
    icon: FolderOpen,
    title: "Collections",
    body: "A Saved collection to start, plus any you make yourself.",
    wide: false,
  },
  {
    icon: FileText,
    title: "Built-in reader",
    body: "Open-access PDFs open right in the page, when the publisher allows it.",
    wide: true,
  },
];

// Real records from the database, written out here so the landing page never
// has to wait on a cold database just to show a preview.
const SAMPLE_PAPERS = [
  {
    title: "Deep Residual Learning for Image Recognition",
    author: "Kaiming He",
    topics: ["Advanced Neural Network Applications", "Domain Adaptation and Few-Shot Learning"],
    year: 2016,
    readingTime: 35,
  },
  {
    title: "Neural Machine Translation by Jointly Learning to Align and Translate",
    author: "Dzmitry Bahdanau",
    topics: ["Natural Language Processing Techniques", "Speech Recognition and Synthesis"],
    year: 2014,
    readingTime: 30,
  },
  {
    title: "Playing Atari with Deep Reinforcement Learning",
    author: "Volodymyr Mnih",
    topics: ["Reinforcement Learning in Robotics", "Artificial Intelligence in Games"],
    year: 2013,
    readingTime: 30,
  },
];

export default async function HomePage() {
  // Someone already signed in has no use for the pitch.
  const session = await auth();

  if (session?.user) {
    redirect("/explore");
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <span className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
          <span className="block size-5 rounded-md bg-accent" />
          ResearchLens
        </span>
        <Button
          asChild
          variant="soft"
          color="gray"
        >
          <Link href="/login">Sign in</Link>
        </Button>
      </header>
      <main>
        {/* Hero ------------------------------------------------------- */}
        <section className="relative overflow-hidden">
          {/* Soft accent-colored wash behind the headline. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(60%_70%_at_50%_0%,color-mix(in_oklab,var(--accent-9)_14%,transparent),transparent_70%)]"
          />
          <div className="mx-auto max-w-3xl px-6 pb-16 pt-16 text-center sm:pt-24">
            <Badge
              size="2"
              radius="full"
              variant="surface"
            >
              Powered by OpenAlex
            </Badge>
            <h1 className="mt-6 text-balance font-display text-5xl font-extrabold leading-[0.98] tracking-tighter sm:text-6xl md:text-7xl">
              Find the papers worth reading.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              Search 1,000 open-access CS papers, keep track of what you&apos;ve
              started, and organize what matters — in one place.
            </p>
            <Button
              asChild
              size="4"
              mt="8"
            >
              <Link href="/register">Start reading</Link>
            </Button>
          </div>
        </section>

        {/* Preview ---------------------------------------------------- */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <Heading
            as="h2"
            size="5"
            align="center"
            className="font-display tracking-tight"
          >
            A few of the papers inside
          </Heading>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {SAMPLE_PAPERS.map((paper) => (
              <Card
                key={paper.title}
                asChild
                size="3"
                className="flex flex-col"
              >
                <article>
                  <Heading
                    as="h3"
                    size="4"
                    weight="medium"
                  >
                    {paper.title}
                  </Heading>

                  <Text
                    as="p"
                    size="2"
                    color="gray"
                    mt="2"
                  >
                    {paper.author} et al.
                  </Text>

                  <Flex
                    wrap="wrap"
                    gap="2"
                    mt="3"
                  >
                    {paper.topics.map((topic) => (
                      <Badge
                        key={topic}
                        size="1"
                        radius="full"
                        color="gray"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </Flex>

                  <Flex
                    justify="between"
                    gap="4"
                    pt="4"
                    className="mt-auto"
                  >
                    <Text
                      size="2"
                      color="gray"
                      className="flex items-center gap-2"
                    >
                      <Calendar size={16} />
                      {paper.year}
                    </Text>

                    <Text
                      size="2"
                      color="gray"
                      className="flex items-center gap-2"
                    >
                      <Clock3 size={16} />
                      {paper.readingTime} min
                    </Text>
                  </Flex>
                </article>
              </Card>
            ))}
          </div>
        </section>

        {/* Bento ------------------------------------------------------ */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body, wide }) => (
              <Card
                key={title}
                size="3"
                className={wide ? "lg:col-span-2" : ""}
              >
                <Icon
                  size={20}
                  className="text-accent"
                  strokeWidth={2}
                />
                <Heading
                  as="h2"
                  size="4"
                  mt="4"
                  className="font-display tracking-tight"
                >
                  {title}
                </Heading>
                <Text
                  as="p"
                  size="2"
                  color="gray"
                  mt="2"
                >
                  {body}
                </Text>
              </Card>
            ))}
          </div>
        </section>

        {/* Closing ---------------------------------------------------- */}
        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Start with one paper.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-ink-muted">
              Free to use.
            </p>
            <Button
              asChild
              size="4"
              mt="8"
            >
              <Link href="/register">
                <Bookmark size={18} />
                Start reading
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-ink-faint">
        <p>
          Paper metadata from{" "}
          <a
            href="https://openalex.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline underline-offset-4 transition hover:text-accent-ink"
          >
            OpenAlex
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
