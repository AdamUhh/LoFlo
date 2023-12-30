"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export function AuthSignOut() {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        className="rounded bg-foreground px-2 py-1  font-medium text-background transition hover:bg-accent/90 hover:text-background"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </div>
  );
}

export function AuthSignIn() {
  return (
    <Link
      href={"/signin"}
      className="rounded bg-foreground px-2 py-1  font-medium text-background transition hover:bg-accent/90 hover:text-background"
    >
      Sign In
    </Link>
  );
}
