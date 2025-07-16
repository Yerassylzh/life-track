import { useHabits } from "@/context/HabitContext";
import { dateToYMD, YMDToDate } from "@/lib/date";
import React, { useMemo, useState } from "react";
import { FilterType } from "../components/HabitsAndTasksFilter";

type ActivitiesContextType = {
  isEmpty: boolean;
  currentFilter: FilterType;
  setCurrentFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  includeTasks: boolean;
  includeHabits: boolean;
  uncompletedTasksCount: number;
  setUncompletedTasksCount: React.Dispatch<React.SetStateAction<number>>;
  uncompletedHabitsCount: number;
  setUncompletedHabitsCount: React.Dispatch<React.SetStateAction<number>>;
  completedTasksCount: number;
  setCompletedTasksCount: React.Dispatch<React.SetStateAction<number>>;
  completedHabitsCount: number;
  setCompletedHabitsCount: React.Dispatch<React.SetStateAction<number>>;
};

const ActivitiesContext = React.createContext<
  ActivitiesContextType | undefined
>(undefined);

export const ActivitiesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentFilter, setCurrentFilter] = React.useState<FilterType>("all");

  const [uncompletedTasksCount, setUncompletedTasksCount] = useState(0);
  const [uncompletedHabitsCount, setUncompletedHabitsCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [completedHabitsCount, setCompletedHabitsCount] = useState(0);

  const includeHabits = useMemo(
    () => ["all", "habit"].includes(currentFilter),
    [currentFilter]
  );
  const includeTasks = useMemo(
    () => ["all", "habit"].includes(currentFilter),
    [currentFilter]
  );

  const { habits } = useHabits();

  const isEmpty = useMemo(() => {
    let habitsEmpty = true;
    if (includeHabits) {
      if (
        habits.length > 0 &&
        habits.some((habit) => {
          return (
            YMDToDate(dateToYMD(new Date())) >=
            YMDToDate(dateToYMD(habit.createdAt))
          );
        })
      ) {
        habitsEmpty = false;
      }
    }

    let tasksEmpty = true;
    if (includeTasks) {
      // soon
    }
    return habitsEmpty && tasksEmpty;
  }, [includeHabits, includeTasks, habits]);

  const data = {
    isEmpty,
    currentFilter,
    setCurrentFilter,
    includeTasks,
    includeHabits,
    uncompletedTasksCount,
    setUncompletedTasksCount,
    uncompletedHabitsCount,
    setUncompletedHabitsCount,
    completedTasksCount,
    setCompletedTasksCount,
    completedHabitsCount,
    setCompletedHabitsCount,
  };

  return (
    <ActivitiesContext.Provider value={data}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  const context = React.useContext(ActivitiesContext);
  if (!context) {
    throw new Error("useActivities must be used within a ActivitiesProvider");
  }
  return context;
};
