import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

export default function Add({ className, ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      {...rest}
      className={cn(
        "absolute bottom-2 right-2 bg-primary w-[53px] h-[53px] items-center justify-center rounded-xl shadow-xl",
        className
      )}
    >
      <Text className="font-inter font-bold text-3xl text-white">+</Text>
      {/* <AntDesign name="plus" size={20} color="white" /> */}
    </TouchableOpacity>
  );
}
