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

export default function DropdownOptions({
  setEditDialog,
  setDeleteDialog,
}: {
  setEditDialog: Dispatch<SetStateAction<boolean>>;
  setDeleteDialog: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="p-0">
          <MoreVertical />
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
          <span className="pl-2"> Add folder to queue</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
