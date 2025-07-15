import AppLoading from "@/components/AppLoading";
import { db } from "@/db/db";
import { HabitWithCompletions } from "@/db/types";
import { HabitCompletionsManager } from "@/features/habits/lib/HabitCompletionsManager";
import { getFirstDayOfWeek } from "@/lib/date";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ContextType {
  habits: HabitWithCompletions[];
  habitsCompletionsManager: Map<string, HabitCompletionsManager>;
}

const HabitContext = createContext<ContextType | undefined>(undefined);

export default function HabitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const completionsData = useLiveQuery(
    db.query.habitCompletionTable.findMany()
  );

  const { data } = useLiveQuery(
    db.query.habitTable.findMany({
      with: {
        completions: true,
      },
    }),
    [completionsData.data]
  );

  const [habitsCompletionsManager, setHabitsCompletionsManager] = useState<Map<
    string,
    HabitCompletionsManager
  > | null>(null);

  useEffect(() => {
    (async () => {
      const firstDayOfWeek = (await getFirstDayOfWeek()) as "mon" | "sun";
      setHabitsCompletionsManager(
        new Map(
          data.map((habit) => [
            habit.id,
            new HabitCompletionsManager(habit, firstDayOfWeek),
          ])
        )
      );
    })();
  }, [data]);

  if (habitsCompletionsManager === null) {
    return <AppLoading />;
  }

  return (
    <HabitContext.Provider value={{ habits: data, habitsCompletionsManager }}>
      {children}
    </HabitContext.Provider>
  );
}

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be called within HabitsProvider");
  }
  return context;
};
