import { ChevronLeft, FlipHorizontal, ChevronRight, Check, X, SkipForward } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "shadcn/components/ui/button";

type MainOptionsProps = {
  setShowAnswer: Dispatch<SetStateAction<boolean>>;
  setCurrentFlashcardIndex: Dispatch<SetStateAction<number>>;
  flashcardDataLength: number;
  showAnswer: boolean;
};

export default function MainOptions({
  setShowAnswer,
  setCurrentFlashcardIndex,
  flashcardDataLength,
  showAnswer,
}: MainOptionsProps) {
  const handleNextFlashcard = () => {
    setShowAnswer(false);
    setCurrentFlashcardIndex((prevIndex) => (prevIndex + 1) % flashcardDataLength);
  };

  const handlePrevFlashcard = () => {
    setShowAnswer(false);
    setCurrentFlashcardIndex(
      (prevIndex) => (prevIndex - 1 + flashcardDataLength) % flashcardDataLength,
    );
  };

  const handleShowAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  return (
    <div className="grid h-full w-full grid-cols-3 grid-rows-2 items-center overflow-hidden rounded-lg shadow-[0_-2px_4px_#00000011] md:grid-cols-[80px_1fr_1fr_1fr_1fr_80px] md:grid-rows-1">
      <Button
        variant={"secondary"}
        className="flex h-full w-full cursor-pointer items-center justify-center gap-2 p-3"
        onClick={handlePrevFlashcard}
        title="Previous"
      >
        <ChevronLeft />
      </Button>
      <Button
        variant={"secondary"}
        className="flex h-full w-full cursor-pointer items-center justify-center gap-2 p-3"
        onClick={handleShowAnswer}
      >
        <FlipHorizontal />
        Show {showAnswer ? "Question" : "Answer"}
      </Button>
      <Button
        variant={"secondary"}
        className="flex h-full w-full cursor-pointer items-center justify-center gap-2 p-3 md:order-last "
        onClick={handleNextFlashcard}
        title="Next"
      >
        <ChevronRight />
      </Button>

      <Button
        variant={"secondary"}
        className="flex h-full w-full cursor-pointer items-center justify-center gap-2 p-3"
      >
        <Check />
        Correct
      </Button>
      <Button
        variant={"secondary"}
        className="flex h-full w-full cursor-pointer items-center justify-center gap-2 p-3"
      >
        <X />
        Incorrect
      </Button>
      <Button
        variant={"secondary"}
        className="flex h-full w-full cursor-pointer items-center justify-center gap-2 p-3"
        onClick={handleNextFlashcard}
      >
        <SkipForward />
        Skip
      </Button>
    </div>
  );
}
