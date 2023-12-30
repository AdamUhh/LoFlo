import { ReactNode } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "shadcn/components/ui/dialog";

export function FlashcardDialogContentLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <DialogContent className="min-h-[60%] w-max min-w-[70%] max-w-none resize grid-rows-[20px_auto] overflow-auto">
      <DialogHeader className="h-[20px]">
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      {children}
    </DialogContent>
  );
}
