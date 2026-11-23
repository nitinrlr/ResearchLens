"use client";

import { useTransition } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@radix-ui/themes";

import { followTreeAction, unfollowTreeAction } from "@/actions/goals";
import { useToast } from "@/components/toast";
import { runAction } from "@/lib/run-action";

/** Adds a role to the user's goals, or removes it. */
export default function FollowTreeButton({ treeId, following }: { treeId: string; following: boolean }) {
  const [pending, startTransition] = useTransition();
  const { showError } = useToast();

  function toggle() {
    const formData = new FormData();
    formData.set("treeId", treeId);

    startTransition(async () => {
      const error = await runAction(following ? unfollowTreeAction : followTreeAction, formData);
      if (error) showError(error);
    });
  }

  return (
    <Button
      type="button"
      size="3"
      variant={following ? "soft" : "solid"}
      color={following ? "gray" : undefined}
      loading={pending}
      onClick={toggle}
      title={following ? "Stop following this role" : undefined}
    >
      {following ? <Check size={16} /> : <Plus size={16} />}
      {following ? "Following" : "Follow this role"}
    </Button>
  );
}
