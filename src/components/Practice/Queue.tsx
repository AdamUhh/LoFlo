import { Button } from "shadcn/components/ui/button";
import { T_PracticeFlashcardData } from "src/types/flashcard";

type QueueProps = {
  currentFlashcardIndex: number;
  //   setCurrentFlashcardIndex: React.Dispatch<React.SetStateAction<number>>;
  flashcardData: T_PracticeFlashcardData[];
};

export default function Queue({
  currentFlashcardIndex,
  //   setCurrentFlashcardIndex,
  flashcardData,
}: QueueProps) {
  const getNextFlashcards = () => {
    const nextFlashcards: T_PracticeFlashcardData[] = [];
    for (let i = 1; i <= 6; i++) {
      const nextIndex = currentFlashcardIndex + i;

      // Check if the next index is within the bounds of flashcardData
      if (nextIndex < flashcardData.length) {
        nextFlashcards.push(flashcardData[nextIndex]);
      }
    }
    return nextFlashcards;
  };

  return (
    <div>
      <h3>Queue</h3>
      {getNextFlashcards().map((flashcard, index) => (
        <Button
          variant={"secondary"}
          className="mb-1 grid h-fit w-full grid-cols-[40px_auto] justify-start rounded bg-secondary p-3 "
          key={index}
        >
          <div className=" px-2 text-right">{index + currentFlashcardIndex + 2}</div>
          <div className="overflow-hidden whitespace-pre-wrap border-l-2 px-2 text-left [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [display:-webkit-box]">
            {flashcard.question}
          </div>
        </Button>
      ))}
    </div>
  );
}
