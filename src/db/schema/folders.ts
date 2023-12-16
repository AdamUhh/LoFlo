import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createUUID } from "src/utils/uuid";
import { users } from "./auth";

export const folder = sqliteTable("folder", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createUUID()),
  parentId: text("parentId"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("default"),
  autoSpeakerMode: integer("autoSpeakerMode", { mode: "boolean" }).default(false),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});

