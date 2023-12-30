import BookmarkButton from "components/FlashcardTemplate/BookmarkButton";
import DeleteFlashcardDialog from "components/FlashcardTemplate/DeleteFlashcard";

import FlashcardDropdownOptions from "components/FlashcardTemplate/DropdownOptions";
import EditFlashcardDialog from "components/FlashcardTemplate/EditFlashcard";
import SpeechButton from "components/FlashcardTemplate/SpeechButton";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { T_PracticeFlashcardData } from "src/types/flashcard";
import MainOptions from "./MainOptions";
import { T_ViewedFlashcardStats } from "./types";

type MainProps = {
  currentFlashcardIndex: number;
  setCurrentFlashcardIndex: Dispatch<SetStateAction<number>>;
  flashcardData: T_PracticeFlashcardData[];
  folderId: string;
  viewedFlashcardStats: T_ViewedFlashcardStats[];
  setViewedFlashcardStats: Dispatch<SetStateAction<T_ViewedFlashcardStats[]>>;
};

const initialState: T_PracticeFlashcardData = {
  answer: "",
  question: "Nothing Found",
  id: "",
  bookmarked: false,
};

export default function Main({
  currentFlashcardIndex,
  setCurrentFlashcardIndex,
  flashcardData,
  folderId,
  setViewedFlashcardStats,
  viewedFlashcardStats,
}: MainProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [filteredData] = useState<T_PracticeFlashcardData[]>(flashcardData);
  const [currentFlashcard, setCurrentFlashcard] = useState<T_PracticeFlashcardData>(initialState);

  useEffect(() => {
    setCurrentFlashcard(filteredData[currentFlashcardIndex] || initialState);
  }, [currentFlashcardIndex, filteredData]);

  return (
    <div className="relative grid h-2/4 w-full grid-rows-6 rounded-lg bg-secondary shadow-md shadow-[#00000011] drop-shadow">
      <div className="absolute left-2 top-2 flex gap-2 opacity-50">
        {showAnswer ? "Answer" : "Question"}
      </div>
      <div className="absolute right-2 top-2 flex items-center gap-2">
        <SpeechButton text={showAnswer ? currentFlashcard.answer : currentFlashcard.question} />
        <BookmarkButton
          bookmarked={currentFlashcard.bookmarked}
          folderId={folderId}
          flashcardId={currentFlashcard.id}
        />
        <FlashcardDropdownOptions
          setEditDialog={setIsEditDialogOpen}
          setDeleteDialog={setIsDeleteDialogOpen}
        />
      </div>
      <DeleteFlashcardDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        flashcardId={folderId}
      />
      <EditFlashcardDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        question={currentFlashcard.question}
        answer={currentFlashcard.answer}
        flashcardId={currentFlashcard.id}
      />

      <div className="row-span-full overflow-hidden p-10">
        <div className="whitespace-pre-wrap h-full w-full overflow-auto flex items-center justify-center ">
          {showAnswer ? currentFlashcard.answer : currentFlashcard.question}
        </div>
      </div>

      <MainOptions
        setShowAnswer={setShowAnswer}
        currentFlashcardIndex={currentFlashcardIndex}
        flashcardData={flashcardData}
        setCurrentFlashcardIndex={setCurrentFlashcardIndex}
        showAnswer={showAnswer}
        viewedFlashcardStats={viewedFlashcardStats}
        setViewedFlashcardStats={setViewedFlashcardStats}
      />
    </div>
  );
}
