import { Bookmark, Calendar, Clock3, Star } from "lucide-react";

type PaperCardProps = {
  paper: {
    id: string;
    title: string;
    publishedDate: string;
    readingTime: number;
    difficulty: number;
    authors: string[];
    topics: string[];
  };
};

export default function PaperCard({ paper }: PaperCardProps) {
  return (
    <div className="flex h-min-h-[320px] flex-col rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow transition hover:border-zinc-500 hover:shadow-lg">
        <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold leading-snug text-white">
                {paper.title}
            </h2>
            <button
                className="
                rounded-full
                p-2
                text-zinc-400
                transition
                hover:bg-zinc-800
                hover:text-white"
            >
                <Bookmark size={20} />
            </button>
        </div>
            <p className="mt-2 text-sm text-zinc-400">
                {paper.authors.length > 0
                    ? `${paper.authors[0]} et al.`
                    : "Unknown Author"}
            </p>
        <div className="mt-3 flex flex-wrap gap-2">
            {paper.topics.slice(0, 3).map((topic) => (
                <span
                key={topic}
                className="rounded-full bg-zinc-800 px-3 py-1 text-xs"
                >
                {topic}
                </span>
            ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
            <Calendar size={16} />
            <span>{new Date(paper.publishedDate).getFullYear()}</span>
        </div>
        <div className="mt-auto flex justify-end gap-4">
            <div className="flex gap-1.5">
                <Star size={16} />
                <div>
                    <p className="text-xs text-zinc-500">
                        Difficulty
                    </p>
                    <p>{paper.difficulty}/5</p>
                </div>
            </div>
            <div className="flex gap-1.5">
                <Clock3 size={16} />
                <div>
                    <p className="text-xs text-zinc-500">
                        Reading Time
                    </p>
                    <p>{paper.readingTime} min</p>
                </div>
            </div>
        </div>
    </div>
  );
}