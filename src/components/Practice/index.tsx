"use client";

import { useEffect, useState } from "react";
import { Progress } from "shadcn/components/custom/progress";
import { T_PracticeFlashcardData } from "src/types/flashcard";
import Main from "./Main";
import Queue from "./Queue";
import Topbar from "./Topbar";
import { T_ViewedFlashcardStats } from "./types";

type PracticeProps = {
  flashcardData: T_PracticeFlashcardData[];
  folderId: string;
  filters: string[];
};

export default function Practice({ flashcardData, folderId, filters }: PracticeProps) {
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [filteredData, setFilteredData] = useState<T_PracticeFlashcardData[]>(flashcardData);
  const [viewedFlashcardStats, setViewedFlashcardStats] = useState<T_ViewedFlashcardStats[]>([]);

  const applyFilters = () => {
    let filteredResult: T_PracticeFlashcardData[] = [];

    const isBookmarked = filters.includes("bookmarked");
    const isIncorrect = filters.includes("incorrect");
    const isSkipped = filters.includes("skipped");

    if (!isBookmarked && !isIncorrect && !isSkipped) filteredResult = [...flashcardData];
    else {
      // Apply bookmark filter
      if (isBookmarked) {
        filteredResult = [...filteredResult, ...flashcardData.filter((card) => card.bookmarked)];
      }

      // Apply incorrect filter
      if (isIncorrect) {
        const incorrectFilter = flashcardData.filter((card) => {
          const stats = viewedFlashcardStats.find((stat) => stat.flashcardId === card.id);
          return stats && stats.incorrect > 0;
        });
        filteredResult = [...filteredResult, ...incorrectFilter];
      }

      // Apply skipped filter
      if (isSkipped) {
        const skippedFilter = flashcardData.filter((card) => {
          const stats = viewedFlashcardStats.find((stat) => stat.flashcardId === card.id);
          return stats && stats.skipped > 0;
        });
        filteredResult = [...filteredResult, ...skippedFilter];
      }
    }

    // Remove duplicate entries caused by union
    filteredResult = Array.from(new Set(filteredResult));

    setCurrentFlashcardIndex(0);
    setFilteredData(filteredResult);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, flashcardData]);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Topbar
        viewedFlashcardStats={viewedFlashcardStats}
        setViewedFlashcardStats={setViewedFlashcardStats}
        folderId={folderId}
      />
      <Progress
        value={currentFlashcardIndex + 1}
        max={filteredData.length}
        className="mx-auto w-[60%]"
        showProgress
      />
      <Main
        currentFlashcardIndex={currentFlashcardIndex}
        setCurrentFlashcardIndex={setCurrentFlashcardIndex}
        flashcardData={filteredData}
        viewedFlashcardStats={viewedFlashcardStats}
        setViewedFlashcardStats={setViewedFlashcardStats}
        folderId={folderId}
      />
      <Queue currentFlashcardIndex={currentFlashcardIndex} flashcardData={filteredData} />
    </div>
  );
}
