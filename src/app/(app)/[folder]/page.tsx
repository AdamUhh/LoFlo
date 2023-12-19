import { Metadata } from "next";
import Container from "src/components/Container";

import Flashcards from "components/Folder/Flashcards";
import { FolderShapeProps } from "components/Folder/Flashcards/types";
import SubFoldersBar from "components/Folder/SubFoldersBar";
import { selectFolder } from "db/queries/folder";
import { notFound } from "next/navigation";
import { cache } from "react";

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
  const folder: FolderShapeProps[] = await getFolder(_folderId);

  const rootFolder = folder.filter((f) => f.id === _folderId);

  if (!!!rootFolder.length) return notFound();

  console.log(folder);

  return (
    <Container title={folder[0].name}>
      <SubFoldersBar
        parentId={rootFolder[0].parentId}
        subFolders={folder.filter(
          (f) => f.id !== _folderId /** && !Object.hasProperty(f.folderId) */,
        )}
      />
      <Flashcards
        // flashcards={folder.filter(
        //   (f) => f.flashcardData !== null /** && !Object.hasProperty(f.folderId) */,
        // ).map(fl => fl.flashcardData)}
        flashcardData={folder.reduce((result, folderItem) => {
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
