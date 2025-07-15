import { useHabits } from "@/context/HabitContext";
import { HabitWithCompletions } from "@/db/types";
import { markHabitAsUncompleted } from "@/features/habits/lib/update";
import { dateToYMD, YMDToDate } from "@/lib/date";
import React, { useCallback } from "react";
import HabitBox from "./HabitBox";

type Props = {
  date: string;
};

export default function CompletedHabits({ date }: Props) {
  const { habits, habitsCompletionsManager } = useHabits();

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
