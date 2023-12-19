import FolderTemplate from "components/MyFolders/FolderTemplate";
import OptionsBar from "./OptionsBar";

export default function SubFoldersBar({
  parentId,
  subFolders,
}: {
  parentId: string | null;
  subFolders: { id: string; name: string; description: string }[];
}) {
  return (
    <>
      <OptionsBar subfolderCount={subFolders.length} parentId={parentId} />
      {!!subFolders.length ? (
        <div className="relative mt-1 grid grid-flow-col grid-cols-[repeat(auto-fill,250px)] gap-4 overflow-x-auto overflow-y-hidden py-2">
          {subFolders.map((sf) => (
            <FolderTemplate key={sf.id} name={sf.name} id={sf.id} />
          ))}
        </div>
      ) : (
        <p className="mt-2">No Subfolders found!</p>
      )}
    </>
  );
}
