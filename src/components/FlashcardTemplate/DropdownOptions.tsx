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
  showQueue = false,
}: {
  setEditDialog: Dispatch<SetStateAction<boolean>>;
  setDeleteDialog: Dispatch<SetStateAction<boolean>>;
  showQueue?: boolean;
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
        {showQueue && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Plus size={15} />
              <span className="pl-2"> Add flashcard to queue</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
