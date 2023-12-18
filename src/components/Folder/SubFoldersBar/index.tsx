import FolderTemplate from "components/MyFolders/FolderTemplate";
import AddFolderTemplate from "components/MyFolders/FolderTemplate/AddFolder";

export default function SubFoldersBar({
  subFolders,
}: {
  subFolders: { id: string; name: string; description: string }[];
}) {
  return (
    <div className="relative mt-4 grid grid-flow-col grid-cols-[repeat(auto-fill,250px)] gap-4 overflow-x-auto overflow-y-hidden py-2">
      {subFolders.map((sf) => (
        <FolderTemplate key={sf.id} name={sf.name} id={sf.id} />
      ))}
    </div>
  );
}
