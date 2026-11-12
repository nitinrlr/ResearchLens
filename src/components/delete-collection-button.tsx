"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertDialog, Button, Flex, Text } from "@radix-ui/themes";

import { deleteCollectionAction } from "@/actions/collections";
import { runAction } from "@/lib/run-action";

type DeleteCollectionButtonProps = {
  collectionId: string;
  title: string;
};

/** Separate component because useFormStatus only works inside the <form>. */
function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      color="red"
      loading={pending}
    >
      Delete collection
    </Button>
  );
}

/** Deletes a collection, but only after the user confirms in a dialog. */
export default function DeleteCollectionButton({
  collectionId,
  title,
}: DeleteCollectionButtonProps) {
  const [error, setError] = useState<string | null>(null);

  // On success the action redirects to /collections, so this only returns
  // when something went wrong.
  async function submit(formData: FormData) {
    setError(await runAction(deleteCollectionAction, formData));
  }

  return (
    <AlertDialog.Root
      onOpenChange={(open) => {
        if (!open) {
          setError(null);
        }
      }}
    >
      <AlertDialog.Trigger>
        <Button
          variant="soft"
          color="red"
        >
          Delete collection
        </Button>
      </AlertDialog.Trigger>

      <AlertDialog.Content maxWidth="440px">
        <AlertDialog.Title>
          Delete &ldquo;{title}&rdquo;?
        </AlertDialog.Title>

        <AlertDialog.Description size="2">
          The papers in it stay in any other collections
          they&apos;re in. This can&apos;t be undone.
        </AlertDialog.Description>

        {/*
          A plain submit button rather than AlertDialog.Action: Action closes
          the dialog on click, which would unmount this form mid-submit. The
          action redirects to /collections when it's done instead.
        */}
        <form action={submit}>
          <input
            type="hidden"
            name="collectionId"
            value={collectionId}
          />

          {error && (
            <Text
              as="p"
              role="alert"
              size="2"
              color="red"
              mt="3"
            >
              {error}
            </Text>
          )}

          <Flex
            gap="3"
            mt="4"
            justify="end"
          >
            <AlertDialog.Cancel>
              <Button
                type="button"
                variant="soft"
                color="gray"
              >
                Cancel
              </Button>
            </AlertDialog.Cancel>

            <ConfirmButton />
          </Flex>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
