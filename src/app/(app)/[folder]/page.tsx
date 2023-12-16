import { Metadata, ResolvingMetadata } from "next";
import Container from "src/components/Container";

import { cache } from "react";
import { selectFolder } from "db/queries/folder";
import Folder from "components/Folder";
import OptionsBar from "components/Folder/OptionsBar";

export const getFolder = cache(async (folderId: string) => {
  const item = await selectFolder(folderId);
  return item;
});

export async function generateMetadata(
  { params: { folder: folderId } }: { params: { folder: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const folder = await getFolder(folderId);

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

  return (
    <Container title={folder[0].name}>
      <OptionsBar />
      <Folder folder={folder} />
    </Container>
  );
}
