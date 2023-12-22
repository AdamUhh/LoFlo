import Link from "next/link";

import { Button } from "shadcn/components/ui/button";
import { T_FolderTemplate } from "src/types/folder";
import FolderIcon from "./FolderIcon";

export default function FolderTemplate({
  id,
  name,
  subfolderCount = "0",
  flashcardCount = "0",
}: T_FolderTemplate) {
  return (
    <Button
      asChild
      variant={"outline"}
      className="relative flex h-fit w-full grow cursor-pointer flex-col items-center rounded-xl  px-4 pb-3 pt-4"
    >
      <Link href={`/${id}`}>
        <FolderIcon />
        <div className="absolute left-[50%] top-[50%] flex w-full -translate-x-[50%] -translate-y-[70%] flex-col gap-1 text-center">
          <h4 className="text-foreground">{subfolderCount} subfolders</h4>
          <h4 className="text-foreground">{flashcardCount} flashcards</h4>
        </div>
        <h3 className="mt-1.5 text-lg">{name}</h3>
      </Link>
    </Button>
  );
}
