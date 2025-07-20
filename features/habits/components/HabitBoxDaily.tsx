import CompleteButton from "@/components/ui/CompleteButton";
import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import { Colors } from "@/lib/colors";
import { hexToRgba } from "@/lib/hex";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useHabitActions } from "../context/HabitActionsContext";
import DynamicIcon from "./ui/DynamicIcon";

type Props = {
  habit: HabitWithCompletions;
  date: string;
};

export default function HabitBoxDaily({ habit, date }: Props) {
  const { theme } = usePreferredColorTheme();
  const {
    isCompleted,
    doesNotNeedToComplete,
    onPress,
    onLongPress,
    getCompletionUnitValue,
  } = useHabitActions();

  return (
    <Animated.View
      layout={LinearTransition}
      style={{ backgroundColor: hexToRgba(habit.color, 0.2) }}
      className={"rounded-xl flex flex-row items-center justify-between"}
    >
      <TouchableOpacity
        onPress={async () => await onPress(habit, date)}
        onLongPress={() => onLongPress(habit)}
        className={cn(
          "flex flex-row items-center justify-between py-3.5 px-3.5 flex-1"
        )}
      >
        <View className="flex flex-row items-center justify-start gap-2">
          <View
            style={{
              backgroundColor:
                theme === "dark"
                  ? hexToRgba(Colors["gray-800"], 0.3)
                  : hexToRgba(Colors["gray-100"], 0.3),
            }}
            className={cn("p-2 rounded-lg")}
          >
            <DynamicIcon name={habit.iconName} color={habit.color} />
          </View>
          <InterText>{habit.name}</InterText>
          {habit.unit !== null &&
            (isCompleted(habit, date) ||
              doesNotNeedToComplete(habit, date)) && (
              <InterText className="text-base text-gray-500">
                {getCompletionUnitValue(habit, date) + " " + habit.unit}
              </InterText>
            )}
        </View>
        <CompleteButton
          isCompleted={isCompleted(habit, date)}
          doesNotNeedToComplete={doesNotNeedToComplete(habit, date)}
          tickColor={habit.color}
          bgColorUncompleted={hexToRgba(Colors["gray-100"], 0.4)}
          bgColorCompleted={hexToRgba(habit.color, 0.2)}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}
