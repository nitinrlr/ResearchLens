"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";

type Collection = {
  id: string;
  title: string;
  isDefault: boolean;
  containsPaper: boolean;
};

type CollectionPickerProps = {
  paperId: string;
  /** Whether the paper is in any of the user's collections when the page rendered. */
  initialSaved: boolean;
  /** "icon" for paper cards, "button" (icon plus label) for the paper page. */
  variant?: "icon" | "button";
};

export default function CollectionPicker({
  paperId,
  initialSaved,
  variant = "icon",
}: CollectionPickerProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[] | null>(null);
  // False while this opening's fresh copy of the list is still loading. A list
  // from an earlier opening is shown meanwhile, but can't be edited yet.
  const [fresh, setFresh] = useState(false);
  const [pending, setPending] = useState<ReadonlySet<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Bumped on every opening so a slow response from an earlier one is ignored.
  const loadIdRef = useRef(0);
  // Set when a checkbox change is saved. The page refreshes once, on close,
  // rather than after every click: on a collection's own page, unchecking that
  // collection would otherwise remove this card while the picker is open.
  const changedRef = useRef(false);

  // Before anything has loaded, fall back to what the server rendered.
  const saved = collections
    ? collections.some((collection) => collection.containsPaper)
    : initialSaved;

  const close = useCallback(() => {
    setOpen(false);

    if (changedRef.current) {
      changedRef.current = false;
      router.refresh();
    }
  }, [router]);

  async function openPicker() {
    const loadId = ++loadIdRef.current;

    setOpen(true);
    setFresh(false);
    setError(null);

    try {
      const response = await fetch(`/api/papers/${paperId}/collections`);

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const data = (await response.json()) as { collections: Collection[] };

      if (loadId === loadIdRef.current) {
        setCollections(data.collections);
        setFresh(true);
      }
    } catch {
      if (loadId === loadIdRef.current) {
        setError("Couldn't load your collections. Close this and try again.");
      }
    }
  }

  function setContains(collectionId: string, containsPaper: boolean) {
    setCollections((current) =>
      current?.map((collection) =>
        collection.id === collectionId
          ? { ...collection, containsPaper }
          : collection
      ) ?? null
    );
  }

  async function toggle(collection: Collection) {
    if (pending.has(collection.id)) {
      return;
    }

    const adding = !collection.containsPaper;

    // Optimistic: tick the box now, undo it if the request fails.
    setContains(collection.id, adding);
    setPending((current) => new Set(current).add(collection.id));
    setError(null);

    try {
      const response = await fetch(
        `/api/collections/${collection.id}/papers/${paperId}`,
        {
          method: adding ? "PUT" : "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      changedRef.current = true;
    } catch {
      setContains(collection.id, !adding);
      setError(
        `Couldn't ${adding ? "add this to" : "remove this from"} "${collection.title}". Try again.`
      );
    } finally {
      setPending((current) => {
        const next = new Set(current);
        next.delete(collection.id);
        return next;
      });
    }
  }

  // Close on a click anywhere outside the picker, or on Escape.
  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  const icon = (
    <Bookmark
      size={variant === "icon" ? 20 : 18}
      fill={saved ? "currentColor" : "none"}
      strokeWidth={saved ? 0 : 2}
      className={saved ? "text-accent" : "text-ink-muted"}
    />
  );

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : openPicker())}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={variant === "icon" ? "Save to collection" : undefined}
        className={
          variant === "icon"
            ? "-m-1 rounded-md p-1 transition hover:bg-subtle"
            : "inline-flex items-center gap-2 rounded-lg border border-line-strong px-4 py-2 font-medium transition hover:bg-subtle"
        }
      >
        {icon}
        {variant === "button" && (saved ? "Saved" : "Save")}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Save to collection"
          className={`absolute top-full z-20 mt-2 w-64 rounded-xl border border-line bg-canvas p-1.5 text-left shadow-lg ${
            // The paper page's button sits at the left on phones and the right
            // on wider screens, so the panel opens toward the screen's middle.
            variant === "icon" ? "right-0" : "left-0 sm:left-auto sm:right-0"
          }`}
        >
          <p className="px-3 pb-1.5 pt-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
            Save to
          </p>

          {collections === null ? (
            !error && (
              <p className="flex items-center gap-2 px-3 py-2 text-sm text-ink-muted">
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                Loading…
              </p>
            )
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {collections.map((collection) => (
                <li key={collection.id}>
                  <label
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink transition hover:bg-subtle ${
                      fresh ? "cursor-pointer" : "opacity-60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={collection.containsPaper}
                      disabled={!fresh || pending.has(collection.id)}
                      onChange={() => toggle(collection)}
                      className="size-4 shrink-0 accent-accent"
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {collection.title}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}

          {error && (
            <p
              role="alert"
              className="px-3 py-2 text-xs text-danger"
            >
              {error}
            </p>
          )}

          <div className="my-1.5 border-t border-line" />

          <Link
            href="/collections"
            className="block rounded-lg px-3 py-2 text-sm text-ink-muted transition hover:bg-subtle hover:text-ink"
          >
            Manage collections
          </Link>
        </div>
      )}
    </div>
  );
}
