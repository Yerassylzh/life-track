import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import InterText from "../ui/InterText";

interface Props extends TouchableOpacityProps {
  label: string;
}

export default function PrimaryButton({ label, className, ...rest }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      {...rest}
      className={cn(
        "bg-primary items-center justify-center w-full rounded-xl py-3",
        className
      )}
    >
      <InterText className="text-lg text-white">{label}</InterText>
    </TouchableOpacity>
  );
}
