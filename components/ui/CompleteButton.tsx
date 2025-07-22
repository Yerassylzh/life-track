import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import { hexToRgba } from "@/lib/hex";
import { cn } from "@/lib/tailwindClasses";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useMemo } from "react";
import { View } from "react-native";

type Props = {
  tickColor?: string;
  bgColorUncompleted?: string;
  bgColorCompleted?: string;
  isCompleted?: boolean;
  doesNotNeedToComplete?: boolean;
};

export default function CompleteButton({
  isCompleted,
  doesNotNeedToComplete,
  bgColorUncompleted,
  bgColorCompleted,
  tickColor,
}: Props) {
  const { theme } = usePreferredColorTheme();

  const backgroundColor = useMemo(() => {
    return isCompleted || doesNotNeedToComplete
      ? bgColorCompleted
        ? bgColorCompleted
        : theme === "dark"
          ? Colors["green-800"]
          : Colors["green-200"]
      : bgColorUncompleted
        ? bgColorUncompleted
        : theme === "light"
          ? Colors["gray-100"]
          : Colors["gray-900"];
  }, [
    bgColorCompleted,
    bgColorUncompleted,
    doesNotNeedToComplete,
    isCompleted,
    theme,
  ]);

  const checkColor = useMemo(() => {
    if (doesNotNeedToComplete) {
      return tickColor
        ? hexToRgba(tickColor, 0.5)
        : theme === "dark"
          ? Colors["green-300"]
          : Colors["green-700"];
    }

    return tickColor
      ? tickColor
      : theme === "dark"
        ? Colors["green-300"]
        : Colors["green-700"];
  }, [doesNotNeedToComplete, theme, tickColor]);

  return (
    <View
      style={{
        backgroundColor,
        opacity: doesNotNeedToComplete ? 0.7 : 1,
      }}
      className={cn(
        "w-[27px] h-[27px]",
        "rounded-full",
        "items-center justify-center"
      )}
    >
      {(isCompleted || doesNotNeedToComplete) && (
        <MaterialIcons name="done" size={17} color={checkColor} />
      )}
    </View>
  );
}
