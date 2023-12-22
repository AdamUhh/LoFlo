"use client";
import { Volume2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { Button } from "shadcn/components/ui/button";
import { Checkbox } from "shadcn/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shadcn/components/ui/dialog";
import { Input } from "shadcn/components/ui/input";
import { Label } from "shadcn/components/ui/label";
import { Textarea } from "shadcn/components/ui/textarea";
import { useToast } from "shadcn/components/ui/use-toast";
import SubmitButton from "./SubmitButton";
import { updateFlashcardAction } from "./action";
import { T_CRUDReturn } from "src/types/action";

export default function EditFlashcardDialog({
  isOpen,
  setIsOpen,
  question,
  answer,
  id,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  question: string;
  answer: string;
  id: string;
}) {
  const params = useParams();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="3xl:max-w-4xl max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Flashcard</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <DialogContents
            setOpen={setIsOpen}
            flashcardFolderParentId={!!params.folder ? (params.folder as string) : undefined}
            question={question}
            answer={answer}
            id={id}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DialogContents({
  setOpen,
  flashcardFolderParentId,
  question: _question,
  answer: _answer,
  id,
}: {
  setOpen: (_bool: boolean) => void;
  flashcardFolderParentId?: string;
  question: string;
  answer: string;
  id: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [formState, onFormSubmit] = useFormState(updateFlashcardAction, {
    status: "default",
    returnMessage: "",
    redirectPayload: "",
  } as T_CRUDReturn);

  const [question, setQuestion] = useState(_question);
  const [answer, setAnswer] = useState(_answer);

  useEffect(() => {
    if (formState.status === "success") {
      formRef.current?.reset();
      let action = undefined;
      if (formState.redirectPayload && !!formState.redirectPayload.length)
        action = (
          <Button asChild>
            <Link href={formState.redirectPayload!}>{`Go to Flashcard`}</Link>
          </Button>
        );

      toast({
        title: "Updated Flashcard",
        description: formState.returnMessage,
        action,
      });

      setOpen(false);
    }
  }, [formState.status]);

  return (
    <form action={onFormSubmit} className="w-full space-y-6">
      <div className="grid w-full items-center gap-1.5">
        <div className="gap-1 md:flex">
          <Textarea
            placeholder="Question"
            name="flashcardQuestion"
            id="flashcardQuestion"
            className="min-h-[150px] whitespace-pre"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Textarea
            placeholder="Answer"
            name="flashcardAnswer"
            id="flashcardAnswer"
            className="min-h-[150px] whitespace-pre"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
        {!!id?.length && (
          <Input
            type="text"
            hidden
            name={"flashcardId"}
            value={id}
            onChange={() => {}}
            style={{ display: "none" }}
          />
        )}
        {!!flashcardFolderParentId?.length && (
          <Input
            type="text"
            hidden
            name={"flashcardFolderParentId"}
            value={flashcardFolderParentId}
            onChange={() => {}}
            style={{ display: "none" }}
          />
        )}
      </div>
      <div className="items-top flex space-x-2">
        <Checkbox id="speakerMode" name="speakerMode" />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="speakerMode"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <div className=" -mt-1 flex items-center gap-1">
              <Volume2 />
              Auto Read Text
            </div>
            <p className="mt-1 text-sm font-normal text-muted-foreground">
              Flashcard will automatically read text aloud. <br /> Useful for language flashcards.
            </p>
          </Label>
        </div>
      </div>
      {formState.status === "error" && (
        <div className="mt-2 flex items-center gap-1">
          <p className="text-red-500">{formState.returnMessage || "Failed to create flashcard"}</p>
        </div>
      )}
      <DialogFooter>
        <SubmitButton mode="update" />
      </DialogFooter>
    </form>
  );
}
