import Link from "next/link";
import { Button } from "shadcn/components/ui/button";

export default function OptionsBar() {
  return (
    <div>
      <Button asChild>
        <Link href="/my-folders">View All Folders</Link>
      </Button>
    </div>
  );
}
