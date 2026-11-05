"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button, Card, Flex, Text, TextField } from "@radix-ui/themes";

import { createCollectionAction } from "@/actions/collections";
import { runAction } from "@/lib/run-action";

export default function NewCollectionForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // onSubmit rather than <form action>: React clears a form after an action
  // runs, even a failed one, and the user would have to retype the title.
  // On success the action redirects to the new collection, so this only
  // returns when something went wrong.
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError(await runAction(createCollectionAction, formData));
    });
  }

  function close() {
    setOpen(false);
    setError(null);
  }

  if (!open) {
    return (
      <Button
        size="3"
        onClick={() => setOpen(true)}
      >
        <Plus size={18} />
        New Collection
      </Button>
    );
  }

  return (
    <Card
      asChild
      size="3"
      className="w-full max-w-md"
    >
      <form onSubmit={submit}>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium"
        >
          Title
        </label>
        <TextField.Root
          id="title"
          name="title"
          size="3"
          required
          maxLength={100}
          autoFocus
          placeholder="e.g. Transformers"
        />

        <label
          htmlFor="description"
          className="mb-2 mt-4 block text-sm font-medium"
        >
          Description <span className="font-normal text-ink-faint">(optional)</span>
        </label>
        <TextField.Root
          id="description"
          name="description"
          size="3"
          maxLength={300}
          placeholder="What goes in this collection?"
        />

        {error && (
          <Text
            as="p"
            role="alert"
            size="2"
            color="red"
            mt="4"
          >
            {error}
          </Text>
        )}

        <Flex
          gap="3"
          mt="5"
        >
          <Button
            type="submit"
            loading={pending}
          >
            Create
          </Button>

          <Button
            type="button"
            variant="soft"
            color="gray"
            onClick={close}
          >
            Cancel
          </Button>
        </Flex>
      </form>
    </Card>
  );
}
