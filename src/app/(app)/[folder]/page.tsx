import { Metadata } from "next";
import Container from "src/components/Container";

import Flashcards from "components/Folder/Flashcards";
import OptionsBar from "components/Folder/OptionsBar";
import SubFoldersBar from "components/Folder/SubFoldersBar";
import { selectFolder } from "db/queries/folder";
import { notFound } from "next/navigation";
import { cache } from "react";

export const getFolder = cache(async (folderId: string) => {
  return selectFolder(folderId);
});

export async function generateMetadata(
  { params: { folder: folderId } }: { params: { folder: string } },
  // parent: ResolvingMetadata,
): Promise<Metadata> {
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
  params: { folder: folderId },
}: {
  params: { folder: string };
}) {
  const folder = await getFolder(folderId);

  if (!!!folder.length) return notFound();

  return (
    <Container title={folder[0].name}>
      <OptionsBar />
      <SubFoldersBar />
      <Flashcards />
      {/* <Folder folder={folder} /> */}
    </Container>
  );
}
