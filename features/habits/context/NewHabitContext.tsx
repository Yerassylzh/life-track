import BottomSHeetGorhom from "@gorhom/bottom-sheet";
import React, { useRef } from "react";

type NewHabitContextType = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  colorIndex: number;
  setColorIndex: React.Dispatch<React.SetStateAction<number>>;
  repeatType: "daily" | "weekly" | "monthly";
  setRepeatType: React.Dispatch<
    React.SetStateAction<"daily" | "weekly" | "monthly">
  >;
  daysOfWeek: number[];
  setDaysOfWeek: React.Dispatch<React.SetStateAction<number[]>>;
  weeklyFreq: number;
  setWeeklyFreq: React.Dispatch<React.SetStateAction<number>>;
  monthlyDays: number[];
  setMonthlyDays: React.Dispatch<React.SetStateAction<number[]>>;
  colorPickerSheetRef: React.RefObject<BottomSHeetGorhom | null>;
  reminder: string | null;
  setReminder: React.Dispatch<React.SetStateAction<string | null>>;
  titleError: string | undefined;
  setTitleError: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const NewHabitContext = React.createContext<NewHabitContextType | undefined>(
  undefined
);

export const NewHabitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [title, setTitle] = React.useState("");
  const [titleError, setTitleError] = React.useState<string | undefined>(
    undefined
  );
  const [description, setDescription] = React.useState("");
  // const [descriptionError, setDescriptionError] = React.useState<string | null>(
  //   null
  // ); >>> Desctiption is optional
  const [colorIndex, setColorIndex] = React.useState(0);
  const [repeatType, setRepeatType] = React.useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [daysOfWeek, setDaysOfWeek] = React.useState<number[]>([
    0, 1, 2, 3, 4, 5, 6,
  ]);
  const [weeklyFreq, setWeeklyFreq] = React.useState<number>(3);
  const [monthlyDays, setMonthlyDays] = React.useState<number[]>([1]);
  const colorPickerSheetRef = useRef<BottomSHeetGorhom>(null);

  const [reminder, setReminder] = React.useState<string | null>("08:00");

  const data = {
    title,
    setTitle,
    description,
    setDescription,
    colorIndex,
    setColorIndex,
    repeatType,
    setRepeatType,
    daysOfWeek,
    setDaysOfWeek,
    weeklyFreq,
    setWeeklyFreq,
    monthlyDays,
    setMonthlyDays,
    colorPickerSheetRef,
    reminder,
    setReminder,
    titleError,
    setTitleError,
  };

  return (
    <NewHabitContext.Provider value={data}>{children}</NewHabitContext.Provider>
  );
};

export const useNewHabit = () => {
  const context = React.useContext(NewHabitContext);
  if (!context) {
    throw new Error("useNewHabit must be used within a NewHabitProvider");
  }
  return context;
};
