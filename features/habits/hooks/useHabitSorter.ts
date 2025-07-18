import { HabitWithCompletions } from "@/db/types";
import { useCallback } from "react";
import { useHabits } from "../context/HabitsContext";

export default function useHabitSorter(date: string) {
  const { habitsCompletionsManager } = useHabits();
  const fn = useCallback(
    (a: HabitWithCompletions, b: HabitWithCompletions) => {
      const aCompleted =
        habitsCompletionsManager.get(a.id)?.isHabitCompletedAt(date) ||
        habitsCompletionsManager.get(a.id)?.isHabitDoesntNeedToCompleteAt(date);
      const bCompleted =
        habitsCompletionsManager.get(b.id)?.isHabitCompletedAt(date) ||
        habitsCompletionsManager.get(b.id)?.isHabitDoesntNeedToCompleteAt(date);
      return (aCompleted ? 1 : 0) - (bCompleted ? 1 : 0);
    },
    [date, habitsCompletionsManager]
  );
  return fn;
}
