type FolderShapeProps = {
  id: string;
  name: string;
  subfolderCount?: string | number;
  flashcardCount?: string | number;
};

type T_CreateFolderReturn = {
  status: "default" | "success" | "error";
  returnMessage: string;
  redirectPayload?: string;
};

export type { FolderShapeProps, T_CreateFolderReturn };
