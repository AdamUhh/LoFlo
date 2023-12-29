import { T_FlashcardData } from "src/types/folder";
import FlashcardTemplate from "../../FlashcardTemplate";
import OptionsBar from "./OptionsBar";

export default function Flashcards({
  flashcardData,
  currentFolderId,
}: {
  flashcardData: T_FlashcardData[];
  currentFolderId: string;
}) {
  return (
    <div className="mt-4">
      <OptionsBar flashcardCount={flashcardData.length} />
      <div className="mt-4 grid max-h-[calc(100%-60px)] grid-cols-1 gap-4 overflow-y-auto overflow-x-hidden py-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {flashcardData.map((fd) => (
          <FlashcardTemplate key={fd.id} flashcard={fd} folderId={currentFolderId} />
        ))}
      </div>
    </div>
  );
}
