type T_FlashcardData = {
  id: string;
  question: string;
  answer: string;
};

type FolderShapeProps = {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  subfolderCount: number;
  flashcardCount: number;
  flashcardData: T_FlashcardData;
};

type T_CreateFlashcardReturn = {
  status: "default" | "success" | "error";
  returnMessage: string;
  redirectPayload?: string;
};

type AddFolderTemplateProps =
  | {
      subfolder: true;
      parentId: string;
    }
  | {
      subfolder: false;
      parentId?: string;
    };

export type { AddFolderTemplateProps, FolderShapeProps, T_CreateFlashcardReturn, T_FlashcardData };
