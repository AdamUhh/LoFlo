type T_FlashcardData = {
  id: string;
  question: string;
  answer: string;
  bookmarked: boolean;
};

type T_Folder = {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  subfolderCount: number;
  flashcardCount: number;
  flashcardData: T_FlashcardData;
};

type T_FolderTemplate = {
  id: string;
  name: string;
  subfolderCount?: string | number;
  flashcardCount?: string | number;
};

export type { T_Folder, T_FlashcardData, T_FolderTemplate };
