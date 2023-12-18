"use server";

import { auth } from "auth";
import { insertFolder } from "db/queries/allFolders";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { T_CreateFolderReturn } from "./types";

const schema = z.object({
  folderName: z
    .string()
    .trim()
    .min(1, { message: "Folder name field has to be filled." })
    .max(50, { message: "Folder name too long! Max Characters: 50" }),
  folderDescription: z
    .string()
    .trim()
    .max(100, { message: "Folder description too long! Max Characters: 100" })
    .optional(),
  speakerMode: z.union([z.literal("on"), z.literal(null)]),
  folderParentId: z.string().nullable(),
});

export default async function createFolder(
  _: any,
  formData: FormData,
): Promise<T_CreateFolderReturn> {
  const session = await auth();

  const parse = schema.safeParse({
    folderName: formData.get("folderName"),
    folderDescription: formData.get("folderDescription"),
    speakerMode: formData.get("speakerMode"),
    folderParentId: formData.get("folderParentId"),
  });

  if (!parse.success) {
    return {
      status: "error",
      returnMessage: parse.error.errors?.[0]?.message || "Missing Fields!",
    };
  }

  const data = parse.data;
  const FolderType = !!data.folderParentId ? "subfolder" : "folder"

  try {
    // ? Create Folder via drizzleorm
    if (!session?.user.id)
      return {
        status: "error",
        returnMessage: "No user found",
      };

    const insertedFolderRes = await insertFolder({
      name: data.folderName,
      description: data.folderDescription,
      userId: session?.user.id,
      autoSpeakerMode: data.speakerMode !== null,
      parentId: data.folderParentId,
    });

    revalidatePath(!!data.folderParentId ? `/${data.folderParentId}` : "/my-folders");

    return {
      status: "success",
      returnMessage: data.folderName,
      redirectPayload: `/${insertedFolderRes[0].folderId}`,
    };
  } catch (e) {
    return {
      status: "error",
      returnMessage: `Failed to create ${FolderType}`,
    };
  }
}
