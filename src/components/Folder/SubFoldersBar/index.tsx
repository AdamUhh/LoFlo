import FolderTemplate from "components/FolderTemplate";
import OptionsBar from "./OptionsBar";
import { T_Folder } from "src/types/folder";

export default function SubFoldersBar({
  currentFolder,
  subFolders,
}: {
  currentFolder: T_Folder;
  subFolders: T_Folder[];
}) {
  return (
    <>
      {!!currentFolder.description.length && (
        <span className="text-foreground/50">Description: {currentFolder.description}</span>
      )}
      <OptionsBar subfolderCount={subFolders.length} currentFolder={currentFolder} />
      {!!subFolders.length ? (
        <div className="relative mt-1 grid grid-flow-col grid-cols-[repeat(auto-fill,250px)] gap-4 overflow-x-auto overflow-y-hidden py-2">
          {subFolders.map((sf) => (
            <FolderTemplate
              key={sf.id}
              name={sf.name}
              id={sf.id}
              subfolderCount={sf.subfolderCount}
              flashcardCount={sf.flashcardCount}
            />
          ))}
        </div>
      ) : (
        <p className="mt-2">No Subfolders found!</p>
      )}
    </>
  );
}
