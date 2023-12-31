import AddFlashcardButton from "../../FlashcardTemplate/AddFlashcard";
import Filters from "./Filters";
import Order from "./Order";
import PracticeButton from "./Practice";
import Search from "./Search";

export default function OptionsBar({ flashcardCount }: { flashcardCount: string | number }) {
  return (
    <>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-medium">Flashcards</h2>
          <AddFlashcardButton />
        </div>
        <div className="flex items-center gap-2">
          <PracticeButton />
        </div>
      </div>
      <div className="text-left text-sm opacity-50">No. of flashcards: {flashcardCount}</div>
      <div className="flex w-full">
        <div className="max-w-[40%]">
          <Search />
        </div>
        <div className="ml-auto flex gap-1">
          <Filters />
          <Order />
        </div>
      </div>
    </>
  );
}
