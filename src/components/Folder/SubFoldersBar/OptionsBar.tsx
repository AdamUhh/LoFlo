import AddFolderButton from "components/MyFolders/FolderTemplate/AddFolder";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "shadcn/components/ui/button";

export default function OptionsBar({ parentId }: { parentId: string | null }) {
  return (
    <div className="mt-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {parentId !== null && (
          <Button title="Go to parent folder" className="px-3" variant={"ghost"} asChild>
            <Link href={`/${parentId}`}>
              <ArrowLeft size={20} />
            </Link>
          </Button>
        )}
        <h2 className="text-2xl font-medium">Subfolders</h2>
        <AddFolderButton />
      </div>
      <Button variant={"outline"} asChild>
        <Link href="/my-folders">View All Folders</Link>
      </Button>
    </div>
  );
}
