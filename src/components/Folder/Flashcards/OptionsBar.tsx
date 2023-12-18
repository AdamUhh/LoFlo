import { Play } from "lucide-react";
import { Button } from "shadcn/components/ui/button";
import AddFlashcardButton from "./AddFlashcard";

export default function OptionsBar() {
  return (
    <div className="mt-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-medium">Flashcards</h2>
        <AddFlashcardButton />
      </div>
      <Button className="bg-[#5CC68B] text-white px-10 hover:bg-[#6FD19B]">
        <Play fill="white" size={20} /> <span className="pl-2">Start</span>
      </Button>
    </div>
  );
}
