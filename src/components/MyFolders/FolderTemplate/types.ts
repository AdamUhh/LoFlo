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

type AddFolderTemplateProps =
  | {
      subfolder: true;
      parentId: string;
    }
  | {
      subfolder: false;
      parentId?: string;
    };

export type { FolderShapeProps, AddFolderTemplateProps, T_CreateFolderReturn };
