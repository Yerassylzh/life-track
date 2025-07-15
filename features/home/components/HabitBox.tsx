import InterText from "@/components/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Habit } from "@/db/schema";
import { hexToRgba } from "@/lib/hex";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { Pressable, View } from "react-native";
import CompleteButtom from "./CompleteButtom";

type Props = {
  hasBottomBorder: boolean;
  habit: Habit;
  isCompleted: boolean;
  onPress: () => void;
};

export default function HabitBox({
  hasBottomBorder,
  habit,
  isCompleted,
  onPress,
}: Props) {
  const { theme } = usePreferredColorTheme();

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex flex-row items-center justify-between py-3",
        hasBottomBorder && "border-b",
        hasBottomBorder &&
          (theme === "light" ? "border-b-gray-200" : "border-b-gray-800")
      )}
    >
      <View className="flex-row gap-4 items-center justify-between">
        <View className="w-[40px] h-[40px] bg-gray-100 rounded-xl" />
        <View className="flex flex-col justify-between items-start h-[37px]">
          <InterText className={cn(`text-[${habit.color}]`, "text-md")}>
            {habit.name}
          </InterText>
          <HabitLabel color={habit.color} />
        </View>
      </View>
      <CompleteButtom isCompleted={isCompleted} />
    </Pressable>
  );
}

function HabitLabel({ color }: { color: string }) {
  return (
    <View
      style={{ backgroundColor: hexToRgba(color, 0.15) }}
      className={cn("py-[1px] px-1 rounded-md")}
    >
      <InterText className={cn("text-xs")} customColor={hexToRgba(color)}>
        Habit
      </InterText>
    </View>
  );
}
