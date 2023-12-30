import FolderTemplate from "../FolderTemplate";
import AddFolderButton from "../FolderTemplate/AddFolder";
import { MyFoldersProps } from "./types";

export default function MyFolders({ folders }: { folders: MyFoldersProps[] }) {
  return (
    <div className="mt-4 grid max-h-[calc(100%-60px)] grid-cols-1 gap-4 overflow-y-auto overflow-x-hidden py-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <AddFolderButton />
      {!!folders.length && folders.map((folder) => <FolderTemplate key={folder.id} {...folder} />)}
    </div>
  );
}
