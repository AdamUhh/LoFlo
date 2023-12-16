// ? type safety to get the id from next-auth, 
// ? as nextauth-beta does not do it by default

import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}