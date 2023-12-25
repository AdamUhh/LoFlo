"use server";

import { db } from "db/index";

import { flashcard as flashcardsTable } from "db/schema/flashcards";
import { flashcardStatistics as flashcardStatisticsTable } from "db/schema/flashcardStatistics";
import { and, eq } from "drizzle-orm";

const createFlashcard = ({
  question,
  answer,
  userId,
  folderId,
  autoSpeakerMode,
}: typeof flashcardsTable.$inferInsert) => {
  return db.transaction(async (tx) => {
    const flashcardReturn = await tx
      .insert(flashcardsTable)
      .values({ question, answer, userId, folderId, autoSpeakerMode })
      .returning({ flashcardId: flashcardsTable.id });

    await tx
      .insert(flashcardStatisticsTable)
      .values({ flashcardId: flashcardReturn[0].flashcardId, userId });

    return flashcardReturn;
  });
};

const updateFlashcard = ({
  question,
  answer,
  id,
  userId,
  folderId,
  autoSpeakerMode,
}: typeof flashcardsTable.$inferInsert) => {
  return db
    .update(flashcardsTable)
    .set({ question, answer, folderId, autoSpeakerMode })
    .where(and(eq(flashcardsTable.id, id!), eq(flashcardsTable.userId, userId)))
    .returning({ flashcardId: flashcardsTable.id });
};

const deleteFlashcard = ({ id, userId }: typeof flashcardsTable.$inferInsert) => {
  return db
    .delete(flashcardsTable)
    .where(and(eq(flashcardsTable.id, id!), eq(flashcardsTable.userId, userId)));
};

const bookmarkFlashcard = ({
  flashcardId,
  userId,
  bookmarked,
}: { userId: string } & typeof flashcardStatisticsTable.$inferInsert) => {
  return db
    .update(flashcardStatisticsTable)
    .set({ bookmarked })
    .where(
      and(
        eq(flashcardStatisticsTable.flashcardId, flashcardId!),
        eq(flashcardStatisticsTable.userId, userId),
      ),
    );
};

export { bookmarkFlashcard, createFlashcard, deleteFlashcard, updateFlashcard };
