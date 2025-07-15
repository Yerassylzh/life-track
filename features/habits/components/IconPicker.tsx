import InterText from "@/components/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { View } from "react-native";
import { useNewHabit } from "../context/NewHabitContext";
import IconPickerButton from "./IconPickerButton";

export default function IconPicker() {
  const { theme } = usePreferredColorTheme();
  const { iconPickerSheetRef, iconName } = useNewHabit();

  return (
    <View
      className={cn(
        "flex-grow flex flex-row items-center justify-between rounded-2xl p-4",
        theme === "light" ? "bg-white" : "bg-gray-900"
      )}
    >
      <InterText className="text-lg font-semibold">Icon</InterText>
      <IconPickerButton
        iconName={iconName}
        onPress={() => iconPickerSheetRef.current?.expand()}
      />
    </View>
  );
}
