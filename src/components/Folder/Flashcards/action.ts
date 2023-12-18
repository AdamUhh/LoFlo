"use server";

import { auth } from "auth";
import { insertFlashcard } from "db/queries/allFlashcards";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { T_CreateFlashcardReturn } from "./types";

const schema = z.object({
  flashcardQuestion: z
    .string()
    .trim()
    .min(1, { message: "Folder name field has to be filled." })
    .max(50, { message: "Folder name too long! Max Characters: 50" }),
  flashcardAnswer: z
    .string()
    .trim()
    .max(100, { message: "Folder description too long! Max Characters: 100" })
    .optional(),
  speakerMode: z.union([z.literal("on"), z.literal(null)]),
  flashcardFolderParentId: z.string().trim(),
});

export default async function createFlashcard(
  _: any,
  formData: FormData,
): Promise<T_CreateFlashcardReturn> {
  const session = await auth();

  const parse = schema.safeParse({
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
    // ? Create Flashcard via drizzleorm
    if (!session?.user.id)
      return {
        status: "error",
        returnMessage: "No user found",
      };

    const insertedFlashcardRes = await insertFlashcard({
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
