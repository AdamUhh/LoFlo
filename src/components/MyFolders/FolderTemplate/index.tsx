import Link from "next/link";

import FolderIcon from "./FolderIcon";
import { FolderShapeProps } from "./types";

export default function FolderTemplate({
  id,
  name,
  subfolderCount = "0",
  flashcardCount = "0",
}: FolderShapeProps) {
  return (
    <Link
      href={`/${id}`}
      className="relative flex w-full grow cursor-pointer flex-col items-center rounded-xl bg-slate-300/10 px-4 pb-3 pt-4 shadow hover:bg-slate-300/20"
    >
      <FolderIcon />
      <div className="absolute left-[50%] top-[50%] flex w-full -translate-x-[50%] -translate-y-[70%] flex-col gap-1 text-center">
        <h4 className="">{subfolderCount} subfolders</h4>
        <h4 className="">{flashcardCount} flashcards</h4>
      </div>
      <h3 className="mt-1.5 text-lg">{name}</h3>
    </Link>
  );
}
