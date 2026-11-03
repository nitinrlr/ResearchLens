import { unstable_rethrow } from "next/navigation";

import type { ActionResult } from "@/actions/collections";

const UNEXPECTED_MESSAGE =
  "Something went wrong. Check your connection and try again.";

/**
 * Calls a Server Action from the browser. Returns the message to show the user
 * if it failed, or null if it worked.
 *
 * Covers both ways an action can fail: it returns { error } for problems it
 * expected, and the call throws when the user is offline or the server crashed.
 */
export async function runAction(
  action: (formData: FormData) => Promise<ActionResult>,
  formData: FormData
): Promise<string | null> {
  try {
    const result = await action(formData);

    return result?.error ?? null;
  } catch (error) {
    // A redirect() in the action also arrives here as a thrown error. Hand it
    // back to Next.js so the navigation still happens.
    unstable_rethrow(error);

    return UNEXPECTED_MESSAGE;
  }
}
