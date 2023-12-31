"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { TextareaWithCount } from "shadcn/components/custom/textareacount";
import { Button } from "shadcn/components/ui/button";
import { Dialog, DialogFooter, DialogTrigger } from "shadcn/components/ui/dialog";
import { Input } from "shadcn/components/ui/input";
import { useToast } from "shadcn/components/ui/use-toast";
import { T_CRUDReturn } from "src/types/action";
import { MAX_TEXTAREA_CHAR } from "src/utils/constants";
import { FlashcardDialogContentLayout } from "./DialogLayout";
import SubmitButton from "./SubmitButton";
import { createFlashcardAction } from "./action";

export default function AddFlashcardButton() {
  const params = useParams();
  const [hasFolder] = useState<boolean>(!!params.folder);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <h4>+ Add Flashcard</h4>
        </Button>
      </DialogTrigger>
      <FlashcardDialogContentLayout title="Add Flashcard">
        <div className="flex items-center space-x-2">
          <DialogContents
            setOpen={setOpen}
            flashcardFolderParentId={hasFolder ? (params.folder as string) : undefined}
          />
        </div>
      </FlashcardDialogContentLayout>
    </Dialog>
  );
}

function DialogContents({
  setOpen,
  flashcardFolderParentId,
}: {
  setOpen: (_bool: boolean) => void;
  flashcardFolderParentId?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [formState, onFormSubmit] = useFormState(createFlashcardAction, {
    status: "default",
    returnMessage: "",
    redirectPayload: "",
  } as T_CRUDReturn);

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
        title: "Created Flashcard",
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
        />
        <TextareaWithCount
          maxCount={MAX_TEXTAREA_CHAR}
          placeholder="Answer"
          name="flashcardAnswer"
          id="flashcardAnswer"
          className="inline-block h-full min-h-[150px] w-full resize-none whitespace-pre-wrap break-words"
        />
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
        <SubmitButton />
      </DialogFooter>
    </form>
  );
}
