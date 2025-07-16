import { dateToYMD } from "@/lib/date";
import React, { useState } from "react";

type NewTaskContextType = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  titleError: string | undefined;
  setTitleError: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  reminder: string | null;
  setReminder: React.Dispatch<React.SetStateAction<string | null>>;
};

const NewTaskContext = React.createContext<NewTaskContextType | undefined>(
  undefined
);

export const NewTaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [title, setTitle] = React.useState("");
  const [titleError, setTitleError] = React.useState<string | undefined>(
    undefined
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    dateToYMD(new Date())
  );
  const [reminder, setReminder] = React.useState<string | null>("08:00");
  const data = {
    title,
    setTitle,
    titleError,
    setTitleError,
    selectedDate,
    setSelectedDate,
    reminder,
    setReminder,
  };

  return (
    <NewTaskContext.Provider value={data}>{children}</NewTaskContext.Provider>
  );
};

export const useNewTask = () => {
  const context = React.useContext(NewTaskContext);
  if (!context) {
    throw new Error("useNewTask must be used within a NewTaskProvider");
  }
  return context;
};
