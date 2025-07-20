import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { ColorPalette } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { View } from "react-native";
import { useHabitForm } from "../../context/HabitFormContext";
import ColorButton from "./ColorButton";

export default function ColorPicker() {
  const { theme } = usePreferredColorTheme();
  const { colorIndex, openColorPickerSheet } = useHabitForm();

  return (
    <View
      className={cn(
        "flex-grow flex flex-row items-center justify-between rounded-2xl p-4",
        theme === "light" ? "bg-white" : "bg-gray-900"
      )}
    >
      <InterText className="text-lg font-semibold">Color</InterText>
      <ColorButton
        backgroundColor={ColorPalette[colorIndex]}
        onPress={openColorPickerSheet}
      />
    </View>
  );
}
