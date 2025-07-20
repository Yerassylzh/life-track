import Input from "@/components/form/Input";
import LongInput from "@/components/form/LongInput";
import PrimaryButton from "@/components/form/PrimaryButton";
import ReminderInput from "@/components/ReminderInput";
import { Habit } from "@/db/schema";
import { ColorPalette } from "@/lib/colors";
import { getFormattedTimeString } from "@/lib/date";
import React, { useCallback, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { HabitFormProvider, useHabitForm } from "../context/HabitFormContext";
import { HabitIconNameType } from "../lib/icons";
import { getNotificationTimeInfo } from "../lib/notifications";
import ColorPicker from "./form/ColorPicker";
import HabitRepeat from "./HabitRepeat";
import IconPicker from "./IconPicker";

export type HabitFormData = {
  title: string;
  description: string;
  unit: string;
  iconName: string;
  colorIndex: number;
  repeatType: "daily" | "weekly" | "monthly";
  daysOfWeek: number[];
  weeklyFreq: number;
  monthlyDays: number[];
  reminder: string | null;
};

type HabitFormProps = {
  habitToEdit?: Habit;
  onSubmit: (data: HabitFormData) => void;
  type: "numeric" | "checkbox";
};

export default function HabitFormWrapper(props: HabitFormProps) {
  return (
    <HabitFormProvider>
      <HabitForm {...props} />
    </HabitFormProvider>
  );
}

function HabitForm({ habitToEdit, onSubmit, type }: HabitFormProps) {
  const {
    description,
    setDescription,
    title,
    setTitle,
    setTitleError,
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
    unit,
    setUnit,
    unitError,
    setUnitError,
    iconName,
    setIconName,
  } = useHabitForm();

  useEffect(() => {
    const fillWithPreviousData = async () => {
      if (!habitToEdit) return;

      setTitle(habitToEdit.name);
      setDescription(habitToEdit.description);
      setColorIndex(ColorPalette.indexOf(habitToEdit.color));
      setRepeatType(habitToEdit.repeatType);
      setDaysOfWeek(JSON.parse(habitToEdit.daysOfWeek) as number[]);
      setMonthlyDays(JSON.parse(habitToEdit.monthlyDays) as number[]);
      setWeeklyFreq(habitToEdit.weeklyFreq);

      if (habitToEdit.reminder) {
        const reminderIds = JSON.parse(habitToEdit.reminder) as string[];
        const [hours, minutes] = await getNotificationTimeInfo(reminderIds[0]);
        setReminder(
          getFormattedTimeString(new Date(2000, 0, 0, hours, minutes))
        );
      }
      setIconName(habitToEdit.iconName as HabitIconNameType);
    };
    fillWithPreviousData();
  }, [
    habitToEdit,
    setColorIndex,
    setDaysOfWeek,
    setDescription,
    setIconName,
    setMonthlyDays,
    setReminder,
    setRepeatType,
    setTitle,
    setWeeklyFreq,
  ]);

  const validateFormData = useCallback(() => {
    if (title.length === 0) {
      setTitleError("Enter habit name");
      return false;
    } else {
      setTitleError(undefined);
    }

    if (type === "numeric" && unit.length === 0) {
      setUnitError("Enter unit");
      return false;
    } else {
      setUnitError(undefined);
    }

    return true;
  }, [title, unit, setUnitError, setTitleError, type]);

  const handlePress = () => {
    if (validateFormData()) {
      onSubmit({
        title,
        description,
        unit,
        iconName,
        colorIndex,
        repeatType,
        daysOfWeek,
        weeklyFreq,
        monthlyDays,
        reminder,
      });
    }
  };

  return (
    <>
      <ScrollView
        className="px-[15px] gap-3"
        bounces={true}
        overScrollMode="always"
        style={{ flex: 1 }}
        contentContainerStyle={{ gap: 10, paddingBottom: 200 }}
      >
        <Input
          onChangeText={setTitle}
          value={title}
          placeholder="Title"
          error={titleError}
        />
        <LongInput
          onChangeText={setDescription}
          value={description}
          placeholder="Description (optional)"
        />
        {type === "numeric" && (
          <Input
            onChangeText={setUnit}
            value={unit}
            placeholder="Unit (e.g: miles, mins)"
            error={unitError}
          />
        )}
        <View className="flex-row gap-3">
          <ColorPicker />
          <IconPicker />
        </View>
        <HabitRepeat />
        <ReminderInput reminder={reminder} setReminder={setReminder} />
      </ScrollView>
      <PrimaryButton
        label="Save"
        className="self-center absolute bottom-4 w-[90%]"
        onPress={handlePress}
      />
    </>
  );
}
