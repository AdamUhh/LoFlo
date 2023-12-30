type T_ViewedFlashcardStats = {
  flashcardId: string;
  correct: number;
  incorrect: number;
  skipped: number;
  lastReviewed: string;
  pushed?: boolean;
};

export type { T_ViewedFlashcardStats };
