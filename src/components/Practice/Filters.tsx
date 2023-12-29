import { Button } from "shadcn/components/ui/button";

export default function Filters({ folderId }: { folderId: string }) {
  return (
    <div className="w-full flex">
      <Button title="Finish Practicing" className="px-3 ml-auto" variant={"secondary"}>
        Finish Practicing
      </Button>
    </div>
  );
}
