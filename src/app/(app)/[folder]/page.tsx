import Flashcards from "components/Folder/Flashcards";
import SubFoldersBar from "components/Folder/SubFoldersBar";
import { selectFolder } from "db/queries/folders";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import Container from "src/components/Container";
import { T_Folder } from "src/types/folder";

export const getFolder = cache(async (folderId: string) => {
  return selectFolder(folderId);
});

export async function generateMetadata({
  params: { folder: folderId },
}: {
  params: { folder: string };
}): Promise<Metadata> {
  const folder = await getFolder(folderId);

  const rootFolder = folder.filter((f) => f.id === folderId);

  // Source: https://github.com/vercel/next.js/discussions/49925#discussioncomment-6386693
  // ? return blank metadata, so not-found.tsx can catch it
  if (!!!rootFolder.length) return {};

  return {
    title: rootFolder[0].name,
  };
}

export default async function FolderPage({
  params: { folder: _folderId },
}: {
  params: { folder: string };
}) {
  const folders: T_Folder[] = await getFolder(_folderId);

  const currentFolder = folders.filter((f) => f.id === _folderId);

  if (!!!currentFolder.length) return notFound();

  return (
    <Container title={currentFolder[0].name}>
      <SubFoldersBar
        currentFolder={currentFolder[0]}
        subFolders={folders.filter((f) => f.id !== _folderId && f.id !== currentFolder[0].parentId)}
      />
      <Flashcards
        flashcardData={folders.reduce((result, folderItem) => {
          if (folderItem.flashcardData !== null) {
            // Parse the JSON string into an array of flashcard objects
            const flashcards = JSON.parse(`[${folderItem.flashcardData}]`);

            // Concatenate the flashcards to the result array
            result = result.concat(flashcards);
          }
          return result;
        }, [])}
      />
    </Container>
  );
}
