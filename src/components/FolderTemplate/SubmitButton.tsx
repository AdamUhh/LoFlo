import { useFormStatus } from "react-dom";
import { Button } from "shadcn/components/ui/button";
import { cn } from "shadcn/utils";

export default function SubmitButton({
  mode = "create",
}: {
  mode?: "create" | "update" | "delete";
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn(mode === "delete" && "hover:bg-destructive")}
    >
      {pending ? (
        <span>
          {mode === "update" ? "Updating " : mode === "delete" ? "Deleting" : "Creating"}{" "}
          Folder...
        </span>
      ) : (
        <span>
          {mode === "update"
            ? "Update Folder"
            : mode === "delete"
              ? "I'm sure, Delete"
              : "Create Folder"}
        </span>
      )}
    </Button>
  );
}
