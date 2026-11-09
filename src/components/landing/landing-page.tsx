import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import { Bookmark, Calendar, Clock3 } from "lucide-react";
import { Badge, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";

import FallingPapers from "@/components/landing/falling-papers";
import FeatureReveal from "@/components/landing/feature-reveal";
import FlutedBackground from "@/components/fluted-background";
import GlassNav from "@/components/landing/glass-nav";
import SmoothScroll from "@/components/landing/smooth-scroll";
import "@/components/landing/landing.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Real papers, hardcoded so this page never waits on the database.
const SAMPLE_PAPERS = [
  { title: "Deep Residual Learning for Image Recognition", author: "Kaiming He", topics: ["Advanced Neural Network Applications", "Domain Adaptation and Few-Shot Learning"], year: 2016, readingTime: 35 },
  { title: "Neural Machine Translation by Jointly Learning to Align and Translate", author: "Dzmitry Bahdanau", topics: ["Natural Language Processing Techniques", "Speech Recognition and Synthesis"], year: 2014, readingTime: 30 },
  { title: "Playing Atari with Deep Reinforcement Learning", author: "Volodymyr Mnih", topics: ["Reinforcement Learning in Robotics", "Artificial Intelligence in Games"], year: 2013, readingTime: 30 },
];

export default function LandingPage() {
  return (
    // isolate keeps the fixed background above the page's white base.
    <div className={`${instrumentSerif.variable} relative isolate text-ink`}>
      <SmoothScroll />
      <FlutedBackground animated />
      <GlassNav />

      <main>
        {/* The extra height pins the hero until the sheet slides over it. */}
        <div id="top" className="h-[210svh] motion-reduce:h-svh">
          <section className="sticky top-0 flex h-svh items-center justify-center overflow-hidden text-white">
            <FallingPapers />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(42%_46%_at_50%_50%,rgb(7_15_43/0.72),transparent)]" />

            <div className="relative mx-auto max-w-3xl px-6 text-center">
              <h1 className="focus-in text-balance font-display text-5xl font-extrabold leading-[1] tracking-tighter sm:text-6xl md:text-7xl">
                Find the papers{" "}
                <em className="font-serif text-[1.12em] font-normal tracking-tight text-sky">worth reading</em>
              </h1>

              <p className="focus-in mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist" style={{ animationDelay: "0.15s" }}>
                Search 50,000 open-access CS papers, keep track of what you&apos;ve started, and organize what matters — in one place.
              </p>

              <div className="focus-in mt-9" style={{ animationDelay: "0.3s" }}>
                <Link href="/register" className="inline-block rounded-full bg-white px-7 py-3.5 font-medium text-night transition hover:bg-mist">
                  Start reading
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* One fixed size, leaving the background visible on both sides. */}
        <div className="relative z-10 mx-auto -mt-[100svh] w-[calc(100%-1.5rem)] max-w-[1320px] overflow-hidden sm:w-[86%] rounded-[2rem] bg-canvas shadow-[0_-20px_80px_-20px_rgb(3_8_30/0.8)] motion-reduce:mt-0">
          <section className="px-6 py-20 text-center sm:px-8 sm:py-24">
            <h2 className="text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
              A better way to <em className="font-serif text-[1.12em] font-normal text-accent">read research</em>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted">
              ResearchLens is built for students studying computer science. Instead of opening multiple browser tabs, journals, and preprint servers to find what you need, you get the most-cited open-access papers in one searchable library. With features like reading history and custom-built collections, the organization is taken care of, so you can study peacefully.
            </p>
          </section>

          <section id="features" className="scroll-mt-24 px-6 pb-24 sm:px-8">
            <FeatureReveal />
          </section>

          <section id="papers" className="scroll-mt-24 px-6 pb-24 sm:px-8">
            <Heading as="h2" size="5" align="center" className="font-display tracking-tight">
              A few of the papers inside
            </Heading>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {SAMPLE_PAPERS.map((paper) => (
                <Card key={paper.title} asChild size="3" className="flex flex-col">
                  <article>
                    <Heading as="h3" size="4" weight="medium">{paper.title}</Heading>
                    <Text as="p" size="2" color="gray" mt="2">{paper.author} et al.</Text>

                    <Flex wrap="wrap" gap="2" mt="3">
                      {paper.topics.map((topic) => (
                        <Badge key={topic} size="1" radius="full" color="gray">{topic}</Badge>
                      ))}
                    </Flex>

                    <Flex justify="between" gap="4" pt="4" className="mt-auto">
                      <Text size="2" color="gray" className="flex items-center gap-2">
                        <Calendar size={16} />
                        {paper.year}
                      </Text>
                      <Text size="2" color="gray" className="flex items-center gap-2">
                        <Clock3 size={16} />
                        {paper.readingTime} min
                      </Text>
                    </Flex>
                  </article>
                </Card>
              ))}
            </div>
          </section>

          <section className="border-t border-line bg-surface px-6 py-20 text-center">
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">Start with one paper.</h2>
            <p className="mx-auto mt-4 max-w-md text-ink-muted">Free to use.</p>
            <Button asChild size="4" mt="8">
              <Link href="/register">
                <Bookmark size={18} />
                Start reading
              </Link>
            </Button>
          </section>
        </div>
      </main>

      <footer className="mx-auto max-w-[1320px] px-6 py-10 text-sm text-mist">
        Paper metadata from{" "}
        <a href="https://openalex.org" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 transition hover:text-sky">
          OpenAlex
        </a>
        .
      </footer>
    </div>
  );
}
