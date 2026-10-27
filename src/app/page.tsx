import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  FileText,
  FolderOpen,
  Gauge,
  Search,
  Target,
} from "lucide-react";

import { Button } from "@radix-ui/themes";

import { auth } from "@/auth";

const FEATURES = [
  {
    icon: Search,
    title: "Discover",
    body: "Search by title, author, or topic across the open-access literature.",
    wide: true,
  },
  {
    icon: BookOpen,
    title: "Continue Reading",
    body: "Papers are tracked the moment you open them. Nothing to bookmark.",
    wide: false,
  },
  {
    icon: FolderOpen,
    title: "Collections",
    body: "A Saved collection to start, plus any you make yourself.",
    wide: false,
  },
  {
    icon: Gauge,
    title: "Difficulty & time",
    body: "Every paper scored 1–5, with an estimated reading time.",
    wide: false,
  },
  {
    icon: FileText,
    title: "Built-in reader",
    body: "Open-access PDFs open in the page.",
    wide: false,
  },
  {
    icon: Target,
    title: "Learning goals",
    body: "Set what you're working toward and track papers against it.",
    wide: true,
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
          {/* Soft blue wash behind the headline. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(60%_70%_at_50%_0%,color-mix(in_oklab,var(--accent-9)_14%,transparent),transparent_70%)]"
          />
          <div className="mx-auto max-w-3xl px-6 pb-20 pt-16 text-center sm:pt-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent-ink">
              <span className="block size-1.5 rounded-full bg-accent" />
              Powered by OpenAlex
            </span>
            <h1 className="mt-6 text-balance font-display text-5xl font-extrabold leading-[0.98] tracking-tighter sm:text-6xl md:text-7xl">
              Find the papers worth reading.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              Search millions of open-access CS papers, keep track of what
              you&apos;ve started, and organize what matters — in one place.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="4"
              >
                <Link href="/register">Start reading</Link>
              </Button>
              <Button
                asChild
                size="4"
                variant="soft"
                color="gray"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Bento ------------------------------------------------------ */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body, wide }) => (
              <div
                key={title}
                className={`rounded-2xl border border-line bg-surface p-6 transition hover:border-line-strong ${
                  wide ? "lg:col-span-2" : ""
                }`}
              >
                <Icon
                  size={20}
                  className="text-accent"
                  strokeWidth={2}
                />
                <h2 className="mt-4 font-display text-lg font-semibold tracking-tight">
                  {title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {body}
                </p>
              </div>
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
              Free, and your reading list is yours.
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
