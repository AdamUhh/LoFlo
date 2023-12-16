"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export function AuthSignOut() {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        className="hover:bg-accent/90 hover:text-background text-background bg-foreground  rounded px-2 py-1 font-medium transition"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
      <Link
        href={"/dashboard"}
        className="bg-accent hover:text-background text-background hover:bg-accent/90 rounded px-2 py-1 font-medium transition"
      >
        Go To App
      </Link>
    </div>
  );
}

export function AuthSignIn() {
  return (
    <Link
      href={"/signin"}
      className="hover:bg-accent/90 hover:text-background text-background bg-foreground  rounded px-2 py-1 font-medium transition"
    >
      Sign In
    </Link>
  );
}
