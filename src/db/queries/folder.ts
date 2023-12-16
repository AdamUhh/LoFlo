import { auth } from "auth";
import { sql } from "drizzle-orm";
import { SQLiteRaw } from "drizzle-orm/sqlite-core/query-builders/raw";
import { redirect } from "next/navigation";
import { db } from "db/index";

export const selectFolder = async (
  folderId: string,
): Promise<SQLiteRaw<{ id: string; name: string; description: string }[]>> => {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const whereCondition = sql`folder.parentId == ${folderId} AND folder.userId == ${session.user.id}`;

  return db.all(sql`
    SELECT 
        folder.id,
        folder.name, 
        folder.description
    FROM folder
    LEFT JOIN flashcard ON folder.id = flashcard.folderId
    WHERE ${whereCondition};
  `);
};
