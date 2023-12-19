import { Play } from "lucide-react";
import { Button } from "shadcn/components/ui/button";
import AddFlashcardButton from "./AddFlashcard";

export default function OptionsBar({ flashcardCount }: { flashcardCount: string | number }) {
  return (
    <>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-medium">Flashcards</h2>
          <AddFlashcardButton />
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#5CC68B] px-10 text-white hover:bg-[#6FD19B]">
            <Play fill="white" size={20} /> <span className="pl-2">Practice</span>
          </Button>
        </div>
      </div>
      <div className="w-full text-left text-sm opacity-50">No. of flashcards: {flashcardCount}</div>
    </>
  );
}
