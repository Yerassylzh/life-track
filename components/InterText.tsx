import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { Text, TextProps } from "react-native";

export default function InterText({ className, children, ...rest }: TextProps) {
  const { theme } = usePreferredColorTheme();

  return (
    <Text
      className={cn(
        "font-inter",
        theme === "dark" ? "text-white" : "text-black",
        className
      )}
    >
      {children}
    </Text>
  );
}
