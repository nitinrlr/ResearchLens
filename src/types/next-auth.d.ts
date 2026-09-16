import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * By default Auth.js types `session.user` as optional and `id` as
   * `string | undefined`. We always populate the id in the session callback,
   * so we narrow both here and every call site can rely on it.
   */
  interface Session {
    user: {
      id: string;
    } & NonNullable<DefaultSession["user"]>;
  }
}

/**
 * Augment `@auth/core/jwt`, not `next-auth/jwt`. The latter is only a
 * re-export barrel (`export * from "@auth/core/jwt"`), so declaring `JWT`
 * there would create a second, unrelated interface instead of merging into
 * the one the callbacks actually use.
 */
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
  }
}
