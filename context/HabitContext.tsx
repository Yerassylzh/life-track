import AppLoading from "@/components/AppLoading";
import { Habit } from "@/db/schema";
import { HabitWithCompletions } from "@/db/types";
import { getHabits } from "@/features/habits/lib/get";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ContextType {
  habits: Habit[];
  setHabits: React.Dispatch<
    React.SetStateAction<HabitWithCompletions[] | null>
  >;
}

const HabitContext = createContext<ContextType | undefined>(undefined);

export default function HabitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [habits, setHabits] = useState<HabitWithCompletions[] | null>(null);

  useEffect(() => {
    const wrapper = async () => {
      const data = await getHabits();
      if (!data.success) {
        // showMessage()
      } else {
        setHabits(data.habits as unknown as HabitWithCompletions[]);
      }
    };

    wrapper();
  }, []);

  if (habits === null) {
    return <AppLoading />;
  }

  const data = {
    habits: habits,
    setHabits: setHabits,
  };

  return <HabitContext.Provider value={data}>{children}</HabitContext.Provider>;
}

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be called within HabitsProvider");
  }
  return context;
};
