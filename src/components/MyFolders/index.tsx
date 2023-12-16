import FolderTemplate from "./FolderTemplate";
import AddFolderTemplate from "./FolderTemplate/AddFolder";

type MyFoldersProps = {
  id: string;
  name: string;
  subfolderCount: string;
};

export default function MyFolders({ folders }: { folders: MyFoldersProps[] }) {
  return (
    <div className="mt-4 grid max-h-[calc(100%-60px)] grid-cols-1 gap-4 overflow-y-auto overflow-x-hidden sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <AddFolderTemplate />
      {!!folders.length && folders.map((folder) => <FolderTemplate key={folder.id} {...folder} />)}
    </div>
  );
}
