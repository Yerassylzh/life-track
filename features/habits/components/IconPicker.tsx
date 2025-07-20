import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { View } from "react-native";
import { useHabitForm } from "../context/HabitFormContext";
import IconPickerButton from "./IconPickerButton";

export default function IconPicker() {
  const { theme } = usePreferredColorTheme();
  const { iconName, openIconPickerSheet } = useHabitForm();

  return (
    <View
      className={cn(
        "flex-grow flex flex-row items-center justify-between rounded-2xl p-4",
        theme === "light" ? "bg-white" : "bg-gray-900"
      )}
    >
      <InterText className="text-lg font-semibold">Icon</InterText>
      <IconPickerButton iconName={iconName} onPress={openIconPickerSheet} />
    </View>
  );
}
