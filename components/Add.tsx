import { cn } from "@/lib/tailwindClasses";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

export default function Add({ className, ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      {...rest}
      className={cn(
        "absolute bottom-2 right-2 bg-primary p-5 rounded-xl shadow-xl",
        className
      )}
    >
      <AntDesign name="plus" size={20} color="white" />
    </TouchableOpacity>
  );
}
