"use client";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { Button } from "shadcn/components/ui/button";
import { Checkbox } from "shadcn/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shadcn/components/ui/dialog";
import { Input } from "shadcn/components/ui/input";
import { Label } from "shadcn/components/ui/label";
import { ToastAction } from "shadcn/components/ui/toast";
import { useToast } from "shadcn/components/ui/use-toast";
import SubmitButton from "./SubmitButton";
import createFolder from "./action";
import { T_CreateFolderReturn } from "./types";
import { redirect } from "next/navigation";

export default function AddFolderTemplate() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex min-h-[150px] w-full grow cursor-pointer flex-col items-center  justify-center rounded-xl border-4 border-dashed border-gray-500/20 px-4 pb-3 pt-4 hover:bg-gray-400/20 hover:shadow">
          <h4>+ Add Folder</h4>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Folder</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <DialogContents setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DialogContents({ setOpen }: { setOpen: (_bool: boolean) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [formState, onFormSubmit] = useFormState(createFolder, {
    status: "default",
    returnMessage: "",
    redirectPayload: "",
  } as T_CreateFolderReturn);

  useEffect(() => {
    if (formState.status === "success") {
      formRef.current?.reset();
      let action = undefined;
      if (formState.redirectPayload && !!formState.redirectPayload.length)
        action = (
          <ToastAction altText="Go To Folder" asChild>
            <Button onClick={() => redirect(formState.redirectPayload!)}>Go to Folder</Button>
          </ToastAction>
        );

      toast({
        title: "Created Folder",
        description: formState.returnMessage,
        // <div className="flex flex-col">
        //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //     <code className="text-white"></code>
        //   </pre>
        // </div>
        action,
      });

      setOpen(false);
    }
  }, [formState.status]);

  return (
    <form action={onFormSubmit} className="w-full space-y-6">
      <div className="grid w-full items-center gap-1.5">
        <Input name="folderName" type="text" id="folderName" placeholder="Folder Name" />
        <Input
          name="folderDescription"
          type="text"
          id="folderDescription"
          placeholder="Short Description (optional)"
        />
      </div>
      <div className="items-top flex space-x-2">
        <Checkbox id="speakerMode" name="speakerMode" />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="speakerMode"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Automatic Speaker Mode
            <p className="mt-1 text-sm font-normal text-muted-foreground">
              All flashcards will automatically speak. <br /> Useful for language flashcards.
            </p>
          </Label>
        </div>
      </div>
      {formState.status === "error" && (
        <div className="mt-2 flex items-center gap-1">
          <p className="text-red-500">{formState.returnMessage || "Failed to create folder"}</p>
        </div>
      )}
      <DialogFooter>
        <SubmitButton />
      </DialogFooter>
    </form>
  );
}
