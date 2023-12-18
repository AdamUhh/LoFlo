import AddFolderTemplate from "components/MyFolders/FolderTemplate/AddFolder";
import Link from "next/link";
import { Button } from "shadcn/components/ui/button";

export default function OptionsBar() {
  return (
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-medium">Subfolders</h2>
        <AddFolderTemplate />
      </div>
      <Button variant={"outline"} asChild>
        <Link href="/my-folders">View All Folders</Link>
      </Button>
    </div>
  );
}
