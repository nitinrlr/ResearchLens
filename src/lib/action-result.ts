/*
  Shared by every Server Action. They return an ActionResult rather than
  throwing: a thrown error would swap the whole page for the error page, which
  is too much for a failed click.
*/

/** null when the action worked, otherwise a message to show the user. */
export type ActionResult = { error: string } | null;

export const SIGNED_OUT: ActionResult = {
  error: "You've been signed out. Sign in again to keep going.",
};

/** Logs the real error for us and returns a plain one for the user. */
export function failed(what: string, error: unknown): ActionResult {
  console.error(`Couldn't ${what}:`, error);

  return {
    error: `Couldn't ${what}. Try again.`,
  };
}
