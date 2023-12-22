type T_CRUDReturn = {
  status: "default" | "success" | "error";
  returnMessage: string;
  redirectPayload?: string;
};

export type { T_CRUDReturn };
