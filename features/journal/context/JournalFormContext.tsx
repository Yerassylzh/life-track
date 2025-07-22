import React, { createContext, useContext, useState } from "react";
import { noteColors } from "../lib/colors";

export type JournalFormContextType = {
  id?: string;
  title: string;
  setTitle: (t: string) => void;
  plainContent: string;
  setPlainContent: (c: string) => void;
  richContent: string;
  setRichContent: (c: string) => void;
  images: string[];
  setImages: (imgs: string[]) => void;
  color: string;
  setColor: (color: string) => void;
  date: Date;
  setDate: (date: Date) => void;
};

const JournalFormContext = createContext<JournalFormContextType | undefined>(
  undefined
);

export function useJournalFormContext() {
  const ctx = useContext(JournalFormContext);
  if (!ctx)
    throw new Error(
      "useJournalFormContext must be used within JournalFormProvider"
    );
  return ctx;
}

export const JournalFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [id] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [plainContent, setPlainContent] = useState("");
  const [richContent, setRichContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [color, setColor] = useState(noteColors[0]);
  const [date, setDate] = useState<Date>(new Date());

  return (
    <JournalFormContext.Provider
      value={{
        id,
        title,
        setTitle,
        plainContent,
        setPlainContent,
        richContent,
        setRichContent,
        images,
        setImages,
        color,
        setColor,
        date,
        setDate,
      }}
    >
      {children}
    </JournalFormContext.Provider>
  );
};
