import { Metadata } from "next";
import Container from "src/components/Container";

import OptionsBar from "components/Folder/OptionsBar";
import { selectFolder } from "db/queries/folder";
import { cache } from "react";

export const getFolder = cache(async (folderId: string) => {
  return selectFolder(folderId);
});

export async function generateMetadata(
  { params: { folder: folderId } }: { params: { folder: string } },
  // parent: ResolvingMetadata,
): Promise<Metadata> {
  const folder = await getFolder(folderId);
  console.log('meta folder', folder)

  return {
    title: folder[0].name,
  };
}

export default async function FolderPage({
  params: { folder: folderId },
}: {
  params: { folder: string };
}) {
  const folder = await getFolder(folderId);
  console.log('page folder', folder)

  return (
    <Container title={folder[0].name}>
      <OptionsBar />
      {/* <Folder folder={folder} /> */}
    </Container>
  );
}
