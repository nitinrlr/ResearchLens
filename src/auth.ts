import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
          });

          if (!user) {
            return null;
          }

          const passwordMatches = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!passwordMatches) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    // `user` is only present on the first call, right after a successful
    // sign in. After that the id is already baked into the token.
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }

      return token;
    },

    // Copies the id off the token so server components and route handlers can
    // read `session.user.id` without another database lookup.
    session({ session, token }) {
      session.user.id = token.id;

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },
});