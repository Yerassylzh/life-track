import { useHabits } from "@/features/habits/context/HabitsContext";
import useHabitSorter from "@/features/habits/hooks/useHabitSorter";
import { dateToYMD, YMDToDate } from "@/lib/date";
import React, { useMemo } from "react";
import { useDate } from "../context/SelectedDateContext";
import HabitBox from "./HabitBox";

type DisplayType =
  | { displayCompleted: boolean }
  | { displayUncompleted: boolean }
  | { displayAll: boolean };

export type HabitsListProps = {
  hasLabel?: boolean;
} & DisplayType;

export default function HabitsList(props: HabitsListProps) {
  const { habits, habitsCompletionsManager } = useHabits();
  const { selectedDate } = useDate();
  const date = useMemo(() => dateToYMD(selectedDate), [selectedDate]);
  const sortFn = useHabitSorter(date);

  const habitsToDisplay = useMemo(() => {
    const filteredHabits = habits.filter((habit) => {
      if (YMDToDate(date) < YMDToDate(dateToYMD(habit.createdAt))) {
        return false;
      }

      if ("displayAll" in props) {
        return true;
      }

      const isCompleted = habitsCompletionsManager
        .get(habit.id)
        ?.isHabitCompletedAt(date);
      const doesNotNeedToComplete = habitsCompletionsManager
        .get(habit.id)
        ?.isHabitDoesntNeedToCompleteAt(date);

      if ("displayCompleted" in props) {
        return props.displayCompleted
          ? isCompleted || doesNotNeedToComplete
          : !isCompleted;
      }
      if ("displayUncompleted" in props) {
        return props.displayUncompleted
          ? !isCompleted && !doesNotNeedToComplete
          : isCompleted;
      }
      return true;
    });

    return filteredHabits.sort(sortFn);
  }, [habits, sortFn, date, props, habitsCompletionsManager]);

  return (
    <>
      {habitsToDisplay.map((habit, index) => (
        <HabitBox
          key={habit.id}
          hasBottomBorder={true}
          habit={habit}
          date={date}
        />
      ))}
    </>
  );
}
