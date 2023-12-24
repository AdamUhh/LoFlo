"use client"

import { ReactNode, createContext, useContext, useState } from "react";

type T_Queue = {
  folders: string;
};

const initialState = { folders: "" };

const QueueContext = createContext<T_Queue>(initialState);

export function QueueProvider({ children }: { children: ReactNode }) {
  let [queue, setQueue] = useState<T_Queue>(initialState);

  return <QueueContext.Provider value={queue}>{children}</QueueContext.Provider>;
}

export function useQueueContext() {
  return useContext(QueueContext);
}
