import { Volume2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { TextareaWithCount } from "shadcn/components/custom/textareacount";
import { Button } from "shadcn/components/ui/button";
import { Checkbox } from "shadcn/components/ui/checkbox";
import { Dialog, DialogFooter } from "shadcn/components/ui/dialog";
import { Input } from "shadcn/components/ui/input";
import { Label } from "shadcn/components/ui/label";
import { useToast } from "shadcn/components/ui/use-toast";
import { T_CRUDReturn } from "src/types/action";
import { FlashcardDialogContentLayout } from "./DialogLayout";
import SubmitButton from "./SubmitButton";
import { updateFlashcardAction } from "./action";
import { MAX_TEXTAREA_CHAR } from "src/utils/constants";

export default function EditFlashcardDialog({
  isOpen,
  setIsOpen,
  question,
  answer,
  flashcardId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  question: string;
  answer: string;
  flashcardId: string;
}) {
  const params = useParams();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <FlashcardDialogContentLayout title="Edit Flashcard">
        <div className="flex h-full items-center">
          <DialogContents
            setOpen={setIsOpen}
            flashcardFolderParentId={!!params.folder ? (params.folder as string) : undefined}
            question={question}
            answer={answer}
            id={flashcardId}
          />
        </div>
      </FlashcardDialogContentLayout>
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
    <form action={onFormSubmit} className="flex h-full w-full flex-col">
      <div className="mb-4 flex h-full flex-col gap-1 md:flex-row">
        <TextareaWithCount
          maxCount={MAX_TEXTAREA_CHAR}
          placeholder="Question"
          name="flashcardQuestion"
          id="flashcardQuestion"
          className="inline-block h-full min-h-[150px] w-full resize-none whitespace-pre-wrap break-words"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <TextareaWithCount
          maxCount={MAX_TEXTAREA_CHAR}
          placeholder="Answer"
          name="flashcardAnswer"
          id="flashcardAnswer"
          className="inline-block h-full min-h-[150px] w-full resize-none whitespace-pre-wrap break-words"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
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

      {formState.status === "error" && (
        <div className="mt-2 flex items-center gap-1">
          <p className="text-red-500">{formState.returnMessage || "Failed to create flashcard"}</p>
        </div>
      )}
      <DialogFooter className="mt-2">
        <SubmitButton mode="update" />
      </DialogFooter>
    </form>
  );
}
