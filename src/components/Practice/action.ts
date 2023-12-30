"use server";

import { auth } from "auth";
import { updateFlashcardStatistics } from "db/queries/flashcards";
import { T_CRUDReturn, T_FinishPracticeCRUDPayload } from "src/types/action";
import { z } from "zod";
import { T_ViewedFlashcardStats } from "./types";

const updateSchema = z.array(
  z.object({
    flashcardId: z.string(),
    correct: z.number(),
    incorrect: z.number(),
    lastReviewed: z.string(),
    skipped: z.number(),
  }),
);

async function updateFlashcardStatisticsAction(
  stats: T_ViewedFlashcardStats[],
): Promise<T_CRUDReturn<T_FinishPracticeCRUDPayload[]>> {
  const session = await auth();

  if (!session?.user.id)
    return {
      status: "error",
      returnMessage: "No user found",
    };

  const parse = updateSchema.safeParse(stats);

  if (!parse.success) {
    return {
      status: "error",
      returnMessage: parse.error.errors?.[0]?.message || "Missing Fields!",
    };
  }

  const data = parse.data;

  // ? Check if all correct, incorrect, and skipped values are 0 in the data array
  // ? prevents unnecessary call to database
  const allZeros = data.every(
    (flashcard) => flashcard.correct === 0 && flashcard.incorrect === 0 && flashcard.skipped === 0,
  );

  if (allZeros) {
    return {
      status: "success",
      returnMessage: "No Change",
      payload: [{ correct: 0, incorrect: 0, skipped: 0 }],
    };
  }
  try {
    const updatedFlashcardStatsRes = await updateFlashcardStatistics(data, session.user.id);

    return {
      status: "success",
      returnMessage: "Updated Flashcards Stats",
      payload: updatedFlashcardStatsRes,
    };
  } catch (e) {
    return {
      status: "error",
      returnMessage: `Failed to update flashcard stats!`,
    };
  }
}

export { updateFlashcardStatisticsAction };
