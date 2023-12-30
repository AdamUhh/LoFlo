import { LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "shadcn/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "shadcn/components/ui/popover";

import { ToggleGroup, ToggleGroupItem } from "shadcn/components/ui/toggle-group";

export default function Layout() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex gap-1" variant={"outline"}>
          <LayoutList /> List
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <ToggleGroup type="single">
          <ToggleGroupItem className="flex w-full gap-1" value="bold" aria-label="Toggle bold">
            <LayoutList /> List
          </ToggleGroupItem>
          <ToggleGroupItem className="flex w-full gap-1" value="italic" aria-label="Toggle italic">
            <LayoutGrid /> Cards
          </ToggleGroupItem>
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}
