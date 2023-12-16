"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shadcn/components/ui/select";
import Order from "./Order";

export const sortStateArr = ["Name", "Created-At", "Last-Updated"];

export default function Sort() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSort(sortValue: string) {
    const params = new URLSearchParams(searchParams);

    if (sortValue !== "Name") params.set("sort", sortValue);
    else params.delete("sort");

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <Select defaultValue="Name" onValueChange={handleSort}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={`By Name`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sortStateArr.map((s) => (
              <SelectItem key={s} value={s}>By {s.replace("-", " ")}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Order />
    </>
  );
}
