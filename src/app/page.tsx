import { auth } from "src/auth";
import Navbar from "src/components/HomePage/Navbar";

export default async function HomePage() {
  const session = await auth();
  // ? No need for the below, handled in middleware
  // if (!session?.user) redirect('/api/auth/signin?callbackUrl?=/')

  return (
    <>
      <Navbar session={session} />
      <main className=" w-full h-[calc(100vh-40px)] flex flex-col items-center justify-center">
        Welcome to LoFlo
      </main>
    </>
  );
}
