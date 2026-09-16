import { auth } from "@/auth";

/**
 * Returns the signed-in user's id, or null if nobody is signed in.
 *
 * The id lives on the JWT (see the callbacks in `src/auth.ts`), so this costs
 * no database query.
 */
export async function getCurrentUserId() {
  const session = await auth();

  return session?.user?.id ?? null;
}
