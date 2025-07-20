import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

interface Props extends TouchableOpacityProps {
  backgroundColor: string;
  isSelected?: boolean;
}

export default function ColorButton({
  backgroundColor,
  style,
  isSelected,
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      className="w-10 h-10 rounded-2xl flex items-center justify-center"
      style={[{ backgroundColor }, style]}
      {...rest}
    >
      {isSelected && <MaterialIcons name="done" size={17} color="white" />}
    </TouchableOpacity>
  );
}
