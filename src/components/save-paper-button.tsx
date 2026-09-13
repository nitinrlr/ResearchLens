"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";

type SavePaperButtonProps = {
  paperId: string;
  initialSaved: boolean;
};

export default function SavePaperButton({
  paperId,
  initialSaved,
}: SavePaperButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggleSaved() {
    if (loading) {
      return;
    }

    setLoading(true);

    const endpoint = saved
      ? `/api/papers/${paperId}/unsave`
      : `/api/papers/${paperId}/save`;

    const response = await fetch(endpoint, {
      method: "POST",
    });

    setLoading(false);

    if (!response.ok) {
      console.error("Failed to update saved paper");
      return;
    }

    setSaved(!saved);
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 font-medium transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Bookmark
        size={18}
        fill={saved ? "currentColor" : "none"}
        strokeWidth={saved ? 0 : 2}
        className={saved ? "text-blue-500" : "text-zinc-400"}
      />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
