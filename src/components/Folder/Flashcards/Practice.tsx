"use client";

import { Play } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shadcn/components/ui/dialog";
import { Label } from "shadcn/components/ui/label";
import { RadioGroup, RadioGroupItem } from "shadcn/components/ui/radio-group";
import { cn } from "shadcn/utils";

export default function PracticeButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [selection, setSelection] = useState<"current" | "all">("current");
  const [disableBtn, setDisableBtn] = useState(false);

  function handleSelection(value: "current" | "all") {
    setSelection(value);
  }

  async function handleSubmit() {
    setDisableBtn(true);
    if (selection === "current") {
      router.push(`${pathname}/practice`);
    } else if (selection === "all") {
      router.push(`${pathname}/practice?mode=all`);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#5CC68B] px-10 text-white hover:bg-[#6FD19B]">
          <Play fill="white" size={20} /> <span className="pl-2">Practice</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Practice</DialogTitle>
        </DialogHeader>
        <RadioGroup
          defaultValue="current"
          onValueChange={handleSelection}
          className="grid grid-cols-2"
        >
          <RadioItem selection={selection} value="current" label="Just this folder's flashcards" />
          <RadioItem
            selection={selection}
            value="all"
            label="This folder's and its subfolders flashcards"
          />
        </RadioGroup>
        <DialogFooter>
          <Button disabled={disableBtn} onClick={handleSubmit} className="bg-[#5CC68B]">
            Let's practice!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RadioItem({
  selection,
  value,
  label,
}: {
  selection: "current" | "all";
  value: "current" | "all";
  label: string;
}) {
  return (
    <Label
      className={cn(
        "relative flex aspect-video flex-col items-center justify-center rounded-lg border-2 p-4 text-center",
        selection === value && "border-black",
      )}
      htmlFor={"r" + value}
    >
      <p
        className={cn(
          "absolute -top-2 left-3 bg-background px-2",
          selection !== value && "text-foreground/50",
        )}
      >
        {value}
      </p>
      <RadioGroupItem value={value} id={"r" + value} className="hidden" />
      {label}
    </Label>
  );
}
