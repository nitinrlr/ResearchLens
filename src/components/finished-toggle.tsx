"use client";

import { useState, useTransition } from "react";
import { CircleCheck, Circle } from "lucide-react";
import { Button } from "@radix-ui/themes";

import { setPaperFinishedAction } from "@/actions/goals";
import { useToast } from "@/components/toast";
import { runAction } from "@/lib/run-action";

type FinishedToggleProps = {
  paperId: string;
  initialFinished: boolean;
  /** "button" on the paper page, "compact" in a skill tree's paper list. */
  variant?: "button" | "compact";
};

/**
 * Marks a paper finished, which is what moves a goal's progress. It flips at
 * once and flips back, with a toast, if saving fails.
 */
export default function FinishedToggle({ paperId, initialFinished, variant = "button" }: FinishedToggleProps) {
  const [finished, setFinished] = useState(initialFinished);
  const [pending, startTransition] = useTransition();
  const { showError } = useToast();

  function toggle() {
    const next = !finished;
    setFinished(next);

    const formData = new FormData();
    formData.set("paperId", paperId);
    formData.set("finished", String(next));

    startTransition(async () => {
      const error = await runAction(setPaperFinishedAction, formData);

      if (error) {
        setFinished(!next);
        showError(error);
      }
    });
  }

  const Icon = finished ? CircleCheck : Circle;

  return (
    <Button
      type="button"
      variant={finished ? "solid" : "soft"}
      color={finished ? "green" : "gray"}
      size={variant === "compact" ? "1" : "2"}
      aria-pressed={finished}
      disabled={pending}
      onClick={toggle}
    >
      <Icon size={variant === "compact" ? 14 : 16} />
      {finished ? "Finished" : variant === "compact" ? "Mark finished" : "Mark as finished"}
    </Button>
  );
}
