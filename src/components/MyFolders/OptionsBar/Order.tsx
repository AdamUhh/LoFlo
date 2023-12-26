"use client";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "shadcn/components/ui/button";

export default function Order() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [orderValue, setOrderValue] = useState<"ASC" | "DESC">(
    !!searchParams.get("order")?.length
      ? searchParams.get("order") === "ASC"
        ? "ASC"
        : "DESC"
      : "ASC",
  );

  function handleOrder() {
    const returnVal = orderValue === "ASC" ? "DESC" : "ASC";

    const params = new URLSearchParams(searchParams);

    if (returnVal === "ASC") params.delete("order")
    else params.set("order", returnVal);
  
    replace(`${pathname}?${params.toString()}`);

    setOrderValue(returnVal);
  }

  return (
    <Button variant={"outline"} className="px-2" onClick={handleOrder}>
      {orderValue === "ASC" ? <ArrowUpNarrowWide size={20} /> : <ArrowDownNarrowWide size={20} />}
    </Button>
  );
}
