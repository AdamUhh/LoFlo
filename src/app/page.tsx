import { AuthSignOut } from "components/HomePage/Navbar/AuthButtons";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { auth } from "src/auth";
import Navbar from "src/components/HomePage/Navbar";

export default async function HomePage() {
  const session = await auth();
  // ? No need for the below, handled in middleware
  // if (!session?.user) redirect('/api/auth/signin?callbackUrl?=/')

  return (
    <>
      <Navbar session={session} />
      <main className="flex h-[calc(100vh-40px)] w-full flex-col items-center justify-center">
        <div className="relative flex h-full w-full items-center justify-center bg-gray-50">
          <div className="absolute left-8 top-8 h-8 w-8 rounded-full bg-indigo-300"></div>
          <div className="absolute right-56 top-32 h-44 w-44 rounded-full bg-blue-400"></div>
          <div className="absolute right-48 top-24 h-12 w-12 rounded-full bg-blue-700"></div>
          <div className="absolute left-16 top-16 h-12 w-12 rounded-full bg-yellow-400"></div>

          <div className="absolute bottom-8 right-8 flex gap-2">
            <div className="h-8 w-8 bg-green-500"></div>
            <div className="h-12 w-12 bg-purple-400"></div>
          </div>

          <div className="absolute bottom-8 left-8 h-44 w-44 rounded-xl bg-green-500"></div>
          <div className="absolute bottom-56 left-72 h-16 w-16  rotate-45 rounded bg-purple-400"></div>

          <div className="z-10 text-center">
            <h1 className="mb-4 text-5xl font-bold text-gray-800">Welcome to</h1>
            <h2 className="mb-8 text-6xl font-extrabold text-indigo-600">Loflo</h2>

            <div className="flex flex-col items-center gap-2">
              <button className="focus:shadow-outline-indigo mx-auto flex gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none active:bg-indigo-800 ">
                {session?.user ? (
                  <Link href={"/my-folders"} className="flex gap-2">
                    <span>Go to app</span>
                    <ArrowRight size={20} />
                  </Link>
                ) : (
                  <Link href={"/signin"} className="flex items-center gap-2">
                    <span>Get Started</span> <ArrowRight size={20} />
                  </Link>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
