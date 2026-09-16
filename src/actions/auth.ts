"use server";
import { signOut } from "@/auth";

/**
 * Clears the session cookie and sends the user back to the login page.
 *
 * This lives in a `"use server"` file so client components (like the user
 * menu in the sidebar) can import and call it directly.
 */

export async function signOutAction() {
  await signOut({
    redirectTo: "/login",
  });
}
