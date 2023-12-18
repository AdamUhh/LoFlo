"use server";

import { db } from "db/index";

import { flashcard as flashcardsTable } from "db/schema/flashcards";

export const insertFlashcard = ({
  question,
  answer,
  userId,
  folderId,
  autoSpeakerMode,
}: typeof flashcardsTable.$inferInsert) => {
  return db
    .insert(flashcardsTable)
    .values({ question, answer, userId, folderId, autoSpeakerMode })
    .returning({ flashcardId: flashcardsTable.id });
};
