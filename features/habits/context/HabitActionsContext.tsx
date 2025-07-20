import { HabitWithCompletions } from "@/db/types";
import { dateToYMD } from "@/lib/date";
import React, { createContext, useCallback } from "react";
import { Vibration } from "react-native";
import { useHabitActionsModal } from "../context/HabitActionsModalContext";
import { useHabits } from "../context/HabitsContext";
import { useUnitValueInputModal } from "../context/UnitValueInputModalContext";
import { markHabitAsCompleted, markHabitAsUncompleted } from "../lib/update";

type ContextType = {
  getCompletionUnitValue: (habit: HabitWithCompletions, date: string) => number;
  isCompleted: (habit: HabitWithCompletions, date: string) => boolean;
  doesNotNeedToComplete: (habit: HabitWithCompletions, date: string) => boolean;
  onPress: (habit: HabitWithCompletions, date: string) => Promise<void>;
  onLongPress: (habit: HabitWithCompletions) => void;
};

const Context = createContext<ContextType | undefined>(undefined);

export function HabitActionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { habitsCompletionsManager } = useHabits();
  const { showModal: showHabitActionsModal } = useHabitActionsModal();
  const { showModal: showUnitValueInputModal } = useUnitValueInputModal();

  const getCompletionUnitValue = useCallback(
    (habit: HabitWithCompletions, date: string) => {
      const completion = habit.completions.filter(
        (completion) => date === dateToYMD(completion.completedAt)
      )[0];
      if (completion === undefined) {
        return 0;
      }
      return completion.unitValue || 0;
    },
    []
  );

  const isCompleted = useCallback(
    (habit: HabitWithCompletions, date: string) => {
      const completionsManager = habitsCompletionsManager.get(habit.id);
      return completionsManager?.isHabitCompletedAt(date) || false;
    },
    [habitsCompletionsManager]
  );

  const doesNotNeedToComplete = useCallback(
    (habit: HabitWithCompletions, date: string) => {
      const completionsManager = habitsCompletionsManager.get(habit.id);
      return completionsManager?.isHabitDoesntNeedToCompleteAt(date) || false;
    },
    [habitsCompletionsManager]
  );

  const onPress = useCallback(
    async (habit: HabitWithCompletions, date: string) => {
      if (date !== dateToYMD(new Date())) {
        return;
      }

      if (isCompleted(habit, date)) {
        await markHabitAsUncompleted(habit.id, date);
      } else {
        if (habit.unit !== null) {
          showUnitValueInputModal(habit);
          return;
        }
        await markHabitAsCompleted(habit.id, null);
      }
    },
    [isCompleted, showUnitValueInputModal]
  );

  const onLongPress = useCallback(
    (habit: HabitWithCompletions) => {
      Vibration.vibrate(30);
      showHabitActionsModal(habit);
    },
    [showHabitActionsModal]
  );

  const data = {
    getCompletionUnitValue,
    isCompleted,
    doesNotNeedToComplete,
    onPress,
    onLongPress,
  };

  return <Context.Provider value={data}>{children}</Context.Provider>;
}

export function useHabitActions() {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useHabitActions must be used within a HabitActionsProvider"
    );
  }
  return context;
}
