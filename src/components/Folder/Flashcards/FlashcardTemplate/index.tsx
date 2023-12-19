"use client";

import { Bookmark, FlipHorizontal, Volume2 } from "lucide-react";
import { MouseEvent, useState } from "react";
import { Button } from "shadcn/components/ui/button";
import { cn } from "shadcn/utils";
import { T_FlashcardData } from "../types";

export default function FlashcardTemplate({ flashcard }: { flashcard: T_FlashcardData }) {
  const [showAnswer, setShowAnswer] = useState(false);

  function handleCardFlip(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    setShowAnswer((prev) => !prev);
  }

  return (
    <Button
      asChild
      variant={"outline"}
      className="relative flex min-h-[150px] w-full cursor-pointer rounded-lg hover:border-black hover:bg-transparent hover:text-inherit"
    >
      <div>
        <span className="absolute -top-[10px] left-3 m-0 w-fit bg-background px-1 text-[10px] text-foreground/50">
          {showAnswer ? "Answer" : "Question"}
        </span>
        <div className="flex h-full w-full flex-col justify-between">
          <h3 className="mb-auto text-lg">{showAnswer ? flashcard.answer : flashcard.question}</h3>
          <div className="flex w-full justify-between">
            <div className="flex gap-1">
              <Button variant={"secondary"} className={cn("h-fit p-1", showAnswer && "brightness-90")} onClick={handleCardFlip}>
                <FlipHorizontal size={20} />
              </Button>
            </div>
            <div className="flex gap-1">
              <Button variant={"secondary"} className="h-fit p-1">
                <Volume2 size={20} />
              </Button>
              <Button variant={"secondary"} className="h-fit p-1">
                <Bookmark size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Button>
  );
}
