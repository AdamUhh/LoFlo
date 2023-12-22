"use client";

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
import { deleteFolderAction } from "./action";

export default function DeleteFolderDialog({
  isOpen,
  setIsOpen,
  folderParentId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  folderParentId: string | null;
}) {
  const params = useParams();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [formState, onFormSubmit] = useFormState(deleteFolderAction, {
    status: "default",
    returnMessage: "",
  } as T_CRUDReturn);

  useEffect(() => {
    if (formState.status === "success") {
      formRef.current?.reset();

      toast({
        title: "Deleted Folder",
        description: formState.returnMessage,
      });

      setIsOpen(false);

      // redirect(formState.redirectPayload!, RedirectType.replace);
    }
  }, [formState.status]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Do you want to delete this folder and all of it's flashcards? Deleting this folder
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <form action={onFormSubmit} className="w-full space-y-6">
            {!!params.folder?.length && (
              <Input
                type="text"
                hidden
                name={"folderId"}
                value={params.folder as string}
                onChange={() => {}}
                style={{ display: "none" }}
              />
            )}
            {!!folderParentId?.length && (
              <Input
                type="text"
                hidden
                name={"folderParentId"}
                value={folderParentId}
                onChange={() => {}}
                style={{ display: "none" }}
              />
            )}

            <SubmitButton mode="delete" />
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
