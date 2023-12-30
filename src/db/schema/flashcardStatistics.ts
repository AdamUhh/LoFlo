import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createUUID } from "src/utils/uuid";
import { users } from "./auth";
import { flashcard } from "./flashcards";

export const flashcardStatistics = sqliteTable("flashcardStatistics", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createUUID()),
  flashcardId: text("flashcardId")
    .notNull()
    .references(() => flashcard.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lastReviewed: integer("lastReviewed", { mode: "timestamp_ms" }),
  timesReviewed: integer("timesReviewed").notNull().default(0),
  correct: integer("correct").notNull().default(0),
  incorrect: integer("incorrect").notNull().default(0),
  bookmarked: integer("bookmarked", { mode: "boolean" }).notNull().default(false),
  skipped: integer("skipped").notNull().default(0),
});
