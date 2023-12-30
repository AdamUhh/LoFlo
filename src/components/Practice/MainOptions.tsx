import { icons } from "lucide-react";
import { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from "react";
import { Button } from "shadcn/components/ui/button";
import { cn } from "shadcn/utils";
import { T_PracticeFlashcardData } from "src/types/flashcard";
import { T_ViewedFlashcardStats } from "./types";

type MainOptionsProps = {
  setShowAnswer: Dispatch<SetStateAction<boolean>>;
  setCurrentFlashcardIndex: Dispatch<SetStateAction<number>>;
  currentFlashcardIndex: number;
  flashcardData: T_PracticeFlashcardData[];
  showAnswer: boolean;
  viewedFlashcardStats: T_ViewedFlashcardStats[];
  setViewedFlashcardStats: Dispatch<SetStateAction<T_ViewedFlashcardStats[]>>;
};

export default function MainOptions({
  setShowAnswer,
  setCurrentFlashcardIndex,
  currentFlashcardIndex,
  showAnswer,
  flashcardData,
  viewedFlashcardStats,
  setViewedFlashcardStats,
}: MainOptionsProps) {
  const [currentFlashcardId, setCurrentFlashcardId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentFlashcardId(flashcardData[currentFlashcardIndex]?.id || null);
  }, [currentFlashcardIndex, flashcardData]);

  if (!currentFlashcardId) return <></>;

  const flashcardStats = viewedFlashcardStats.find(
    (stat) => stat.flashcardId === currentFlashcardId,
  );

  const handleNextFlashcard = () => {
    setShowAnswer(false);
    setCurrentFlashcardIndex((prevIndex) => (prevIndex + 1) % flashcardData.length);
  };

  const handlePrevFlashcard = () => {
    setShowAnswer(false);
    setCurrentFlashcardIndex(
      (prevIndex) => (prevIndex - 1 + flashcardData.length) % flashcardData.length,
    );
  };

  const handleShowAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  const handleIncorrect = () => {
    setViewedFlashcardStats((prevStats) => {
      const updatedStats = [...prevStats];
      const index = updatedStats.findIndex((stat) => stat.flashcardId === currentFlashcardId);

      if (index !== -1) {
        updatedStats[index].incorrect = 1;
        updatedStats[index].skipped = 0;
        updatedStats[index].correct = 0;
        updatedStats[index].lastReviewed = new Date().getTime().toString();
      } else {
        updatedStats.push({
          flashcardId: currentFlashcardId,
          correct: 0,
          incorrect: 1,
          skipped: 0,
          lastReviewed: new Date().getTime().toString(),
          pushed: false,
        });
      }

      return updatedStats;
    });

    handleNextFlashcard();
  };

  const handleCorrect = () => {
    setViewedFlashcardStats((prevStats) => {
      const updatedStats = [...prevStats];
      const index = updatedStats.findIndex((stat) => stat.flashcardId === currentFlashcardId);

      if (index !== -1) {
        updatedStats[index].correct = 1;
        updatedStats[index].skipped = 0;
        updatedStats[index].incorrect = 0;
        updatedStats[index].lastReviewed = new Date().getTime().toString();
      } else {
        updatedStats.push({
          flashcardId: currentFlashcardId,
          correct: 1,
          incorrect: 0,
          skipped: 0,
          lastReviewed: new Date().getTime().toString(),
          pushed: false,
        });
      }

      return updatedStats;
    });

    handleNextFlashcard();
  };

  const handleSkip = () => {
    setViewedFlashcardStats((prevStats) => {
      const updatedStats = [...prevStats];
      const index = updatedStats.findIndex((stat) => stat.flashcardId === currentFlashcardId);

      if (index !== -1) {
        updatedStats[index].skipped = 1;
        updatedStats[index].correct = 0;
        updatedStats[index].incorrect = 0;
        updatedStats[index].lastReviewed = new Date().getTime().toString();
      } else {
        updatedStats.push({
          flashcardId: currentFlashcardId,
          correct: 0,
          incorrect: 0,
          skipped: 1,
          lastReviewed: new Date().getTime().toString(),
          pushed: false,
        });
      }

      return updatedStats;
    });

    handleNextFlashcard();
  };

  return (
    <div className="grid h-full w-full grid-cols-3 grid-rows-2 items-center overflow-hidden rounded-lg shadow-[0_-2px_4px_#00000011] md:grid-cols-[80px_1fr_1fr_1fr_1fr_80px] md:grid-rows-1">
      <OptionButton onClick={handlePrevFlashcard} icon="ChevronLeft" />
      <OptionButton
        onClick={handleShowAnswer}
        icon="FlipHorizontal"
        text={`Show ${showAnswer ? "Question" : "Answer"}`}
      />
      <OptionButton className={"md:order-last"} onClick={handleNextFlashcard} icon="ChevronRight" />
      <OptionButton
        className={flashcardStats && flashcardStats.correct > 0 ? "bg-green-200" : ""}
        onClick={handleCorrect}
        icon="Check"
        text="Correct"
      />
      <OptionButton
        className={flashcardStats && flashcardStats.incorrect > 0 ? "bg-red-200" : ""}
        onClick={handleIncorrect}
        icon="X"
        text="Incorrect"
      />
      <OptionButton
        className={flashcardStats && flashcardStats.skipped > 0 ? "bg-yellow-200" : ""}
        onClick={handleSkip}
        icon="SkipForward"
        text="Skip"
      />
    </div>
  );
}

function OptionButton({
  className,
  onClick,
  icon,
  text,
}: {
  className?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon: keyof typeof icons;
  text?: string;
}) {
  const LucideIcon = icons[icon];

  return (
    <Button
      variant={"secondary"}
      className={cn(
        "flex h-full w-full cursor-pointer items-center justify-center gap-2 p-3",
        className,
      )}
      onClick={onClick}
    >
      <LucideIcon />
      {text}
    </Button>
  );
}
