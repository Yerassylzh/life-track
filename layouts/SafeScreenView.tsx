import { useScreenInsetsColor } from "@/context/ScreenInsetsColorContext";
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
  const { insetColor } = useScreenInsetsColor();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: insetColor,
      }}
      className={cn("flex-1")}
    >
      {children}
    </View>
  );
}
