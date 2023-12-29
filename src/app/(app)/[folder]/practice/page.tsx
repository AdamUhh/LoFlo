import Practice from "components/Practice";
import { selectPracticeFlashcards } from "db/queries/flashcards";
import { Metadata } from "next";
import Container from "src/components/Container";

export const metadata: Metadata = {
  title: "Practice",
};

export default async function StudyModePage({
  searchParams,
  params: { folder: _folderId },
}: {
  params: { folder: string };
  searchParams?: { mode?: string; query?: string; filter?: string; order?: string; page?: string };
}) {
  const mode = searchParams?.mode || "current";

  const flashcardsData = await selectPracticeFlashcards(_folderId, mode);

  return (
    <Container title={"Practice"}>
      <Practice flashcardData={flashcardsData} folderId={_folderId}  />
    </Container>
  );
}
