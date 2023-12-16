// Note: All requests to /api/auth/* (signIn, callback, signOut, etc.) will automatically be handled by NextAuth.js.
import { handlers } from "src/auth";

export const { GET, POST } = handlers;
