"use client";

import Image from "next/image";
import Clock from "./digitalclock";
import Link from "next/link";

export default function Navbar({ title }: { title: string }) {
  return (
    <div className="grid grid-cols-[120px_auto_120px]">
      <div className="flex items-center justify-start pl-2">
        <Link href={"/my-folders"}>
          <Image src={"/logo_600x600.png"} width={40} height={40} alt="LoFlo Logo" />
        </Link>
      </div>
      <div className="flex items-center justify-center text-xl font-medium tracking-wide ">
        {title}
      </div>
      <div className="flex items-center justify-center">
        <Clock />
      </div>
    </div>
  );
}
