"use client";

import { Input } from "shadcn/components/ui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);

    if (term) params.set("query", term);
    // automatically clear query param if search input is empty
    else params.delete("query");

    replace(`${pathname}?${params.toString()}`);
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch(e.currentTarget.value);
    }
  }

  return (
    <Input
      type="search"
      placeholder="🔎 Search"
      //   onChange={(e) => handleSearch(e.target.value)}
      onKeyDown={handleKeyPress}
      defaultValue={searchParams.get("query")?.toString()}
    />
  );
}
