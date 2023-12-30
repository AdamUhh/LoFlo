import React, { useEffect, useState } from "react";
import FilterFlashcard from "components/Folder/Flashcards/Filters";
import FinishedDialog from "./FinishedDialog";
import { Dispatch, SetStateAction } from "react";
import { updateFlashcardStatisticsAction } from "./action";
import { useToast } from "shadcn/components/ui/use-toast";
import { T_ViewedFlashcardStats } from "./types";
import { T_FinishPracticeCRUDPayload } from "src/types/action";

type TopbarProps = {
  viewedFlashcardStats: T_ViewedFlashcardStats[];
  setViewedFlashcardStats: Dispatch<SetStateAction<T_ViewedFlashcardStats[]>>;
  folderId: string;
};

export default function Topbar({
  viewedFlashcardStats,
  setViewedFlashcardStats,
  folderId,
}: TopbarProps) {
  const { toast } = useToast();

  const [previouslySubmittedData, setPreviouslySubmittedData] =
    useState<T_FinishPracticeCRUDPayload>();

  // update the pushed property for stats that have been updated in db
  const updateStatsInState = (statsSlice: T_ViewedFlashcardStats[]) => {
    const updatedStats = viewedFlashcardStats.map((stat) =>
      statsSlice.some((pushedStat) => pushedStat.flashcardId === stat.flashcardId)
        ? { ...stat, pushed: true }
        : stat,
    );

    setViewedFlashcardStats(updatedStats);
  };

  const handleFinish = (
    successMessage: string,
    stats: T_ViewedFlashcardStats[],
    statsSlice: T_FinishPracticeCRUDPayload[],
  ) => {
    toast({
      description: successMessage,
      title: "Updated flashcard stats",
    });

    // Calculate the aggregated stats from the payload
    const payloadStats = statsSlice.reduce(
      (acc, curr) => ({
        correct: acc.correct + curr.correct,
        incorrect: acc.incorrect + curr.incorrect,
        skipped: acc.skipped + curr.skipped,
      }),
      { correct: 0, incorrect: 0, skipped: 0 },
    );

    // Update the previously submitted data state
    setPreviouslySubmittedData((prev) => ({
      correct: (prev?.correct || 0) + payloadStats.correct,
      incorrect: (prev?.incorrect || 0) + payloadStats.incorrect,
      skipped: (prev?.skipped || 0) + payloadStats.skipped,
    }));

    updateStatsInState(stats);
  };

  const handleFinishPractice = async (_stats?: T_ViewedFlashcardStats[]) => {
    const stats = _stats || viewedFlashcardStats.filter((stat) => !stat.pushed);

    const result = await updateFlashcardStatisticsAction(stats);

    if (result.status === "success") {
      handleFinish(result.returnMessage, stats, result.payload!);
    } else {
      toast({
        title: "Failed to update flashcard stats",
        description: result.returnMessage,
      });
    }

    return result;
  };

  // ? automatically push unpushed stats when there are 10 or more
  useEffect(() => {
    const pushUnpushedStats = async () => {
      // Get unpushed stats
      const statsToPush = viewedFlashcardStats.filter((stat) => !stat.pushed);

      if (statsToPush.length >= 10) {
        // Take the first 10 stats for pushing (to prevent pushing all flashcards at the end at once)
        const statsToPushSlice = statsToPush.slice(0, 9);

        const result = await updateFlashcardStatisticsAction(statsToPushSlice);

        if (result.status === "success") {
          handleFinish(result.returnMessage, statsToPush, result.payload!);
        } else {
          toast({
            title: "Failed to update flashcard stats",
            description: result.returnMessage,
          });
        }
      }
    };

    pushUnpushedStats();
  }, [viewedFlashcardStats, setViewedFlashcardStats, toast]);

  return (
    <div className="flex w-full">
      <FilterFlashcard additionalFilters={{ correct: false, incorrect: false, skipped: false }} />
      <FinishedDialog
        handleFinishPractice={handleFinishPractice}
        previouslySubmittedData={previouslySubmittedData}
        folderId={folderId}
      />
    </div>
  );
}
