"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import { Button, Flex, TextField } from "@radix-ui/themes";

import { createCollectionAction } from "@/actions/collections";

/** Separate component because useFormStatus only works inside the <form>. */
function CreateButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      loading={pending}
    >
      Create
    </Button>
  );
}

export default function NewCollectionForm() {
  const [open, setOpen] = useState(false);

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
    <form
      action={createCollectionAction}
      className="w-full max-w-md rounded-xl border border-line bg-canvas p-5"
    >
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

      <Flex
        gap="3"
        mt="5"
      >
        <CreateButton />

        <Button
          type="button"
          variant="soft"
          color="gray"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </Flex>
    </form>
  );
}
