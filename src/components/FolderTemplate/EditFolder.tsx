import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shadcn/components/ui/dialog";
import { Input } from "shadcn/components/ui/input";
import { useToast } from "shadcn/components/ui/use-toast";
import { T_CRUDReturn } from "src/types/action";
import SubmitButton from "./SubmitButton";
import { updateFolderAction } from "./action";

export default function EditFolderDialog({
  isOpen,
  setIsOpen,
  name,
  description,
  isSubfolder,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  name: string;
  description: string;
  isSubfolder: boolean;
}) {
  const params = useParams();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {isSubfolder ? "Subfolder" : "Folder"}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <DialogContents
            setOpen={setIsOpen}
            parentId={params.folder as string}
            name={name}
            description={description || ""}
            isSubfolder={isSubfolder}
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
  isSubfolder,
}: {
  setOpen: (_bool: boolean) => void;
  parentId: string;
  name: string;
  description: string;
  isSubfolder: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [formState, onFormSubmit] = useFormState(updateFolderAction, {
    status: "default",
    returnMessage: "",
    redirectPayload: "",
  } as T_CRUDReturn);

  const FolderType = isSubfolder ? "Subfolder" : "Folder";

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
            name={"folderId"}
            value={parentId}
            onChange={() => {}}
            type="text"
            style={{ display: "none" }}
            hidden
          />
        )}
      </div>

      {formState.status === "error" && (
        <div className="mt-2 flex items-center gap-1">
          <p className="text-red-500">
            {formState.returnMessage || `Failed to create ${FolderType.toLowerCase()}`}
          </p>
        </div>
      )}
      <DialogFooter>
        <SubmitButton mode="update" />
      </DialogFooter>
    </form>
  );
}
