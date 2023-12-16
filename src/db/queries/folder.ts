import { auth } from "auth";
import { db } from "db/index";
import { sql } from "drizzle-orm";
import { SQLiteRaw } from "drizzle-orm/sqlite-core/query-builders/raw";
import { redirect } from "next/navigation";

export const selectFolder = async (
  folderId: string,
): Promise<SQLiteRaw<{ id: string; name: string; description: string }[]>> => {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const whereCondition = sql`folder.parentId == ${folderId} AND folder.userId == ${session.user.id}`;

  return db.all(sql`
  WITH RECURSIVE FolderHierarchy AS (
    -- Anchor member: Select the current folder by folderId
    SELECT
      id,
      parentId,
      name,
      description
    FROM folder
    WHERE id == ${folderId}
  
    UNION ALL
  
    -- Recursive member: Select subfolders with parentId equals current folder's id
    SELECT
      f.id,
      f.parentId,
      f.name,
      f.description
    FROM folder f
    INNER JOIN FolderHierarchy fh ON f.parentId = fh.id
  )
  
  -- Select all columns from the recursive CTE
  SELECT
    id,
    parentId,
    name,
    description
  FROM FolderHierarchy;
  `);
};
