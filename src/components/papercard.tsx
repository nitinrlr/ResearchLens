"use client";
import Link from "next/link";
import { Bookmark, Calendar, Clock3, Star } from "lucide-react";
import { useState } from "react";

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

const [saved, setSaved] = useState(paper.saved);

    async function toggleSaved() {
        const endpoint = saved
            ? `/api/papers/${paper.id}/unsave`
            : `/api/papers/${paper.id}/save`;

        const response = await fetch(endpoint, {
            method: "POST",
        });

        if (!response.ok) {
            console.error("Failed");
            return;
        }

        setSaved(!saved);
    }
  
    return (
    <Link href={`/papers/${paper.id}`} className="block rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all duration-200 hover:border-zinc-600 hover:shadow-lg">
        <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold leading-snug text-white">
                {paper.title}
            </h2>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSaved();
                }}
            >
                <Bookmark
                    size={20}
                    fill={saved ? "currentColor" : "none"}
                    strokeWidth={saved ? 0 : 2}
                    className={saved ? "text-blue-500" : "text-zinc-400"}
                />
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
    </Link>
  );
}
