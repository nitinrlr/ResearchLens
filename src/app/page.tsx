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
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <span className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
          <span className="block size-5 rounded-md bg-blue-600" />
          ResearchLens
        </span>
        <Link
          href="/login"
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:border-zinc-300 hover:bg-zinc-50"
        >
          Sign in
        </Link>
      </header>
      <main>
        {/* Hero ------------------------------------------------------- */}
        <section className="relative overflow-hidden">
          {/* Soft blue wash behind the headline. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(60%_70%_at_50%_0%,rgba(37,99,235,0.14),transparent_70%)]"
          />
          <div className="mx-auto max-w-3xl px-6 pb-20 pt-16 text-center sm:pt-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-medium text-blue-700">
              <span className="block size-1.5 rounded-full bg-blue-600" />
              Powered by OpenAlex
            </span>
            <h1 className="mt-6 text-balance font-display text-5xl font-extrabold leading-[0.98] tracking-tighter sm:text-6xl md:text-7xl">
              Find the papers worth reading.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
              Search millions of open-access CS papers, keep track of what
              you&apos;ve started, and organize what matters — in one place.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-blue-500"
              >
                Start reading
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-zinc-200 px-6 py-3 font-medium transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* Bento ------------------------------------------------------ */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body, wide }) => (
              <div
                key={title}
                className={`rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6 transition hover:border-zinc-300 hover:bg-zinc-50 ${
                  wide ? "lg:col-span-2" : ""
                }`}
              >
                <Icon
                  size={20}
                  className="text-blue-600"
                  strokeWidth={2}
                />
                <h2 className="mt-4 font-display text-lg font-semibold tracking-tight">
                  {title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing ---------------------------------------------------- */}
        <section className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Start with one paper.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-zinc-600">
              Free, and your reading list is yours.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-blue-500"
            >
              <Bookmark size={18} />
              Start reading
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-500">
        <p>
          Paper metadata from{" "}
          <a
            href="https://openalex.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-700 underline underline-offset-4 transition hover:text-blue-600"
          >
            OpenAlex
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
