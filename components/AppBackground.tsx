import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { View, ViewProps } from "react-native";

export default function AppBackground({
  children,
  className,
  ...rest
}: ViewProps) {
  const { theme } = usePreferredColorTheme();

  return (
    <View
      className={cn(
        "flex-1",
        theme === "light" ? "bg-gray-50" : "bg-gray-950",
        className
      )}
      {...rest}
    >
      {children}
    </View>
  );
}
