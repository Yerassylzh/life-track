import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { View } from "react-native";

type Props = {
  isCompleted?: boolean;
};

export default function CompleteButtom({ isCompleted }: Props) {
  const { theme } = usePreferredColorTheme();

  return (
    <View
      className={cn(
        "w-[27px] h-[27px]",
        "rounded-full bg-gray-100",
        theme === "dark" && "bg-gray-900",
        isCompleted && (theme === "dark" ? "bg-green-800" : "bg-green-200"),
        "items-center justify-center"
      )}
    >
      {isCompleted && (
        <MaterialIcons
          name="done"
          size={17}
          color={theme === "dark" ? Colors["green-300"] : Colors["green-700"]}
        />
      )}
    </View>
  );
}
