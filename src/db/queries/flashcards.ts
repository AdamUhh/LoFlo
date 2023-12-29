"use server";

import { auth } from "auth";
import { db } from "db/index";

import { flashcard as flashcardsTable } from "db/schema/flashcards";
import { flashcardStatistics as flashcardStatisticsTable } from "db/schema/flashcardStatistics";
import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { SQLiteRaw } from "drizzle-orm/sqlite-core/query-builders/raw";
import { T_PracticeFlashcardData } from "src/types/flashcard";

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

const selectPracticeFlashcards = async (
  folderId: string,
  mode: string,
): Promise<SQLiteRaw<T_PracticeFlashcardData[]>> => {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  if (mode === "all") {
  }
  return db.all(sql`
    SELECT
      flashcard.id,
      flashcard.question,
      flashcard.answer,
      flashcard.autoSpeakerMode,
      flashcardStatistics.bookmarked as bookmarked
    FROM
    flashcard
    LEFT JOIN flashcardStatistics ON flashcard.id = flashcardStatistics.flashcardId
    WHERE flashcard.folderId = ${folderId} AND flashcard.userId = ${session.user.id};
    `);
};

export {
  bookmarkFlashcard,
  createFlashcard,
  deleteFlashcard,
  updateFlashcard,
  selectPracticeFlashcards,
};
