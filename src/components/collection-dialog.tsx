"use client";

import { useState, useTransition } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, IconButton, Text, TextArea, TextField } from "@radix-ui/themes";

import { createCollectionAction, deleteCollectionAction, updateCollectionAction } from "@/actions/collections";
import { COLLECTION_COLORS, DEFAULT_COLLECTION_COLOR, isCollectionColor } from "@/lib/collection-colors";
import type { CollectionColor } from "@/lib/collection-colors";
import { runAction } from "@/lib/run-action";

type CollectionDialogProps =
  | { collection?: undefined }
  | { collection: { id: string; title: string; description: string | null; color: string } };

/**
 * Creates a collection (opened from the dashed "New Collection" box) or edits
 * one (opened from its "…" button). Both ask for a title, description and color.
 * Editing also has a trash button, which asks before deleting.
 */
export default function CollectionDialog({ collection }: CollectionDialogProps) {
  const editing = collection !== undefined;
  const startColor = editing && isCollectionColor(collection.color) ? collection.color : DEFAULT_COLLECTION_COLOR;

  const [open, setOpen] = useState(false);
  const [color, setColor] = useState<CollectionColor>(startColor);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onOpenChange(next: boolean) {
    setOpen(next);
    // Reopening starts fresh rather than showing an unsaved pick or old error.
    if (next) {
      setColor(startColor);
      setConfirmingDelete(false);
      setError(null);
    }
  }

  // onSubmit rather than <form action>: React clears a form after an action
  // runs, even a failed one, and the reader would have to retype everything.
  // Creating redirects to the new collection, so it only returns on failure.
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const message = await runAction(editing ? updateCollectionAction : createCollectionAction, formData);
      setError(message);
      if (!message) setOpen(false);
    });
  }

  // On success the action reloads /collections, which removes this card and
  // its dialog, so it only returns when something went wrong.
  function deleteCollection() {
    if (!editing) return;
    const formData = new FormData();
    formData.set("collectionId", collection.id);

    startTransition(async () => {
      setError(await runAction(deleteCollectionAction, formData));
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger>
        {editing ? (
          <IconButton variant="ghost" color="gray" aria-label={`Edit ${collection.title}`}>
            <DotsHorizontalIcon width={18} height={18} />
          </IconButton>
        ) : (
          <button
            type="button"
            className="flex min-h-36 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/25 text-accent-ink transition-colors hover:border-white/45 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-(--focus-8)"
          >
            <Plus size={18} />
            New Collection
          </button>
        )}
      </Dialog.Trigger>

      <Dialog.Content maxWidth="460px" className="bg-[#0d1638] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)]">
        {editing && !confirmingDelete && (
          <IconButton
            variant="soft"
            color="red"
            aria-label={`Delete ${collection.title}`}
            onClick={() => setConfirmingDelete(true)}
            className="absolute right-6 top-6"
          >
            <Trash2 size={16} />
          </IconButton>
        )}

        <Dialog.Title>{confirmingDelete ? "Delete collection" : editing ? "Edit collection" : "New collection"}</Dialog.Title>
        <Dialog.Description size="2" color="gray" mb="5">
          {confirmingDelete
            ? "Are you sure?"
            : editing
              ? "Change its name, description or color."
              : "Group papers you want to keep together."}
        </Dialog.Description>

        {editing && confirmingDelete ? (
          <div className="flex flex-col gap-4">
            <Text as="p" size="2">
              Delete &ldquo;{collection.title}&rdquo;? The papers in it stay in any other
              collections they&apos;re in. This can&apos;t be undone.
            </Text>

            {error && (
              <Text as="p" role="alert" size="2" color="red">
                {error}
              </Text>
            )}

            <Flex gap="3" justify="end" mt="2">
              <Button type="button" variant="soft" color="gray" onClick={() => setConfirmingDelete(false)}>
                Keep it
              </Button>
              <Button type="button" color="red" loading={pending} onClick={deleteCollection}>
                <Trash2 size={16} />
                Delete collection
              </Button>
            </Flex>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            {editing && <input type="hidden" name="collectionId" value={collection.id} />}
            <input type="hidden" name="color" value={color} />

            <label className="flex flex-col gap-2 text-sm font-medium">
              Title
              <TextField.Root
                name="title"
                size="3"
                required
                maxLength={100}
                defaultValue={collection?.title}
                placeholder="e.g. Transformers"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              <span>
                Description <span className="font-normal text-ink-faint">(optional)</span>
              </span>
              <TextArea
                name="description"
                size="3"
                maxLength={300}
                rows={2}
                defaultValue={collection?.description ?? ""}
                placeholder="What goes in this collection?"
              />
            </label>

            <div role="radiogroup" aria-label="Color" className="flex flex-col gap-2">
              <Text size="2" weight="medium">
                Color
              </Text>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(COLLECTION_COLORS) as CollectionColor[]).map((key) => {
                  const swatch = COLLECTION_COLORS[key];
                  const selected = key === color;

                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={swatch.label}
                      title={swatch.label}
                      onClick={() => setColor(key)}
                      className={`grid size-8 place-items-center rounded-full ring-1 ring-white/20 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus-8) ${
                        selected ? "ring-2 ring-white" : ""
                      }`}
                      style={{ background: swatch.fill, color: swatch.ink }}
                    >
                      {selected && <Check size={16} strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <Text as="p" role="alert" size="2" color="red">
                {error}
              </Text>
            )}

            <Flex gap="3" justify="end" mt="2">
              <Dialog.Close>
                <Button type="button" variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" loading={pending}>
                {editing ? "Save" : "Create"}
              </Button>
            </Flex>
          </form>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
