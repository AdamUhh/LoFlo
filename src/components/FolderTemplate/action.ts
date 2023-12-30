"use server";

import { auth } from "auth";
import { createFolder, deleteFolder, updateFolder } from "db/queries/folders";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { T_CRUDReturn } from "src/types/action";
import { z } from "zod";

const createSchema = z.object({
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
  folderParentId: z.string().nullable(),
});

const deleteSchema = z.object({
  folderId: z.string().trim().min(5, { message: "Folder id not found..." }),
  folderParentId: z.string().nullable(),
});

const updateSchema = z.object({}).merge(deleteSchema).merge(createSchema);

async function createFolderAction(_: any, formData: FormData): Promise<T_CRUDReturn> {
  const session = await auth();

  if (!session?.user.id)
    return {
      status: "error",
      returnMessage: "No user found",
    };

  const parse = createSchema.safeParse({
    folderName: formData.get("folderName"),
    folderDescription: formData.get("folderDescription"),
    folderParentId: formData.get("folderParentId"),
  });

  if (!parse.success) {
    return {
      status: "error",
      returnMessage: parse.error.errors?.[0]?.message || "Missing Fields!",
    };
  }

  const data = parse.data;
  const FolderType = !!data.folderParentId ? "subfolder" : "folder";

  try {
    const insertedFolderRes = await createFolder({
      name: data.folderName,
      description: data.folderDescription,
      userId: session.user.id,
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

async function updateFolderAction(_: any, formData: FormData): Promise<T_CRUDReturn> {
  const session = await auth();

  if (!session?.user.id)
    return {
      status: "error",
      returnMessage: "No user found",
    };
  const parse = updateSchema.safeParse({
    folderId: formData.get("folderId"),
    folderName: formData.get("folderName"),
    folderDescription: formData.get("folderDescription"),
    folderParentId: null,
  });

  if (!parse.success) {
    return {
      status: "error",
      returnMessage: parse.error.errors?.[0]?.message || "Missing Fields!",
    };
  }

  const data = parse.data;

  try {
    const updatedFolderRes = await updateFolder({
      name: data.folderName,
      description: data.folderDescription,
      userId: session.user.id,
      id: data.folderId,
    });

    revalidatePath(!!data.folderParentId ? `/${data.folderParentId}` : "/my-folders");

    return {
      status: "success",
      returnMessage: updatedFolderRes[0].name || data.folderName,
    };
  } catch (e) {
    return {
      status: "error",
      returnMessage: `Failed to update folder`,
    };
  }
}

async function deleteFolderAction(_: any, formData: FormData): Promise<T_CRUDReturn> {
  const session = await auth();

  if (!session?.user.id)
    return {
      status: "error",
      returnMessage: "No user found",
    };

  const parse = deleteSchema.safeParse({
    folderId: formData.get("folderId"),
    folderParentId: formData.get("folderParentId"),
  });

  if (!parse.success) {
    return {
      status: "error",
      returnMessage: parse.error.errors?.[0]?.message || "Missing Fields!",
    };
  }

  const data = parse.data;
  const FolderType = !!data.folderParentId ? "subfolder" : "folder";

  try {
    await deleteFolder({
      id: data.folderId,
      userId: session.user.id,
      name: "",
    });

    // return {
    //   status: "success",
    //   returnMessage: "Deleted folder and it's flashcards",
    //   redirectPayload: !!data.folderParentId ? `/${data.folderParentId}` : "/my-folders",
    // };
  } catch (e) {
    return {
      status: "error",
      returnMessage: `Failed to delete ${FolderType}`,
    };
  }

  // ? issue where redirecting from clientside is not revalidating
  // ? decided to not add toast
  redirect(!!data.folderParentId ? `/${data.folderParentId}` : "/my-folders");
}

export { createFolderAction, deleteFolderAction, updateFolderAction };
