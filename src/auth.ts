import { Adapter } from "@auth/core/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";

import { and, eq } from "drizzle-orm";
import GitHub from "next-auth/providers/github";
import { db } from "src/db";
import { accounts, users } from "./db/schema/auth";

// ? Source: https://github.com/nextauthjs/next-auth/issues/8377#issuecomment-1694720111
// ? Fixes issue where you are unable to login after a logout in the same account/provider
function getAdapter(): Adapter {
  return {
    ...DrizzleAdapter(db),
    async getUserByAccount(providerAccountId) {
      const results = await db
        .select()
        .from(accounts)
        .leftJoin(users, eq(users.id, accounts.userId))
        .where(
          and(
            eq(accounts.provider, providerAccountId.provider),
            eq(accounts.providerAccountId, providerAccountId.providerAccountId),
          ),
        )
        .get();

      return results?.user ?? null;
    },
  };
}

export const authConfig = {
  providers: [GitHub],
  adapter: getAdapter(),
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    // ? Middleware, used to redirect user to signin if they are on a path that requires authentication
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const authenticatedPaths = ["/my-folders"];
      const isProtected = authenticatedPaths.some((path) => nextUrl.pathname.startsWith(path));

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL("signin", nextUrl.origin);
        redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
        return Response.redirect(redirectUrl);
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signOut, signIn } = NextAuth(authConfig);
