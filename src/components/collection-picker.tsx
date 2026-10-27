"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Bookmark } from "lucide-react";
import {
  Button,
  Checkbox,
  Flex,
  IconButton,
  Popover,
  Separator,
  Spinner,
  Text,
} from "@radix-ui/themes";

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

/*
  Radix's Popover handles closing on an outside click or Escape, returning
  focus to the bookmark, and keyboard navigation. It also renders the panel at
  the top of the page and flips it upward when there's no room below, so it
  can't be covered by the next card or open off the bottom of the screen.
*/
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

  async function loadCollections() {
    const loadId = ++loadIdRef.current;

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

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      loadCollections();
    } else if (changedRef.current) {
      changedRef.current = false;
      router.refresh();
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

  const icon = (
    <Bookmark
      size={variant === "icon" ? 20 : 16}
      fill={saved ? "currentColor" : "none"}
      strokeWidth={saved ? 0 : 2}
    />
  );

  return (
    <Popover.Root
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Popover.Trigger>
        {variant === "icon" ? (
          <IconButton
            variant="ghost"
            color={saved ? "blue" : "gray"}
            size="2"
            aria-label="Save to collection"
          >
            {icon}
          </IconButton>
        ) : (
          <Button
            variant="soft"
            color={saved ? "blue" : "gray"}
            size="3"
          >
            {icon}
            {saved ? "Saved" : "Save"}
          </Button>
        )}
      </Popover.Trigger>

      <Popover.Content
        size="1"
        width="260px"
        align="end"
        aria-label="Save to collection"
      >
        <Text
          as="p"
          size="1"
          weight="medium"
          color="gray"
          mb="2"
          className="uppercase tracking-wide"
        >
          Save to
        </Text>

        {collections === null ? (
          !error && (
            <Flex
              align="center"
              gap="2"
              py="1"
            >
              <Spinner size="1" />
              <Text
                size="2"
                color="gray"
              >
                Loading…
              </Text>
            </Flex>
          )
        ) : (
          <Flex
            direction="column"
            gap="1"
            className="max-h-64 overflow-y-auto"
          >
            {collections.map((collection) => (
              <Text
                key={collection.id}
                as="label"
                size="2"
                className={`rounded-md px-1 py-1.5 transition hover:bg-subtle ${
                  fresh ? "cursor-pointer" : "opacity-60"
                }`}
              >
                <Flex
                  align="center"
                  gap="2"
                >
                  <Checkbox
                    checked={collection.containsPaper}
                    disabled={!fresh || pending.has(collection.id)}
                    onCheckedChange={() => toggle(collection)}
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {collection.title}
                  </span>
                </Flex>
              </Text>
            ))}
          </Flex>
        )}

        {error && (
          <Text
            as="p"
            role="alert"
            size="1"
            color="red"
            mt="2"
          >
            {error}
          </Text>
        )}

        <Separator
          size="4"
          my="2"
        />

        <Button
          asChild
          variant="soft"
          color="gray"
          size="2"
          className="w-full"
        >
          <Link href="/collections">
            Manage collections
          </Link>
        </Button>
      </Popover.Content>
    </Popover.Root>
  );
}
