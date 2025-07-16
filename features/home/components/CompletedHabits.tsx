import { HabitWithCompletions } from "@/db/types";
import { useHabits } from "@/features/habits/context/HabitsContext";
import { markHabitAsUncompleted } from "@/features/habits/lib/update";
import { dateToYMD, YMDToDate } from "@/lib/date";
import React, { useCallback, useMemo } from "react";
import { useDate } from "../context/SelectedDateContext";
import HabitBox from "./HabitBox";

export default function CompletedHabits() {
  const { habits, habitsCompletionsManager } = useHabits();
  const { selectedDate } = useDate();
  const date = useMemo(() => dateToYMD(selectedDate), [selectedDate]);

  const filterFunc = useCallback(
    (habit: HabitWithCompletions) => {
      if (YMDToDate(date) < YMDToDate(dateToYMD(habit.createdAt))) {
        return false;
      }
      return (
        habitsCompletionsManager.get(habit.id)?.isHabitCompletedAt(date) ||
        habitsCompletionsManager
          .get(habit.id)
          ?.isHabitDoesntNeedToCompleteAt(date)
      );
    },
    [habitsCompletionsManager, date]
  );

  return habits.filter(filterFunc).map((habit, index) => (
    <HabitBox
      key={index}
      hasBottomBorder={true}
      isCompleted={true}
      date={dateToYMD(selectedDate)}
      habit={habit}
      onPress={async () => {
        if (date !== dateToYMD(new Date())) {
          return;
        }
        if (
          habitsCompletionsManager
            .get(habit.id)
            ?.isHabitDoesntNeedToCompleteAt(date)
        ) {
          return; // If it was completed by default
        }
        await markHabitAsUncompleted(habit.id, date);
      }}
    />
  ));
}
