"use server";

import { auth } from "auth";
import { db } from "db/index";

import { flashcard as flashcardsTable } from "db/schema/flashcards";
import { sql } from "drizzle-orm";
import { SQLiteRaw } from "drizzle-orm/sqlite-core/query-builders/raw";
import { redirect, useParams } from "next/navigation";

export const selectFolders = async (
  query?: string,
  sort?: string,
  order?: string,
): Promise<SQLiteRaw<{ id: string; name: string; subfolderCount: string }[]>> => {
  const session = await auth();
  const params = useParams();
  if (!session?.user) redirect("/signin");

//   let whereCondition = sql`folder.userId == ${session.user.id}`;
//   if (!!params.folder)
//     whereCondition = sql`${whereCondition} AND  LIKE ${"%" + query + "%"}`;
//  if (!!query?.length)
//     whereCondition = sql`${whereCondition} AND folder.name LIKE ${"%" + query + "%"}`;

//   const formattedOrder = !!order?.length
//     ? order.toLowerCase() === "asc"
//       ? sql`ASC`
//       : sql`DESC`
//     : sql`ASC`;
//   let sortCondition = sql`f.name ${formattedOrder}`;

//   if (!!sort?.length) {
//     let formattedSort;
//     if (sort === "Name") formattedSort = sql`f.name`;
//     if (sort === "Created-At") formattedSort = sql`f.createdAt`;
//     if (sort === "Last-Updated") formattedSort = sql`f.updatedAt`;

//     sortCondition = sql`${formattedSort} ${formattedOrder}`;
//   }

  return db.all(sql`
   WITH RECURSIVE FolderHierarchy AS (
    -- Anchor member: Select root folders
    SELECT id, parentId, createdAt, updatedAt, name, 0 AS depth
    FROM folder
    WHERE folder.userId == ${session.user.id}
    
    UNION ALL
    
    -- Recursive member: Select subfolders
    SELECT f.id, f.parentId, f.createdAt, f.updatedAt, f.name, fh.depth + 1 AS depth
    FROM folder f
    JOIN FolderHierarchy fh ON f.parentId = fh.id
  )
  
  -- Select root folders with the count of subfolders
  SELECT 
    id,
    name,
    (
      SELECT COUNT(*)
      FROM FolderHierarchy subfolders
      WHERE subfolders.parentId = FolderHierarchy.id AND subfolders.depth > 0
    ) AS subfolderCount
  FROM FolderHierarchy
  WHERE depth = 0
  ;
    `);
};

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
