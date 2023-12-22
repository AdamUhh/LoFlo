import { MoreVertical, Pencil, Trash2, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "shadcn/components/ui/dropdown-menu";

export default function FlashcardDropdownOptions({
  setEditDialog,
  setDeleteDialog,
}: {
  setEditDialog: Dispatch<SetStateAction<boolean>>;
  setDeleteDialog: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"} className="bg-transparent p-0 hover:bg-secondary">
          <MoreVertical size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setEditDialog(true)}>
          <Pencil size={15} />
          <span className="pl-2">Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
          <Trash2 size={15} />
          <span className="pl-2">Delete</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus size={15} />
          <span className="pl-2"> Add flashcard to queue</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}