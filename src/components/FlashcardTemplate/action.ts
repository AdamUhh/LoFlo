"use server";

import { auth } from "auth";
import {
  bookmarkFlashcard,
  createFlashcard,
  deleteFlashcard,
  updateFlashcard,
} from "db/queries/flashcards";
import { revalidatePath } from "next/cache";
import { T_CRUDReturn } from "src/types/action";
import { MAX_TEXTAREA_CHAR } from "src/utils/constants";
import { z } from "zod";

const createSchema = z.object({
  flashcardQuestion: z
    .string()
    .trim()
    .min(1, { message: "Question field has to be filled." })
    .max(MAX_TEXTAREA_CHAR, { message: `Question too long! Max Characters: ${MAX_TEXTAREA_CHAR}` }),
  flashcardAnswer: z
    .string()
    .trim()
    .max(MAX_TEXTAREA_CHAR, { message: `Answer too long! Max Characters: ${MAX_TEXTAREA_CHAR}` })
    .optional(),
  speakerMode: z.union([z.literal("on"), z.literal(null)]),
  flashcardFolderParentId: z.string().trim(),
});

const deleteSchema = z.object({
  flashcardId: z.string().trim().min(5, { message: "Folder id not found..." }),
  flashcardFolderParentId: z.string().trim(),
});

const updateSchema = z.object({}).merge(deleteSchema).merge(createSchema);

async function createFlashcardAction(_: any, formData: FormData): Promise<T_CRUDReturn> {
  const session = await auth();

  if (!session?.user.id)
    return {
      status: "error",
      returnMessage: "No user found",
    };

  const parse = createSchema.safeParse({
    flashcardQuestion: formData.get("flashcardQuestion"),
    flashcardAnswer: formData.get("flashcardAnswer"),
    speakerMode: formData.get("speakerMode"),
    flashcardFolderParentId: formData.get("flashcardFolderParentId"),
  });

  if (!parse.success) {
    return {
      status: "error",
      returnMessage: parse.error.errors?.[0]?.message || "Missing Fields!",
    };
  }

  const data = parse.data;

  try {
    const insertedFlashcardRes = await createFlashcard({
      question: data.flashcardQuestion,
      answer: data.flashcardAnswer,
      userId: session.user.id,
      autoSpeakerMode: data.speakerMode !== null,
      folderId: data.flashcardFolderParentId,
    });

    revalidatePath(
      !!data.flashcardFolderParentId ? `/${data.flashcardFolderParentId}` : "/my-folders",
    );

    return {
      status: "success",
      returnMessage: data.flashcardQuestion,
      redirectPayload: `/${data.flashcardFolderParentId}/${insertedFlashcardRes[0].flashcardId}`,
    };
  } catch (e) {
    return {
      status: "error",
      returnMessage: `Failed to create flashcard\n${e}`,
    };
  }
}

async function updateFlashcardAction(_: any, formData: FormData): Promise<T_CRUDReturn> {
  const session = await auth();

  if (!session?.user.id)
    return {
      status: "error",
      returnMessage: "No user found",
    };

  const parse = updateSchema.safeParse({
    flashcardQuestion: formData.get("flashcardQuestion"),
    flashcardAnswer: formData.get("flashcardAnswer"),
    speakerMode: formData.get("speakerMode"),
    flashcardFolderParentId: formData.get("flashcardFolderParentId"),
    flashcardId: formData.get("flashcardId"),
  });

  if (!parse.success) {
    return {
      status: "error",
      returnMessage: parse.error.errors?.[0]?.message || "Missing Fields!",
    };
  }

  const data = parse.data;

  try {
    const updatedFlashcardRes = await updateFlashcard({
      question: data.flashcardQuestion,
      answer: data.flashcardAnswer,
      userId: session.user.id,
      autoSpeakerMode: data.speakerMode !== null,
      folderId: data.flashcardFolderParentId,
      id: data.flashcardId,
    });

    revalidatePath(
      !!data.flashcardFolderParentId ? `/${data.flashcardFolderParentId}` : "/my-folders",
    );

    return {
      status: "success",
      returnMessage: data.flashcardQuestion.substring(0, 50),
      redirectPayload: `/${data.flashcardFolderParentId}/${updatedFlashcardRes[0].flashcardId}`,
    };
  } catch (e) {
    return {
      status: "error",
      returnMessage: `Failed to update flashcard\n${e}`,
    };
  }
}

async function deleteFlashcardAction(_: any, formData: FormData): Promise<T_CRUDReturn> {
  const session = await auth();

  if (!session?.user.id)
    return {
      status: "error",
      returnMessage: "No user found",
    };

  const parse = deleteSchema.safeParse({
    flashcardFolderParentId: formData.get("flashcardFolderParentId"),
    flashcardId: formData.get("flashcardId"),
  });

  if (!parse.success) {
    return {
      status: "error",
      returnMessage: parse.error.errors?.[0]?.message || "Missing Fields!",
    };
  }

  const data = parse.data;

  try {
    await deleteFlashcard({
      id: data.flashcardId,
      userId: session.user.id,
      folderId: data.flashcardFolderParentId,
    });

    revalidatePath(
      !!data.flashcardFolderParentId ? `/${data.flashcardFolderParentId}` : "/my-folders",
    );

    return {
      status: "success",
      returnMessage: "Deleted flashcard",
    };
  } catch (e) {
    return {
      status: "error",
      returnMessage: `Failed to delete flashcard\n${e}`,
    };
  }
}

async function bookmarkFlashcardAction({
  folderId,
  flashcardId,
  bookmarked,
}: {
  bookmarked: boolean;
  folderId: string;
  flashcardId: string;
}) {
  const session = await auth();

  if (!session?.user.id)
    return {
      status: "error",
      returnMessage: "No user found",
    };

  try {
    await bookmarkFlashcard({
      flashcardId,
      userId: session.user.id,
      bookmarked: !bookmarked,
    });

    revalidatePath(!!folderId ? `/${folderId}` : "/my-folders");

    return {
      status: "success",
      returnMessage: "Bookmarked flashcard",
    };
  } catch (e) {
    return {
      status: "error",
      returnMessage: `Failed to bookmark flashcard\n${e}`,
    };
  }
}

export {
  bookmarkFlashcardAction, createFlashcardAction, deleteFlashcardAction, updateFlashcardAction
};

