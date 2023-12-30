import Flashcards from "components/Folder/Flashcards";
import SubFoldersBar from "components/Folder/SubFoldersBar";
import { selectFolder } from "db/queries/folders";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import Container from "src/components/Container";

const getFolder = cache(
  async (folderId: string, query?: string, filter?: string, order?: string) => {
    return selectFolder(folderId, query, filter?.split(","), order);
  },
);

export async function generateMetadata({
  searchParams,
  params: { folder: folderId },
}: {
  params: { folder: string };
  searchParams?: { query?: string; filter?: string; order?: string; page?: string };
}): Promise<Metadata> {
  const query = searchParams?.query || "";
  const filter = searchParams?.filter || "";
  const order = searchParams?.order || "";

  const folders = await getFolder(folderId, query, filter, order);

  const rootFolder = folders.filter((f) => f.id === folderId);

  // Source: https://github.com/vercel/next.js/discussions/49925#discussioncomment-6386693
  // ? return blank metadata, so not-found.tsx can catch it
  if (!!!rootFolder.length) return {};

  return {
    title: rootFolder[0].name,
  };
}

export default async function FolderPage({
  searchParams,
  params: { folder: _folderId },
}: {
  params: { folder: string };
  searchParams?: { query?: string; filter?: string; order?: string; page?: string };
}) {
  const query = searchParams?.query || "";
  const filter = searchParams?.filter || "";
  const order = searchParams?.order || "";

  const folders = await getFolder(_folderId, query, filter, order);

  const currentFolder = folders.filter((f) => f.id === _folderId);

  if (!!!currentFolder.length) return notFound();

  return (
    <Container title={currentFolder[0].name}>
      <SubFoldersBar
        currentFolder={currentFolder[0]}
        subFolders={folders.filter((f) => f.id !== _folderId && f.id !== currentFolder[0].parentId)}
      />
      <Flashcards
        currentFolderId={currentFolder[0].id}
        flashcardData={folders.reduce((result, folderItem) => {
          if (folderItem.flashcardData !== null) {
            // ? Below is required for parsing sql json

            // ? Parse the JSON string into an array of flashcard objects
            const flashcards = JSON.parse(`[${folderItem.flashcardData}]`);

            // ? Concatenate the flashcards to the result array
            result = result.concat(flashcards);
          }
          return result;
        }, [])}
      />
    </Container>
  );
}
