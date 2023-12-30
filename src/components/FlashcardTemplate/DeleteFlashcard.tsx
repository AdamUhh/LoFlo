import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { Button } from "shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shadcn/components/ui/dialog";
import { Input } from "shadcn/components/ui/input";
import { useToast } from "shadcn/components/ui/use-toast";
import { T_CRUDReturn } from "src/types/action";

import SubmitButton from "./SubmitButton";
import { deleteFlashcardAction } from "./action";

export default function DeleteFlashcardDialog({
  isOpen,
  setIsOpen,
  flashcardId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  flashcardId: string;
}) {
  const params = useParams();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [formState, onFormSubmit] = useFormState(deleteFlashcardAction, {
    status: "default",
    returnMessage: "",
  } as T_CRUDReturn);

  useEffect(() => {
    if (formState.status === "success") {
      formRef.current?.reset();

      toast({
        title: "Deleted Flashcard",
        description: formState.returnMessage,
      });

      setIsOpen(false);
    }
  }, [formState.status]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Do you want to delete this flashcard? Deleting this flashcard cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form action={onFormSubmit} className="w-full space-y-6">
            {!!flashcardId?.length && (
              <Input
                type="text"
                hidden
                name={"flashcardId"}
                value={flashcardId}
                onChange={() => {}}
                style={{ display: "none" }}
              />
            )}
            {!!params.folder?.length && (
              <Input
                type="text"
                hidden
                name={"flashcardFolderParentId"}
                value={params.folder as string}
                onChange={() => {}}
                style={{ display: "none" }}
              />
            )}
            <SubmitButton mode="delete" />
          </form>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
