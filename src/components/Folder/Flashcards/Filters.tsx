"use client";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "shadcn/components/ui/dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const initialState = {
  all: true,
  bookmarked: false,
  incorrect: false,
  skipped: false,
};

export default function Filter() {
  const [filters, setFilters] = useState<Record<string, Checked>>(initialState);

  function handleAllChange() {
    setFilters(initialState);
  }

  function handleChange(option: keyof typeof filters) {
    setFilters((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        [option]: !prevFilters[option],
      };

      // Check 'All' if all other options are unchecked
      if (Object.values(newFilters).every((value) => !value)) {
        newFilters.all = true;
      } else {
        newFilters.all = false;
      }

      return newFilters;
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <ChevronDown size={15} />
          <span>Filters</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuCheckboxItem checked={filters.all} onCheckedChange={handleAllChange}>
          All
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {Object.keys(filters)
          .filter((key) => key !== "all")
          .map((key) => (
            <DropdownMenuCheckboxItem
              key={key}
              checked={filters[key as keyof typeof filters]}
              onCheckedChange={() => handleChange(key as keyof typeof filters)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
