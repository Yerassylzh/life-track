import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { HabitIconNameType } from "../lib/icons";
import {
  ColorPickerBottomSheet,
  IconPickerBottomSheet,
} from "./HabitFormContext.components";

type HabitFormContextType = {
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
  reminder: string | null;
  setReminder: React.Dispatch<React.SetStateAction<string | null>>;
  titleError: string | undefined;
  setTitleError: React.Dispatch<React.SetStateAction<string | undefined>>;
  iconName: HabitIconNameType;
  setIconName: React.Dispatch<React.SetStateAction<HabitIconNameType>>;
  openIconPickerSheet: () => void;
  openColorPickerSheet: () => void;
  unit: string;
  setUnit: React.Dispatch<React.SetStateAction<string>>;
  unitError: string | undefined;
  setUnitError: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const HabitFormContext = React.createContext<HabitFormContextType | undefined>(
  undefined
);

export const HabitFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [title, setTitle] = React.useState("");
  const [titleError, setTitleError] = React.useState<string | undefined>(
    undefined
  );
  const [description, setDescription] = React.useState("");
  const [colorIndex, setColorIndex] = React.useState(0);
  const [repeatType, setRepeatType] = React.useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [daysOfWeek, setDaysOfWeek] = React.useState<number[]>([
    0, 1, 2, 3, 4, 5, 6,
  ]);
  const [weeklyFreq, setWeeklyFreq] = React.useState<number>(3);
  const [monthlyDays, setMonthlyDays] = React.useState<number[]>([1]);

  const [reminder, setReminder] = React.useState<string | null>("08:00");

  const [iconName, setIconName] = React.useState<HabitIconNameType>("Album");

  const [unit, setUnit] = useState<string>("");
  const [unitError, setUnitError] = useState<string | undefined>("");

  const openIconPickerSheet = useCallback(() => {
    iconPickerSheetRef.current?.present();
  }, []);

  const openColorPickerSheet = useCallback(() => {
    colorPickerSheetRef.current?.present();
  }, []);

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
    reminder,
    setReminder,
    titleError,
    setTitleError,
    iconName,
    setIconName,
    unit,
    setUnit,
    unitError,
    setUnitError,
    openIconPickerSheet,
    openColorPickerSheet,
  };

  const colorPickerSheetRef = useRef<BottomSheetModal>(null);
  const iconPickerSheetRef = useRef<BottomSheetModal>(null);

  return (
    <HabitFormContext.Provider value={data}>
      {children}
      <ColorPickerBottomSheet ref={colorPickerSheetRef} />
      <IconPickerBottomSheet ref={iconPickerSheetRef} />
    </HabitFormContext.Provider>
  );
};

export const useHabitForm = () => {
  const context = React.useContext(HabitFormContext);
  if (!context) {
    throw new Error("useHabitForm must be used within a HabitFormProvider");
  }
  return context;
};
