import CompleteButton from "@/components/ui/CompleteButton";
import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import { useSettingsContext } from "@/features/settings/context/SettingsContext";
import { Colors } from "@/lib/colors";
import { addDaystoDate, dateToYMD } from "@/lib/date";
import { hexToRgba } from "@/lib/hex";
import { cn } from "@/lib/tailwindClasses";
import { useMappingHelper } from "@shopify/flash-list";
import React, { useMemo } from "react";
import { Pressable, TouchableOpacity, Vibration, View } from "react-native";
import { useHabitActions } from "../context/HabitActionsContext";
import DynamicIcon from "./ui/DynamicIcon";

type Props = {
  habit: HabitWithCompletions;
};

export default function HabitBoxWeekly({ habit }: Props) {
  const { theme } = usePreferredColorTheme();
  const { firstDayOfWeek } = useSettingsContext();

  const currentWeekDates = useMemo(() => {
    const startDay = new Date();
    const checkIsStart = (date: Date) => {
      if (firstDayOfWeek === "Monday") {
        return date.getDay() === 1;
      }
      return date.getDay() === 0;
    };
    while (!checkIsStart(startDay)) {
      startDay.setDate(startDay.getDate() - 1);
    }
    const dates = [];

    for (let i = 0; i < 7; i++) {
      dates.push(addDaystoDate(startDay, i));
    }
    return dates;
  }, [firstDayOfWeek]);

  const dayLabels = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    if (firstDayOfWeek === "Monday") {
      return days;
    }
    return [days.pop() as string, ...days];
  }, [firstDayOfWeek]);

  const frequencyText = useMemo(() => {
    if (habit.repeatType === "daily") {
      const daysOfWeek: number[] = JSON.parse(habit.daysOfWeek);
      const dayNames = ["M", "T", "W", "T", "F", "S", "S"];
      if (daysOfWeek.length === 7) {
        return "Every day";
      }
      return daysOfWeek.map((day) => dayNames[day]).join(", ");
    } else if (habit.repeatType === "weekly") {
      return `${habit.weeklyFreq} times a week`;
    } else if (habit.repeatType === "monthly") {
      const monthlyDays: number[] = JSON.parse(habit.monthlyDays);
      if (monthlyDays.length === 1) {
        return `${monthlyDays[0]} day of month`;
      }
      if (monthlyDays.length > 7) {
        return `${monthlyDays.slice(0, 7).join(", ")}.. days of month`;
      }
      return `${monthlyDays.join(", ")} days of month`;
    }
    return "";
  }, [habit]);

  const {
    onPress,
    onLongPress,
    isCompleted,
    doesNotNeedToComplete,
    getCompletionUnitValue,
  } = useHabitActions();

  const { getMappingKey } = useMappingHelper();

  return (
    <TouchableOpacity
      style={{ backgroundColor: hexToRgba(habit.color, 0.2) }}
      className="rounded-xl p-4"
      onLongPress={() => onLongPress(habit)}
      onPress={async () => await onPress(habit, dateToYMD(new Date()))}
    >
      {/* Header */}
      <View className="flex flex-row items-center justify-between mb-4">
        <View className="flex flex-row items-center gap-2">
          <View
            style={{
              backgroundColor:
                theme === "dark"
                  ? hexToRgba(Colors["gray-800"], 0.3)
                  : hexToRgba(Colors["gray-100"], 0.3),
            }}
            className="p-2 rounded-lg"
          >
            <DynamicIcon name={habit.iconName} color={habit.color} />
          </View>
          <InterText className="text-base font-medium">{habit.name}</InterText>
        </View>
        <InterText className="text-sm text-gray-500">{frequencyText}</InterText>
      </View>

      <View className="flex flex-row justify-between">
        {currentWeekDates.map((date, index) => {
          const unitValue = getCompletionUnitValue(habit, dateToYMD(date));
          const dateStr = dateToYMD(date);

          return (
            <DayItem
              key={getMappingKey(dateStr, index)}
              date={date}
              dayLabel={dayLabels[index]}
              habit={habit}
              isCompleted={isCompleted(habit, dateStr)}
              doesNotNeedToComplete={doesNotNeedToComplete(habit, dateStr)}
              unitValue={unitValue}
            />
          );
        })}
      </View>
    </TouchableOpacity>
  );
}

type DayItemProps = {
  date: Date;
  dayLabel: string;
  habit: HabitWithCompletions;
  isCompleted: boolean;
  doesNotNeedToComplete: boolean;
  unitValue: number;
};

function DayItem({
  date,
  dayLabel,
  habit,
  isCompleted,
  doesNotNeedToComplete,
  unitValue,
}: DayItemProps) {
  const dateStr = dateToYMD(date);
  const { onPress, onLongPress } = useHabitActions();

  const isToday = dateToYMD(new Date()) === dateStr;

  return (
    <View
      className="flex flex-col items-center py-2 px-1.5 rounded-full"
      style={{
        backgroundColor: isToday ? hexToRgba(habit.color, 0.1) : "transparent",
      }}
    >
      <InterText className="text-xs text-gray-500 mb-2">{dayLabel}</InterText>
      <Pressable
        onPress={() => {
          if (isToday) {
            Vibration.vibrate(30);
            onPress(habit, dateToYMD(date));
          }
        }}
        onLongPress={() => {
          if (isToday) {
            onLongPress(habit);
          }
        }}
        className="flex flex-col items-center"
      >
        {habit.unit !== null ? (
          <View
            className={cn(
              "w-[27px] h-[27px] rounded-full items-center justify-center p-0.5",
              isCompleted && "opacity-100",
              doesNotNeedToComplete && !isCompleted && "opacity-70",
              !isCompleted && !doesNotNeedToComplete && "opacity-50"
            )}
          >
            <InterText
              className={cn(
                "text-xs font-medium",
                isCompleted ? "text-green-600" : "text-gray-600"
              )}
            >
              {isCompleted || doesNotNeedToComplete ? unitValue : "0"}
            </InterText>
            <InterText className="text-[7px] text-gray-400">
              {habit.unit}
            </InterText>
          </View>
        ) : (
          // Show completion button for habits without units
          <View className="rounded-full p-0.5">
            <CompleteButton
              isCompleted={isCompleted}
              doesNotNeedToComplete={doesNotNeedToComplete}
              tickColor={habit.color}
              bgColorUncompleted={hexToRgba(Colors["gray-100"], 0.4)}
              bgColorCompleted={hexToRgba(habit.color, 0.2)}
            />
          </View>
        )}
      </Pressable>
    </View>
  );
}
