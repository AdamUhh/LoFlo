"use client";

import DeleteFlashcardDialog from "components/FlashcardTemplate/DeleteFlashcard";
import FlashcardDropdownOptions from "components/FlashcardTemplate/DropdownOptions";
import EditFlashcardDialog from "components/FlashcardTemplate/EditFlashcard";
import { Expand, FlipHorizontal } from "lucide-react";
import { MouseEvent, useState } from "react";
import { Button } from "shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shadcn/components/ui/dialog";
import { cn } from "shadcn/utils";
import { T_FlashcardData } from "src/types/folder";
import BookmarkButton from "./BookmarkButton";
import SpeechButton from "./SpeechButton";

export default function FlashcardTemplate({
  flashcard,
  folderId,
}: {
  flashcard: T_FlashcardData;
  folderId: string;
}) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expandDialogOpen, setExpandDialogOpen] = useState(false);

  function handleCardFlip(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    setShowAnswer((prev) => !prev);
  }

  return (
    <>
      <Button
        asChild
        variant={"outline"}
        className="relative flex min-h-[150px] w-full cursor-pointer rounded-lg hover:border-black hover:bg-transparent hover:text-inherit"
      >
        <div>
          <span className="absolute -top-[10px] left-3 m-0 w-fit bg-background px-1 text-[10px] text-foreground/50 ">
            {showAnswer ? "Answer" : "Question"}
          </span>
          <div className="absolute right-0 top-0">
            <FlashcardDropdownOptions
              setEditDialog={setIsEditDialogOpen}
              setDeleteDialog={setIsDeleteDialogOpen}
            />
          </div>
          <div className="flex h-full w-full flex-col justify-between">
            <h3 className="text-md mb-auto overflow-hidden whitespace-pre-wrap [-webkit-box-orient:vertical] [-webkit-line-clamp:5] [display:-webkit-box]">
              {showAnswer ? flashcard.answer : flashcard.question}
            </h3>
            <div className="flex w-full justify-between">
              <div className="flex gap-1">
                <Button
                  variant={"secondary"}
                  className={cn("h-fit p-1 px-5", showAnswer && "brightness-90")}
                  onClick={handleCardFlip}
                >
                  <FlipHorizontal size={20} />
                </Button>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={"secondary"}
                  className={cn("h-fit p-1", showAnswer && "brightness-90")}
                  onClick={() => setExpandDialogOpen(true)}
                >
                  <Expand size={20} />
                </Button>
                <SpeechButton text={showAnswer ? flashcard.answer : flashcard.question} />
                <BookmarkButton
                  bookmarked={flashcard.bookmarked}
                  folderId={folderId}
                  flashcardId={flashcard.id}
                />
              </div>
            </div>
          </div>
        </div>
      </Button>
      <DeleteFlashcardDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        flashcardId={flashcard.id}
      />
      <EditFlashcardDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        question={flashcard.question}
        answer={flashcard.answer}
        flashcardId={flashcard.id}
      />
      <Dialog open={expandDialogOpen} onOpenChange={setExpandDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{showAnswer ? "Answer" : "Question"}</DialogTitle>
            <DialogDescription className="max-h-[60vh] overflow-auto whitespace-pre-wrap">
              {showAnswer ? flashcard.answer : flashcard.question}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex w-full space-x-2">
              <Button
                variant={"secondary"}
                className={cn("mr-auto h-fit gap-2 p-1 px-5", showAnswer && "brightness-90")}
                onClick={handleCardFlip}
              >
                <FlipHorizontal size={20} /> Flip
              </Button>
              <SpeechButton text={showAnswer ? flashcard.answer : flashcard.question} />
              <BookmarkButton
                bookmarked={flashcard.bookmarked}
                folderId={folderId}
                flashcardId={flashcard.id}
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
