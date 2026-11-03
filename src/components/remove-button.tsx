"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@radix-ui/themes";

import type { ActionResult } from "@/actions/collections";
import { useToast } from "@/components/toast";
import { runAction } from "@/lib/run-action";

type RemoveButtonProps = {
  action: (formData: FormData) => Promise<ActionResult>;
  /** Sent to the action as hidden form fields, such as { paperId }. */
  fields: Record<string, string>;
  children: React.ReactNode;
};

/** Separate component because useFormStatus only works inside the <form>. */
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="ghost"
      color="gray"
      size="1"
      loading={pending}
    >
      {children}
    </Button>
  );
}

/**
 * A small "Remove" button under a paper card. On success the action refreshes
 * the list and the card disappears. On failure the card stays and a toast says
 * why.
 */
export default function RemoveButton({
  action,
  fields,
  children,
}: RemoveButtonProps) {
  const { showError } = useToast();

  async function submit(formData: FormData) {
    const error = await runAction(action, formData);

    if (error) {
      showError(error);
    }
  }

  return (
    <form action={submit}>
      {Object.entries(fields).map(([name, value]) => (
        <input
          key={name}
          type="hidden"
          name={name}
          value={value}
        />
      ))}

      <SubmitButton>{children}</SubmitButton>
    </form>
  );
}
