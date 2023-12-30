import { Session } from "next-auth/types";
import { AuthSignIn, AuthSignOut } from "./AuthButtons";
import Image from "next/image";
import Link from "next/link";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <header className="mb-1">
      <nav className="flex h-10 items-center justify-between bg-background px-2 shadow-md">
        <div className="flex items-center justify-start pl-2 gap-2">
          <Link href={"/dashboard"}>
            <Image src={"/logo_600x600.png"} width={35} height={35} alt="LoFlo Logo" />
          </Link>
          <h1 className="font-bold upp">LoFlo</h1>
        </div>
        {session?.user ? <AuthSignOut /> : <AuthSignIn />}
      </nav>
    </header>
  );
}
