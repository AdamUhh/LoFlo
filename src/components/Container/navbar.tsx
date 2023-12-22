"use client";

import Image from "next/image";
import Clock from "./digitalclock";

export default function Navbar({ title }: { title: string }) {
  return (
    <div className="grid grid-cols-[120px_auto_120px]">
      <div className="flex items-center justify-start pl-2">
        <Image src={"/logo_600x600.png"} width={40} height={40} alt="LoFlo Logo" />
      </div>
      <div className="flex items-center justify-center font-medium text-xl tracking-wide ">{title}</div>
      <div className="flex items-center justify-center">
        <Clock />
      </div>
    </div>
  );
}
