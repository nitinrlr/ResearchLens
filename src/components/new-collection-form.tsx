"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { createCollectionAction } from "@/actions/collections";

export default function NewCollectionForm() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-accent text-white px-5 py-3 font-medium transition hover:bg-accent-strong"
      >
        <Plus size={18} />
        New Collection
      </button>
    );
  }

  return (
    <form
      action={createCollectionAction}
      className="w-full max-w-md rounded-xl border border-line bg-canvas p-5"
    >
      <label
        htmlFor="title"
        className="mb-2 block text-sm"
      >
        Title
      </label>
      <input
        id="title"
        name="title"
        required
        maxLength={100}
        autoFocus
        placeholder="e.g. Transformers"
        className="w-full rounded-md border border-line-strong bg-canvas px-4 py-3 outline-none focus:border-accent"
      />

      <label
        htmlFor="description"
        className="mb-2 mt-4 block text-sm"
      >
        Description <span className="text-ink-faint">(optional)</span>
      </label>
      <input
        id="description"
        name="description"
        maxLength={300}
        placeholder="What goes in this collection?"
        className="w-full rounded-md border border-line-strong bg-canvas px-4 py-3 outline-none focus:border-accent"
      />

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-accent text-white px-5 py-2.5 font-medium transition hover:bg-accent-strong"
        >
          Create
        </button>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-line-strong px-5 py-2.5 font-medium transition hover:bg-subtle"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
