import Link from "next/link";
import { Calendar, Clock3, Star } from "lucide-react";

import CollectionPicker from "@/components/collection-picker";

type PaperCardProps = {
  paper: {
    id: string;
    title: string;
    publishedDate: Date | string;
    readingTime: number;
    difficulty: number;
    saved: boolean;
    authors: string[];
    topics: string[];
  };
};

export default function PaperCard({ paper }: PaperCardProps) {
  return (
    <article className="relative rounded-xl border border-line bg-canvas p-5 transition-all duration-200 hover:border-line-strong hover:shadow-lg has-[a:focus-visible]:border-accent">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold leading-snug text-ink">
          {/*
            The ::after overlay stretches this link across the whole card, so
            the card stays clickable without the picker's checkboxes having to
            live inside an <a> (invalid HTML, and their clicks would navigate).
          */}
          <Link
            href={`/papers/${paper.id}`}
            className="outline-none after:absolute after:inset-0 after:rounded-xl"
          >
            {paper.title}
          </Link>
        </h2>

        {/*
          `relative` alone puts this above the link overlay: positioned
          elements without a z-index paint in page order, and this comes after
          the link. Giving it a z-index would trap the open panel's z-20 inside
          this card, letting the next card's bookmark draw over the panel.
        */}
        <div className="relative shrink-0">
          <CollectionPicker
            paperId={paper.id}
            initialSaved={paper.saved}
          />
        </div>
      </div>

      <p className="mt-2 text-sm text-ink-muted">
        {paper.authors.length > 0
          ? `${paper.authors[0]} et al.`
          : "Unknown Author"}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {paper.topics.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="rounded-full bg-subtle px-3 py-1 text-xs"
          >
            {topic}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
        <Calendar size={16} />
        <span>{new Date(paper.publishedDate).getFullYear()}</span>
      </div>

      <div className="mt-auto flex justify-end gap-4">
        <div className="flex gap-1.5">
          <Star size={16} />
          <div>
            <p className="text-xs text-ink-faint">
              Difficulty
            </p>
            <p>{paper.difficulty}/5</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Clock3 size={16} />
          <div>
            <p className="text-xs text-ink-faint">
              Reading Time
            </p>
            <p>{paper.readingTime} min</p>
          </div>
        </div>
      </div>
    </article>
  );
}
