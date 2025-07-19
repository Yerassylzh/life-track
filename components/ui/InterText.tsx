import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { Text, TextProps } from "react-native";

type Props = {
  customColor?: string;
} & TextProps;

export default function InterText({
  customColor,
  className,
  style,
  children,
  ...rest
}: Props) {
  const { theme } = usePreferredColorTheme();

  return (
    <Text
      className={cn(
        "font-inter",
        !customColor && (theme === "dark" ? "text-white" : "text-black"),
        className
      )}
      style={[customColor ? { color: customColor } : {}, style]}
    >
      {children}
    </Text>
  );
}
