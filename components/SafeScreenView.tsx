import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeScreenView({
  children,
}: {
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { theme } = usePreferredColorTheme();

  return (
    <View
      style={{ paddingTop: insets.top }}
      className={cn("flex-1", theme === "light" ? "bg-gray-50" : "bg-gray-950")}
    >
      {children}
    </View>
  );
}
