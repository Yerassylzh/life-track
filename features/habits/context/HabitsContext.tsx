import AppLoading from "@/components/AppLoading";
import { db } from "@/db/db";
import { HabitWithCompletions } from "@/db/types";
import { HabitCompletionsManager } from "@/features/habits/lib/HabitCompletionsManager";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import React, { createContext, useContext, useMemo } from "react";

interface ContextType {
  habits: HabitWithCompletions[];
  habitsCompletionsManager: Map<string, HabitCompletionsManager>;
}

const HabitsContext = createContext<ContextType | undefined>(undefined);

function useHabitsWithCompletions() {
  const { data: habits } = useLiveQuery(db.query.habitTable.findMany());
  const { data: completions } = useLiveQuery(
    db.query.habitCompletionTable.findMany()
  );

  return useMemo(() => {
    if (!habits || !completions) return [];

    return habits.map((habit) => ({
      ...habit,
      completions: completions.filter(
        (completion) => completion.habitId === habit.id
      ),
    }));
  }, [habits, completions]);
}

export default function HabitsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const habits = useHabitsWithCompletions();

  const habitsCompletionsManager = useMemo(() => {
    const firstDayOfWeek = "mon";
    return new Map(
      habits.map((habit) => [
        habit.id,
        new HabitCompletionsManager(habit, firstDayOfWeek),
      ])
    );
  }, [habits]);

  if (habitsCompletionsManager === null) {
    return <AppLoading />;
  }

  return (
    <HabitsContext.Provider value={{ habits, habitsCompletionsManager }}>
      {children}
    </HabitsContext.Provider>
  );
}

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error("useHabits must be called within HabitsProvider");
  }
  return context;
};
