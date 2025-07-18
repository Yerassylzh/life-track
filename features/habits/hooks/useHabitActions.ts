import { HabitWithCompletions } from "@/db/types";
import { dateToYMD } from "@/lib/date";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";
import { Vibration } from "react-native";
import { useHabits } from "../context/HabitsContext";
import { markHabitAsCompleted, markHabitAsUncompleted } from "../lib/update";

export default function useHabitActions(
  habit: HabitWithCompletions,
  date: string
) {
  const { habitsCompletionsManager } = useHabits();
  const habitActionRef = useRef<BottomSheetModal>(null);
  const unitInputRef = useRef<BottomSheetModal>(null);

  const getCompletionUnitValue = useCallback(() => {
    const completion = habit.completions.filter(
      (completion) => date === dateToYMD(completion.completedAt)
    )[0];
    if (completion === undefined) {
      return 0;
    }
    return completion.unitValue || 0;
  }, [date, habit.completions]);

  const isCompleted = useMemo(() => {
    const completionsManager = habitsCompletionsManager.get(habit.id);
    return completionsManager?.isHabitCompletedAt(date) || false;
  }, [date, habit.id, habitsCompletionsManager]);

  const doesNotNeedToComplete = useMemo(() => {
    const completionsManager = habitsCompletionsManager.get(habit.id);
    return completionsManager?.isHabitDoesntNeedToCompleteAt(date) || false;
  }, [date, habit.id, habitsCompletionsManager]);

  const onPress = useCallback(async () => {
    if (isCompleted) {
      if (date !== dateToYMD(new Date())) {
        return;
      }
      await markHabitAsUncompleted(habit.id, date);
    } else {
      if (habit.unit !== null) {
        unitInputRef.current?.present();
        return;
      }
      await markHabitAsCompleted(habit.id, null);
    }
  }, [date, habit.id, habit.unit, isCompleted]);

  const onLongPress = useCallback(() => {
    Vibration.vibrate(30);
    habitActionRef.current?.present();
  }, []);

  return {
    isCompleted,
    doesNotNeedToComplete,
    onPress,
    onLongPress,
    habitActionRef,
    unitInputRef,
    getCompletionUnitValue,
  };
}
