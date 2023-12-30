type T_CRUDReturn<T = any> = {
  payload?: T;
  status: "default" | "success" | "error";
  returnMessage: string;
  redirectPayload?: string;
};

type T_FinishPracticeCRUDPayload = {
  correct: number;
  incorrect: number;
  skipped: number;
};

export type { T_CRUDReturn, T_FinishPracticeCRUDPayload };
