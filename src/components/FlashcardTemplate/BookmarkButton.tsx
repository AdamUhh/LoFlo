"use client";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { Button } from "shadcn/components/ui/button";
import { toast } from "sonner";
import { T_CRUDReturn } from "src/types/action";
import { bookmarkFlashcardAction } from "./action";

export default function BookmarkButton({
  bookmarked,
  folderId,
  flashcardId,
}: {
  bookmarked: boolean;
  folderId: string;
  flashcardId: string;
}) {
  const updateBookmark = bookmarkFlashcardAction.bind(null, {
    folderId,
    flashcardId,
    bookmarked
  });

  const [formState, onFormSubmit] = useFormState(updateBookmark, {
    status: "default",
    returnMessage: "",
    redirectPayload: "",
  } as T_CRUDReturn);

  useEffect(() => {
    if (formState.status === "success") {
      toast("Updated bookmark", {
        description: formState.returnMessage,
      });
    }
  }, [formState.status]);

  return (
    <form action={onFormSubmit}>
      <Button type="submit" variant={"secondary"} className="h-fit p-1">
        {bookmarked ? <BookmarkCheck size={20} fill="black" /> : <Bookmark size={20} />}
      </Button>
    </form>
  );
}
