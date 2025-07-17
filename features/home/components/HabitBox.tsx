import CompleteButton from "@/components/CompleteButton";
import InterText from "@/components/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import DynamicIcon from "@/features/habits/components/DynamicIcon";
import { addDaystoDate, YMDToDate } from "@/lib/date";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import ActivityLabel from "../../../components/ActivityLabel";

type Props = {
  hasBottomBorder: boolean;
  habit: HabitWithCompletions;
  isCompleted: boolean;
  onPress: () => void;
  date: string;
};

export default function HabitBox({
  hasBottomBorder,
  habit,
  isCompleted,
  onPress,
  date,
}: Props) {
  const { theme } = usePreferredColorTheme();

  return (
    <TouchableOpacity
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
          <View className="flex-1 flex-row gap-2">
            <InterText className={cn("text-base")}>{habit.name}</InterText>
            {habit.unit !== null &&
              (() => {
                const completion = habit.completions.filter(
                  (completion) =>
                    YMDToDate(date) <= completion.completedAt &&
                    completion.completedAt < addDaystoDate(YMDToDate(date), 1)
                )[0];
                if (completion === undefined) {
                  return null;
                }
                return (
                  <InterText className="text-base text-gray-500">
                    {completion.unitValue + " " + habit.unit}
                  </InterText>
                );
              })()}
          </View>
          <ActivityLabel color={habit.color} text={"Habit"} />
        </View>
      </View>
      <CompleteButton isCompleted={isCompleted} />
    </TouchableOpacity>
  );
}
