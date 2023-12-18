import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createUUID } from "src/utils/uuid";
import { users } from "./auth";
import { folder } from "./folders";

export const flashcard = sqliteTable("flashcard", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  question: text("question"),
  answer: text("answer"),
  folderId: text("folderId")
    .notNull()
    .references(() => folder.id, { onDelete: "cascade" }),
  autoSpeakerMode: integer("autoSpeakerMode", { mode: "boolean" }).default(false),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});
