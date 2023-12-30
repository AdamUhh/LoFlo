import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
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
        <Button variant={"secondary"} className="h-fit bg-transparent p-1 hover:bg-secondary">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
