"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { Button } from "shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shadcn/components/ui/dialog";
import { Input } from "shadcn/components/ui/input";
import { useToast } from "shadcn/components/ui/use-toast";
import { T_CRUDReturn } from "src/types/action";
import SubmitButton from "./SubmitButton";
import { createFolderAction } from "./action";

export default function AddFolderButton() {
  const params = useParams();
  const [subfolder] = useState<boolean>(!!params.folder);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {subfolder ? (
          <Button variant={"outline"}>
            <h4>+ Add Subfolder</h4>
          </Button>
        ) : (
          <button className="flex min-h-[150px] w-full grow cursor-pointer flex-col items-center  justify-center rounded-xl border-4 border-dashed border-gray-500/20 px-4 pb-3 pt-4 hover:bg-gray-400/20 hover:shadow">
            <h4>+ Add Folder</h4>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle>Add {subfolder ? "Subfolder" : "Folder"}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <DialogContents
            setOpen={setOpen}
            parentId={subfolder ? (params.folder as string) : undefined}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DialogContents({
  setOpen,
  parentId,
}: {
  setOpen: (_bool: boolean) => void;
  parentId?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [formState, onFormSubmit] = useFormState(createFolderAction, {
    status: "default",
    returnMessage: "",
    redirectPayload: "",
  } as T_CRUDReturn);
  const FolderType = !!parentId?.length ? "Subfolder" : "Folder";

  useEffect(() => {
    if (formState.status === "success") {
      formRef.current?.reset();
      let action = undefined;
      if (formState.redirectPayload && !!formState.redirectPayload.length)
        action = (
          <Button asChild>
            <Link href={formState.redirectPayload!}>{`Go to ${FolderType}`}</Link>
          </Button>
        );

      toast({
        title: `Created ${FolderType}`,
        description: formState.returnMessage,
        action,
      });

      setOpen(false);
    }
  }, [formState.status]);

  return (
    <form action={onFormSubmit} className="w-full space-y-6">
      <div className="grid w-full items-center gap-1.5">
        <Input name="folderName" type="text" id="folderName" placeholder={`${FolderType} Name`} />
        <Input
          name="folderDescription"
          type="text"
          id="folderDescription"
          placeholder="Short Description (optional)"
        />
        {!!parentId?.length && (
          <Input
            type="text"
            hidden
            name={"folderParentId"}
            value={parentId}
            onChange={()=>{}}
            style={{ display: "none" }}
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
        <SubmitButton />
      </DialogFooter>
    </form>
  );
}
