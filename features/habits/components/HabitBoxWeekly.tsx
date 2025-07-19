import CompleteButton from "@/components/CompleteButton";
import InterText from "@/components/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import { Colors } from "@/lib/colors";
import { addDaystoDate, dateToYMD, getMondayBasedWeekday } from "@/lib/date";
import { hexToRgba } from "@/lib/hex";
import { cn } from "@/lib/tailwindClasses";
import React, { useCallback, useMemo } from "react";
import { Pressable, TouchableOpacity, Vibration, View } from "react-native";
import { useHabits } from "../context/HabitsContext";
import useHabitActions from "../hooks/useHabitActions";
import DynamicIcon from "./DynamicIcon";
import HabitActionsModal from "./HabitActionsModal";
import UnitValueInputModal from "./UnitValueInputModal";

type Props = {
  habit: HabitWithCompletions;
};

// At the top of your file, outside any component
const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = getMondayBasedWeekday(today.getDay());
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = addDaystoDate(today, mondayOffset);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    dates.push(addDaystoDate(monday, i));
  }
  return dates;
};

const CURRENT_WEEK_DATES = getCurrentWeekDates();

export default function HabitBoxWeekly({ habit }: Props) {
  const { theme } = usePreferredColorTheme();
  const { habitsCompletionsManager } = useHabits();

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

  // Get completion status for each day
  const getCompletionStatus = useCallback(
    (date: Date) => {
      const dateStr = dateToYMD(date);
      const completionsManager = habitsCompletionsManager.get(habit.id);

      const isCompleted =
        completionsManager?.isHabitCompletedAt(dateStr) || false;
      const doesNotNeedToComplete =
        completionsManager?.isHabitDoesntNeedToCompleteAt(dateStr) || false;

      return { isCompleted, doesNotNeedToComplete };
    },
    [habit.id, habitsCompletionsManager]
  );

  const getUnitValue = useCallback(
    (date: Date) => {
      const dateStr = dateToYMD(date);
      const completion = habit.completions.find(
        (completion) => dateStr === dateToYMD(completion.completedAt)
      );
      return completion?.unitValue || 0;
    },
    [habit.completions]
  );

  const { unitInputRef, habitActionRef, onPress, onLongPress } =
    useHabitActions(habit, dateToYMD(new Date()));

  return (
    <TouchableOpacity
      style={{ backgroundColor: hexToRgba(habit.color, 0.2) }}
      className="rounded-xl p-4"
      onLongPress={onLongPress}
      onPress={onPress}
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
        {CURRENT_WEEK_DATES.map((date, index) => {
          const { isCompleted, doesNotNeedToComplete } =
            getCompletionStatus(date);
          const unitValue = getUnitValue(date);
          const dateStr = dateToYMD(date);

          return (
            <DayItem
              key={dateStr}
              date={date}
              dayLabel={dayLabels[index]}
              habit={habit}
              isCompleted={isCompleted}
              doesNotNeedToComplete={doesNotNeedToComplete}
              unitValue={unitValue}
            />
          );
        })}
      </View>
      <UnitValueInputModal unitInputRef={unitInputRef} habit={habit} />
      <HabitActionsModal habit={habit} ref={habitActionRef} />
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
  const { onPress, onLongPress, unitInputRef, habitActionRef } =
    useHabitActions(habit, dateStr);

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
            onPress();
          }
        }}
        onLongPress={() => {
          if (isToday) {
            onLongPress();
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
            <InterText className="text-[9px] text-gray-400">
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

      <UnitValueInputModal unitInputRef={unitInputRef} habit={habit} />
      <HabitActionsModal habit={habit} ref={habitActionRef} />
    </View>
  );
}
