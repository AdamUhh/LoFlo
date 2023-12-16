import { useFormStatus } from "react-dom";
import { Button } from "shadcn/components/ui/button";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="flex gap-1">
      <Button type="submit" disabled={pending}>
        {pending ? <span>Creating Folder...</span> : "Create Folder"}
      </Button>
    </div>
  );
}
