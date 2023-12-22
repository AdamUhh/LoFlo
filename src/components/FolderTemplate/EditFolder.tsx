"use client";
import { Volume2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { Checkbox } from "shadcn/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "shadcn/components/ui/dialog";
import { Input } from "shadcn/components/ui/input";
import { Label } from "shadcn/components/ui/label";
import { useToast } from "shadcn/components/ui/use-toast";
import SubmitButton from "./SubmitButton";
import { updateFolderAction } from "./action";
import { T_CRUDReturn } from "src/types/action";

export default function EditFolderDialog({
  isOpen,
  setIsOpen,
  name,
  description,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  name: string;
  description: string;
}) {
  const params = useParams();
  const [subfolder] = useState<boolean>(!!params.folder);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {subfolder ? "Subfolder" : "Folder"}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <DialogContents
            setOpen={setIsOpen}
            parentId={subfolder ? (params.folder as string) : undefined}
            name={name}
            description={description}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DialogContents({
  setOpen,
  parentId,
  name: _name,
  description: _description,
}: {
  setOpen: (_bool: boolean) => void;
  parentId?: string;
  name: string;
  description: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [formState, onFormSubmit] = useFormState(updateFolderAction, {
    status: "default",
    returnMessage: "",
    redirectPayload: "",
  } as T_CRUDReturn);
  const FolderType = !!parentId?.length ? "Subfolder" : "Folder";

  const [name, setName] = useState(_name);
  const [description, setDescription] = useState(_description);

  useEffect(() => {
    if (formState.status === "success") {
      formRef.current?.reset();

      toast({
        title: `Updated ${FolderType}`,
        description: formState.returnMessage,
      });

      setOpen(false);
    }
  }, [formState.status]);

  return (
    <form action={onFormSubmit} className="w-full space-y-6">
      <div className="grid w-full items-center gap-1.5">
        <Input
          id="folderName"
          name="folderName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder={`${FolderType} Name`}
        />
        <Input
          id="folderDescription"
          name="folderDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="Short Description (optional)"
        />
        {!!parentId?.length && (
          <Input
            name={"folderParentId"}
            value={parentId}
            onChange={() => {}}
            type="text"
            style={{ display: "none" }}
            hidden
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
              All flashcards will automatically read text aloud. <br /> Useful for language
              flashcards.
            </p>
          </Label>
        </div>
      </div>
      {formState.status === "error" && (
        <div className="mt-2 flex items-center gap-1">
          <p className="text-red-500">
            {formState.returnMessage || `Failed to create ${FolderType.toLowerCase()}`}
          </p>
        </div>
      )}
      <DialogFooter>
        <SubmitButton />
      </DialogFooter>
    </form>
  );
}
