import MyFolders from "components/MyFolders";
import OptionsBar from "components/MyFolders/OptionsBar";
import { selectFolders } from "db/queries/allFolders";
import { Metadata } from "next";
import Container from "src/components/Container";

export const metadata: Metadata = {
  title: "My Folders",
};

export default async function MyFoldersPage({
  searchParams,
}: {
  searchParams?: { query?: string; sort?: string; page?: string; order?: string };
}) {
  const query = searchParams?.query || "";
  const sort = searchParams?.sort || "";
  const order = searchParams?.order || "";

  const folders = await selectFolders(query, sort, order);

  return (
    <Container title="My Folders">
      <OptionsBar />
      <MyFolders folders={folders} />
    </Container>
  );
}
