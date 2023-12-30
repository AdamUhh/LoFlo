import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shadcn/components/ui/dialog";
import { T_CRUDReturn, T_FinishPracticeCRUDPayload } from "src/types/action";

type FiltersProps = {
  previouslySubmittedData?: T_FinishPracticeCRUDPayload;
  handleFinishPractice: () => Promise<T_CRUDReturn<T_FinishPracticeCRUDPayload[]>>;
  folderId: string;
};

export default function FinishedDialog({
  previouslySubmittedData,
  handleFinishPractice,
  folderId,
}: FiltersProps) {
  const [stats, setStats] = useState<T_FinishPracticeCRUDPayload>();
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);

  async function handleClick() {
    setLoadingDialog(true);

    try {
      const result = await handleFinishPractice();

      if (!!result.payload && !!result.payload.length) {
        // Merge values from previouslySubmittedData and the result
        const mergedValues = {
          correct:
            (previouslySubmittedData?.correct || 0) +
            result.payload.reduce((acc, item) => acc + item.correct, 0),
          incorrect:
            (previouslySubmittedData?.incorrect || 0) +
            result.payload.reduce((acc, item) => acc + item.incorrect, 0),
          skipped:
            (previouslySubmittedData?.skipped || 0) +
            result.payload.reduce((acc, item) => acc + item.skipped, 0),
        };

        setStats(mergedValues);
      }
      setShowStatsDialog(true);
    } catch (error) {
      console.error("Failed to update flashcardStats:", error);
    } finally {
      setLoadingDialog(false);
    }
  }

  return (
    <>
      <Dialog open={loadingDialog} onOpenChange={setLoadingDialog}>
        <Button
          title="Finish Practicing"
          className="ml-auto px-3"
          variant={"secondary"}
          onClick={handleClick}
        >
          Finish Practicing
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading</DialogTitle>
            <DialogDescription className="flex gap-2">
              <Loader2 className="animate-spin" /> Please wait for your stats to load
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stats</DialogTitle>
            <DialogDescription>Your stats for this session</DialogDescription>
          </DialogHeader>
          <div>
            <p>Total Correct: {stats?.correct || 0}</p>
            <p>Total Incorrect: {stats?.incorrect || 0}</p>
            <p>Total Skipped: {stats?.skipped || 0}</p>
          </div>
          <DialogFooter>
            <Button className="bg-[#5CC68B]" asChild>
              <Link className="flex gap-2" href={`/${folderId}`}>
                <Check />
                Finished
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
