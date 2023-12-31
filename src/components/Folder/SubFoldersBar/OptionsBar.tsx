"use client";

import AddFolderButton from "components/FolderTemplate/AddFolder";
import DeleteFolderDialog from "components/FolderTemplate/DeleteFolder";
import DropdownOptions from "components/FolderTemplate/DropdownOptions";
import EditFolderDialog from "components/FolderTemplate/EditFolder";
import { CornerLeftUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "shadcn/components/ui/button";
import { T_Folder } from "src/types/folder";

export default function OptionsBar({
  subfolderCount,
  currentFolder,
}: {
  subfolderCount: string | number;
  currentFolder: T_Folder;
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          {currentFolder.parentId !== null && (
            <Button title="Go to parent folder" className="px-3" variant={"ghost"} asChild>
              <Link href={`/${currentFolder.parentId}`}>
                <CornerLeftUp size={20} />
              </Link>
            </Button>
          )}
          <h2 className="text-2xl font-medium">Subfolders</h2>
          <AddFolderButton />
        </div>
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <Button variant={"outline"} asChild>
            <Link href="/my-folders">View All Folders</Link>
          </Button>
          <DropdownOptions
            setEditDialog={setIsEditDialogOpen}
            setDeleteDialog={setIsDeleteDialogOpen}
          />
        </div>
      </div>
      <div className="w-full text-left text-sm opacity-50">No. of subfolders: {subfolderCount}</div>

      <EditFolderDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        name={currentFolder.name}
        description={currentFolder.description}
        isSubfolder={!!currentFolder.parentId}
      />
      <DeleteFolderDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        folderParentId={currentFolder.parentId}
      />
    </>
  );
}
