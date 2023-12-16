import { Session } from "next-auth/types";
import { AuthSignIn, AuthSignOut } from "./AuthButtons";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <header>
      <nav className="bg-background flex h-10 items-center justify-between px-2">
        <h1>Loflo</h1>
        {session?.user ? <AuthSignOut /> : <AuthSignIn/>}
      </nav>
    </header>
  );
}
