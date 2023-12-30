"use server";

import { auth } from "auth";
import { T_ViewedFlashcardStats } from "components/Practice/types";
import { db } from "db/index";

import { flashcardStatistics as flashcardStatisticsTable } from "db/schema/flashcardStatistics";
import { flashcard as flashcardsTable } from "db/schema/flashcards";
import { isTuple } from "db/utils";
import { and, eq, sql } from "drizzle-orm";
import { SQLiteRaw } from "drizzle-orm/sqlite-core/query-builders/raw";
import { redirect } from "next/navigation";
import { T_FinishPracticeCRUDPayload } from "src/types/action";
import { T_PracticeFlashcardData } from "src/types/flashcard";

const createFlashcard = ({
  question,
  answer,
  userId,
  folderId,
}: typeof flashcardsTable.$inferInsert) => {
  return db.transaction(async (tx) => {
    const flashcardReturn = await tx
      .insert(flashcardsTable)
      .values({ question, answer, userId, folderId })
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
}: typeof flashcardsTable.$inferInsert) => {
  return db
    .update(flashcardsTable)
    .set({ question, answer, folderId })
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

const updateFlashcardStatistics = async (
  stats: T_ViewedFlashcardStats[],
  userId: string,
): Promise<T_FinishPracticeCRUDPayload[]> => {
  let updates: any[] = [];

  stats.map((s) =>
    updates.push(
      db
        .update(flashcardStatisticsTable)
        .set({
          correct: sql`${flashcardStatisticsTable.correct} + ${s.correct}`,
          incorrect: sql`${flashcardStatisticsTable.incorrect} + ${s.incorrect}`,
          skipped: sql`${flashcardStatisticsTable.skipped} + ${s.skipped}`,
        })
        .where(
          and(
            eq(flashcardStatisticsTable.userId, userId),
            eq(flashcardStatisticsTable.flashcardId, s.flashcardId),
          ),
        ),
    ),
  );

  if (isTuple(updates)) {
    await db.batch(updates);
  }

  // ? merges all of the flashcards stats
  return [
    {
      correct: stats.reduce((acc, item) => acc + item.correct, 0),
      incorrect: stats.reduce((acc, item) => acc + item.incorrect, 0),
      skipped: stats.reduce((acc, item) => acc + item.skipped, 0),
    },
  ];
};

const selectPracticeFlashcards = async (
  folderId: string,
  mode: string,
): Promise<SQLiteRaw<T_PracticeFlashcardData[]>> => {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  if (mode === "all") {
    return db.all(sql`
    WITH RECURSIVE FolderHierarchy AS (
      SELECT
        id,
        parentId
      FROM
        folder
      WHERE
        id = ${folderId}
      UNION ALL
      SELECT
        f.id,
        f.parentId
      FROM
        folder f
      JOIN
        FolderHierarchy h ON f.parentId = h.id
    )
    
    SELECT
      flashcard.id,
      flashcard.question,
      flashcard.answer,
      flashcardStatistics.bookmarked AS bookmarked
    FROM
      flashcard
    LEFT JOIN
      flashcardStatistics ON flashcard.id = flashcardStatistics.flashcardId
    WHERE
      flashcard.folderId IN (SELECT id FROM FolderHierarchy)
      AND flashcard.userId = ${session.user.id};
    
    `);
  }
  return db.all(sql`
    SELECT
      flashcard.id,
      flashcard.question,
      flashcard.answer,
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
  selectPracticeFlashcards,
  updateFlashcard,
  updateFlashcardStatistics,
};
