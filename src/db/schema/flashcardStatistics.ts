import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { flashcard } from "./flashcards";
import { createUUID } from "src/utils/uuid";

export const flashcardStatistics = sqliteTable("flashcardStatistics", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createUUID()),
  flashcardId: text("flashcardId")
    .notNull()
    .references(() => flashcard.id),
  lastReviewed: integer("lastReviewed", { mode: "timestamp_ms" }),
  timesReviewed: integer("timesReviewed").notNull().default(0),
  timesCorrect: integer("timesCorrect").notNull().default(0),
  bookmarked: integer("bookmarked", { mode: "boolean" }).notNull().default(false),
  skipped: integer("skipped").notNull().default(0),
});
