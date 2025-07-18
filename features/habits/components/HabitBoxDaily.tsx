import CompleteButton from "@/components/CompleteButton";
import InterText from "@/components/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import UnitValueInputModal from "@/features/habits/components/UnitValueInputModal";
import { Colors } from "@/lib/colors";
import { hexToRgba } from "@/lib/hex";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import useHabitActions from "../hooks/useHabitActions";
import DynamicIcon from "./DynamicIcon";
import HabitActionsModal from "./HabitActionsModal";

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
    habitActionRef,
    unitInputRef,
    getCompletionUnitValue,
  } = useHabitActions(habit, date);

  return (
    <Animated.View
      layout={LinearTransition}
      style={{ backgroundColor: hexToRgba(habit.color, 0.2) }}
      className={"rounded-xl flex flex-row items-center justify-between"}
    >
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
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
          {habit.unit !== null && (isCompleted || doesNotNeedToComplete) && (
            <InterText className="text-base text-gray-500">
              {getCompletionUnitValue() + " " + habit.unit}
            </InterText>
          )}
        </View>
        <CompleteButton
          isCompleted={isCompleted}
          doesNotNeedToComplete={doesNotNeedToComplete}
          tickColor={habit.color}
          bgColorUncompleted={hexToRgba(Colors["gray-100"], 0.5)}
          bgColorCompleted={hexToRgba(habit.color, 0.2)}
        />
      </TouchableOpacity>
      <UnitValueInputModal unitInputRef={unitInputRef} habit={habit} />
      <HabitActionsModal habit={habit} ref={habitActionRef} />
    </Animated.View>
  );
}
