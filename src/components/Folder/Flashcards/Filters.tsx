"use client"

import { useState } from "react";
import { Button } from "shadcn/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "shadcn/components/ui/dropdown-menu";

export default function Filter() {

  const [position, setPosition] = useState("bottom")
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // return (
    // <ToggleGroup type="single">
    //   <ToggleGroupItem value="all" aria-label="Toggle all">
    //     All
    //   </ToggleGroupItem>
    //   <ToggleGroupItem value="bookmarked" aria-label="Toggle bookmarked">
    //     Bookmarked
    //   </ToggleGroupItem>
    //   <ToggleGroupItem value="incorrect" aria-label="Toggle incorrect">
    //     Incorrect
    //   </ToggleGroupItem>
    //   <ToggleGroupItem value="skipped" aria-label="Toggle skipped">
    //     Skipped
    //   </ToggleGroupItem>
    // </ToggleGroup>
  // );
}
