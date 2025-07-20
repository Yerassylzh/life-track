import CompleteButton from "@/components/ui/CompleteButton";
import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import DynamicIcon from "@/features/habits/components/ui/DynamicIcon";
import { useHabitActions } from "@/features/habits/context/HabitActionsContext";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import ActivityLabel from "../../../components/ui/ActivityLabel";

type Props = {
  hasBottomBorder: boolean;
  habit: HabitWithCompletions;
  date: string;
};

export default function HabitBox({ hasBottomBorder, habit, date }: Props) {
  const { theme } = usePreferredColorTheme();
  const {
    onPress,
    onLongPress,
    isCompleted,
    doesNotNeedToComplete,
    getCompletionUnitValue,
  } = useHabitActions();

  return (
    <Animated.View layout={LinearTransition}>
      <TouchableOpacity
        onPress={() => onPress(habit, date)}
        onLongPress={() => onLongPress(habit)}
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
                (isCompleted(habit, date) ||
                  doesNotNeedToComplete(habit, date)) && (
                  <InterText className="text-base text-gray-500">
                    {getCompletionUnitValue(habit, date) + " " + habit.unit}
                  </InterText>
                )}
            </View>
            <ActivityLabel color={habit.color} text={"Habit"} />
          </View>
        </View>
        <CompleteButton
          isCompleted={isCompleted(habit, date)}
          doesNotNeedToComplete={doesNotNeedToComplete(habit, date)}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}
