import { ColorPalette } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { useHabitForm } from "../context/HabitFormContext";
import { HabitIconNameType } from "../lib/icons";
import DynamicIcon from "./ui/DynamicIcon";

interface Props extends TouchableOpacityProps {
  iconName: HabitIconNameType;
  isSelected?: boolean;
}

export default function IconPickerButton({
  iconName,
  style,
  isSelected,
  ...rest
}: Props) {
  const { colorIndex } = useHabitForm();

  return (
    <TouchableOpacity
      className={cn(
        "w-10 h-10 rounded-2xl flex items-center justify-center",
        isSelected && "border border-gray-300"
      )}
      style={[{ backgroundColor: ColorPalette[colorIndex] }, style]}
      {...rest}
    >
      <DynamicIcon name={iconName} size={22} color="white" />
    </TouchableOpacity>
  );
}
