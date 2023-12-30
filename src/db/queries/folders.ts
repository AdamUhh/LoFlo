"use server";

import { auth } from "auth";
import { db } from "db/index";

import { folder as foldersTable } from "db/schema/folders";
import { and, eq, sql } from "drizzle-orm";
import { SQLiteRaw } from "drizzle-orm/sqlite-core/query-builders/raw";
import { redirect } from "next/navigation";
import { T_Folder } from "src/types/folder";

// ? Note: Selects have auth() integrated, while other CRUD functions do not,
// ? since their actions pass the auth() result

export const selectFolders = async (
  query?: string,
  sort?: string,
  order?: string,
): Promise<SQLiteRaw<{ id: string; name: string; subfolderCount: string }[]>> => {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  let whereCondition = sql`parentId IS NULL AND folder.userId = ${session.user.id}`;

  if (!!query?.length)
    whereCondition = sql`${whereCondition} AND folder.name LIKE ${"%" + query + "%"}`;

  const formattedOrder = !!order?.length
    ? order.toLowerCase() === "asc"
      ? sql`ASC`
      : sql`DESC`
    : sql`ASC`;

  let sortCondition = sql`f.name ${formattedOrder}`;

  if (!!sort?.length) {
    let formattedSort;

    if (sort === "Name") formattedSort = sql`f.name`;
    else if (sort === "Created-At") formattedSort = sql`f.createdAt`;
    else if (sort === "Last-Updated") formattedSort = sql`f.updatedAt`;

    sortCondition = sql`${formattedSort} ${formattedOrder}`;
  }

  return db.all(sql`
  WITH RECURSIVE FolderHierarchy AS (
    -- Anchor member: Select root folders
    SELECT id, parentId, createdAt, updatedAt, name, 0 AS depth
    FROM folder
    WHERE ${whereCondition}
    
    UNION ALL
    
    -- Recursive member: Select subfolders
    SELECT f.id, f.parentId, f.createdAt, f.updatedAt, f.name, fh.depth + 1 AS depth
    FROM folder AS f
    JOIN FolderHierarchy fh ON f.parentId = fh.id
    ORDER BY ${sortCondition}
  )

  -- Select root folders with the count of subfolders and flashcards
  SELECT 
    FolderHierarchy.id,
    FolderHierarchy.name,
    (
      SELECT COUNT(*)
      FROM FolderHierarchy AS subfolders
      WHERE subfolders.parentId = FolderHierarchy.id AND subfolders.depth > 0
    ) AS subfolderCount,
    (
      SELECT COUNT(*)
      FROM flashcard
      WHERE flashcard.folderId IN (
        SELECT id
        FROM FolderHierarchy descendants
        WHERE descendants.id = FolderHierarchy.id OR descendants.parentId = FolderHierarchy.id
      )
    ) AS flashcardCount
  FROM FolderHierarchy
  WHERE depth = 0
  ;
`);
};

const createFolder = ({
  name,
  description,
  userId,
  parentId,
}: typeof foldersTable.$inferInsert) => {
  return db
    .insert(foldersTable)
    .values({ name, description, userId, parentId })
    .returning({ folderId: foldersTable.id });
};

const updateFolder = ({ id, name, description, userId }: typeof foldersTable.$inferInsert) => {
  return db
    .update(foldersTable)
    .set({ name, description })
    .where(and(eq(foldersTable.id, id!), eq(foldersTable.userId, userId)))
    .returning({ name: foldersTable.name });
};

const deleteFolder = ({ id, userId }: typeof foldersTable.$inferInsert) => {
  // return db
  //   .delete(foldersTable)
  //   .where(and(eq(foldersTable.id, id!), eq(foldersTable.userId, userId)));
  return db.all(sql`
  -- Create a recursive CTE to get all subfolder IDs
  WITH RECURSIVE SubfolderHierarchy AS (
    SELECT id
    FROM folder
    WHERE id = ${id} AND userId = ${userId}
    UNION
    SELECT f.id
    FROM folder f
    JOIN SubfolderHierarchy sfh ON f.parentId = sfh.id
  )
  
  -- Delete the subfolders and the root folder
  DELETE FROM folder
  WHERE id IN (SELECT id FROM SubfolderHierarchy);
  
  `)
};

const selectFolder = async (
  folderId: string,
  query?: string,
  filters?: string[],
  order?: string,
): Promise<SQLiteRaw<T_Folder[]>> => {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  let whereCondition = sql`flashcard.folderId == FolderHierarchy.id AND flashcard.folderId == ${folderId}`;

  if (!!query?.length)
    whereCondition = sql`${whereCondition} AND flashcard.question LIKE ${
      "%" + query + "%"
    } OR flashcard.answer LIKE ${"%" + query + "%"}`;

  if (!!filters?.length) {
    if (filters.includes("bookmarked"))
      whereCondition = sql`${whereCondition} AND flashcardStatistics.bookmarked == TRUE`;
    if (filters.includes("incorrect"))
      whereCondition = sql`${whereCondition} AND flashcardStatistics.incorrect > 0`;
    if (filters.includes("skipped"))
      whereCondition = sql`${whereCondition} AND flashcardStatistics.skipped > 0`;
  }
  const formattedOrder = !!order?.length
    ? order.toLowerCase() === "asc"
      ? sql`ASC`
      : sql`DESC`
    : sql`ASC`;
  let sortCondition = sql`flashcard.question ${formattedOrder}`;

  return db.all(sql`
  WITH RECURSIVE FolderHierarchy AS (
    -- Anchor member: Select root folder and its subfolders (matching parentId)
    SELECT id, parentId, description, name, 0 AS depth
    FROM folder
    WHERE folder.userId == ${session.user.id} AND (folder.id == ${folderId} OR folder.parentId == ${folderId})
    
    UNION ALL
  
    -- Recursive member: Select subfolders
    SELECT f.id, f.parentId, f.description, f.name, fh.depth + 1 AS depth
    FROM folder f
    INNER JOIN FolderHierarchy fh ON f.parentId = fh.id
  )
  
  -- Select root folder with the count of subfolders and flashcards
  SELECT 
    FolderHierarchy.id AS id,
    FolderHierarchy.name AS name,
    FolderHierarchy.description AS description,
    FolderHierarchy.parentId AS parentId,
    (
      SELECT COUNT(*)
      FROM FolderHierarchy subfolders
      WHERE subfolders.parentId == FolderHierarchy.id  AND subfolders.depth > 1
    ) AS subfolderCount,
    (
      SELECT COUNT(*)
      FROM flashcard
      WHERE flashcard.folderId IN (
        SELECT id
        FROM FolderHierarchy descendants
        WHERE descendants.id = FolderHierarchy.id OR descendants.parentId = FolderHierarchy.id
      )
    ) AS flashcardCount,
    (
      SELECT GROUP_CONCAT(
        JSON_OBJECT(
          'id', flashcard.id,
          'question', flashcard.question,
          'answer', flashcard.answer,
          'bookmarked', flashcard.bookmarked
        )
      )
      FROM (
        SELECT
          flashcard.id,
          flashcard.question,
          flashcard.answer,
          flashcardStatistics.bookmarked
        FROM flashcard
        LEFT JOIN flashcardStatistics ON flashcard.id = flashcardStatistics.flashcardId
        WHERE ${whereCondition}
        ORDER BY ${sortCondition}
      ) AS flashcard
    ) AS flashcardData
  FROM FolderHierarchy
  WHERE depth = 0
  ;`);
};

export { createFolder, deleteFolder, selectFolder, updateFolder };
