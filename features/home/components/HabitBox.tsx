import InterText from "@/components/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Habit } from "@/db/schema";
import DynamicIcon from "@/features/habits/components/DynamicIcon";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { Pressable, View } from "react-native";
import ActivityLabel from "./ActivityLabel";
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
        "flex flex-row items-center justify-between py-3.5",
        hasBottomBorder && "border-b",
        hasBottomBorder &&
          (theme === "light" ? "border-b-gray-200" : "border-b-gray-800")
      )}
    >
      <View className="flex-row gap-4 items-center justify-between">
        <View
          className={cn(
            "w-[40px] h-[40px] bg-gray-100 rounded-xl items-center justify-center",
            theme === "dark" && "bg-gray-900"
          )}
        >
          <DynamicIcon color={habit.color} size={22} name={habit.iconName} />
        </View>
        <View className="flex flex-col justify-between items-start h-[37px]">
          <InterText className={cn("text-md")}>{habit.name}</InterText>
          <ActivityLabel color={habit.color} text={"Habit"} />
        </View>
      </View>
      <CompleteButtom isCompleted={isCompleted} />
    </Pressable>
  );
}
