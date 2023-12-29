"use client";

import { useState } from "react";
import { Progress } from "shadcn/components/custom/progress";
import { T_PracticeFlashcardData } from "src/types/flashcard";
import Main from "./Main";
import Queue from "./Queue";
import Filters from "./Filters";

type PracticeProps = {
  flashcardData: T_PracticeFlashcardData[];
  folderId: string;
};

export default function Practice({ flashcardData, folderId }: PracticeProps) {
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Filters folderId={folderId} />
      <Progress
        value={currentFlashcardIndex+1}
        max={flashcardData.length}
        className="mx-auto w-[60%]"
        showProgress
      />
      <Main
        currentFlashcardIndex={currentFlashcardIndex}
        setCurrentFlashcardIndex={setCurrentFlashcardIndex}
        flashcardData={flashcardData}
        folderId={folderId}
      />
      <Queue
        currentFlashcardIndex={currentFlashcardIndex}
        // setCurrentFlashcardIndex={setCurrentFlashcardIndex}
        flashcardData={flashcardData}
      />
    </div>
  );
}
