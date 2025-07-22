import { db } from "@/db/db";
import { Note } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import React, { createContext, ReactNode, useContext } from "react";

interface JournalContextValue {
  notes: Note[] | undefined;
}

const JournalContext = createContext<JournalContextValue | undefined>(
  undefined
);

export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const { data: notes } = useLiveQuery(db.query.noteTable.findMany());

  return (
    <JournalContext.Provider value={{ notes }}>
      {children}
    </JournalContext.Provider>
  );
};

export function useJournalContext() {
  const ctx = useContext(JournalContext);
  if (!ctx)
    throw new Error("useJournalContext must be used within a JournalProvider");
  return ctx;
}
