"use server";

import { auth } from "auth";
import { db } from "db/index";

import { folder as foldersTable } from "db/schema/folders";
import { sql } from "drizzle-orm";
import { SQLiteRaw } from "drizzle-orm/sqlite-core/query-builders/raw";
import { redirect } from "next/navigation";
// const selectRootFoldersTable = db.$with("selectRootFoldersTable").as(
//   db
//     .select()
//     .from(foldersTable)
//     .where(and(isNull(foldersTable.parentId), eq(foldersTable.userId, sql.placeholder("userId")))),
// );

// export const selectFolders = db
//   .with(selectRootFoldersTable)
//   .select({
//     id: selectRootFoldersTable.id,
//     name: selectRootFoldersTable.name,
//     flashcardCount: sql<number>`cast(count(${flashcardsTable.id}) as int)`,
//     subfolderCount: sql<number>`cast(count(${foldersTable.parentId}) as int)`,
//   })
//   .from(selectRootFoldersTable)
//   .leftJoin(flashcardsTable, eq(flashcardsTable.folderId, selectRootFoldersTable.id))
//   .leftJoin(
//     foldersTable,
//     or(isNull(foldersTable.parentId), eq(foldersTable.parentId, selectRootFoldersTable.id)),
//   )
//   .prepare();

// ----------------------

// WITH RECURSIVE FolderHierarchy AS (
//     -- Anchor member: Select root folders
//     SELECT id, parent_id, name, 0 AS depth
//     FROM folder
//     WHERE parent_id IS NULL AND folder.userId == ${userId}

//     UNION ALL

//     -- Recursive member: Select subfolders
//     SELECT f.id, f.parent_id, f.name, fh.depth + 1 AS depth
//     FROM folder f
//     JOIN FolderHierarchy fh ON f.parent_id = fh.id
//   )

//   -- Select root folders with the count of subfolders
//   SELECT
//     root_folders.id AS root_folder_id,
//     root_folders.name AS root_folder_name,
//     COUNT(subfolders.id) AS subfolder_count
//   FROM (
//     SELECT id, name
//     FROM FolderHierarchy
//     WHERE depth = 0
//   ) AS root_folders
//   LEFT JOIN folder subfolders ON root_folders.id = subfolders.parent_id
//   GROUP BY root_folders.id, root_folders.name;

export const selectFolders = async (
  query?: string,
  sort?: string,
  order?: string,
): Promise<SQLiteRaw<{ id: string; name: string; subfolderCount: string }[]>> => {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  let whereCondition = sql`parentId IS NULL AND folder.userId == ${session.user.id}`;
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
    if (sort === "Created-At") formattedSort = sql`f.createdAt`;
    if (sort === "Last-Updated") formattedSort = sql`f.updatedAt`;

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
    FROM folder f
    JOIN FolderHierarchy fh ON f.parentId = fh.id
    ORDER BY ${sortCondition}

  )

  -- Select root folders with the count of subfolders and flashcards
  SELECT 
    FolderHierarchy.id,
    FolderHierarchy.name,
    (
      SELECT COUNT(*)
      FROM FolderHierarchy subfolders
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


  // return db.all(sql`
  //  WITH RECURSIVE FolderHierarchy AS (
  //   -- Anchor member: Select root folders
  //   SELECT id, parentId, createdAt, updatedAt, name, 0 AS depth
  //   FROM folder
  //   WHERE ${whereCondition}
    
  //   UNION ALL
    
  //   -- Recursive member: Select subfolders
  //   SELECT f.id, f.parentId, f.createdAt, f.updatedAt, f.name, fh.depth + 1 AS depth
  //   FROM folder f
  //   JOIN FolderHierarchy fh ON f.parentId = fh.id
  //   ORDER BY ${sortCondition}
  // )
  
  // -- Select root folders with the count of subfolders
  // SELECT 
  //   id,
  //   name,
  //   (
  //     SELECT COUNT(*)
  //     FROM FolderHierarchy subfolders
  //     WHERE subfolders.parentId = FolderHierarchy.id AND subfolders.depth > 0
  //   ) AS subfolderCount
  // FROM FolderHierarchy
  // WHERE depth = 0
  // ;
  //   `);
};

export const insertFolder = ({
  name,
  description,
  userId,
  parentId,
  autoSpeakerMode,
}: typeof foldersTable.$inferInsert) => {
  return db
    .insert(foldersTable)
    .values({ name, description, userId, parentId, autoSpeakerMode })
    .returning({ folderId: foldersTable.id });
};
