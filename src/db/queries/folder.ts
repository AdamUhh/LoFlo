import { auth } from "auth";
import { db } from "db/index";
import { sql } from "drizzle-orm";
import { SQLiteRaw } from "drizzle-orm/sqlite-core/query-builders/raw";
import { redirect } from "next/navigation";

export const selectFolder = async (
  folderId: string,
): Promise<
  SQLiteRaw<
    {
      id: string;
      name: string;
      description: string;
      parentId: string | null;
      subfolderCount: number;
      flashcardCount: number;
    }[]
  >
> => {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const whereCondition = sql`folder.parentId == ${folderId} AND folder.userId == ${session.user.id}`;

  return db.all(sql`
  WITH RECURSIVE FolderHierarchy AS (
    -- Anchor member: Select root folders
    SELECT id, parentId, description, name, 0 AS depth
    FROM folder
    WHERE folder.userId == ${session.user.id}
    
    UNION ALL
    
    -- Recursive member: Select subfolders
    SELECT f.id, f.parentId, f.description, f.name, fh.depth + 1 AS depth
    FROM folder f
    INNER JOIN FolderHierarchy fh ON f.parentId = fh.id
  )
  
  -- Select root folders with the count of subfolders and flashcards
  SELECT 
    FolderHierarchy.id AS id,
    FolderHierarchy.name AS name,
    FolderHierarchy.description AS description,
    FolderHierarchy.parentId AS parentId,
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
  // WITH RECURSIVE FolderHierarchy AS (
  //   -- Anchor member: Select the current folder by folderId
  //   SELECT
  //     id,
  //     parentId,
  //     name,
  //     description
  //   FROM folder
  //   WHERE id == ${folderId}

  //   UNION ALL

  //   -- Recursive member: Select subfolders with parentId equals current folder's id
  //   SELECT
  //     f.id,
  //     f.parentId,
  //     f.name,
  //     f.description
  //   FROM folder f
  //   INNER JOIN FolderHierarchy fh ON f.parentId = fh.id
  // )

  // -- Select all columns from the recursive CTE
  // SELECT
  //   id,
  //   parentId,
  //   name,
  //   description
  // FROM FolderHierarchy;
  // `);
};
