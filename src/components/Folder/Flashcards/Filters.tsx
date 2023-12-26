"use client";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
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

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleFilter(newFilters: Record<string, Checked>) {
    const params = new URLSearchParams(searchParams);

    const filterValues = Object.entries(newFilters)
      .map(([k, v]) => v && k)
      .filter(Boolean);

    if (!filterValues.includes("all")) params.set("filter", filterValues.join(","));
    else params.delete("filter");

    replace(`${pathname}?${params.toString()}`);
  }

  function handleAllChange() {
    setFilters(initialState);
    handleFilter(initialState);
  }

  function handleChange(option: keyof typeof filters) {
    const newFilters = {
      ...filters,
      [option]: !filters[option],
    };

    // Check 'All' if all other options are unchecked
    if (Object.values(newFilters).every((value) => !value)) {
      newFilters.all = true;
    } else {
      newFilters.all = false;
    }

    setFilters(newFilters);

    handleFilter(newFilters);
  }

  return (
    <>
      <div className="flex w-fit gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-1">
              <ChevronDown size={15} />
              <span>
                {!filters["all"]
                  ? Object.entries(filters)
                      .map(([k, v]) => v && k)
                      .filter(Boolean)
                      .map((v) => <span className="text-left text-sm opacity-50">{v}{" "}</span>)
                  : "Filters"}
              </span>
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
      </div>
      <div className="flex gap-1"></div>
    </>
  );
}
