import { useHabits } from "@/features/habits/context/HabitsContext";
import { useTasks } from "@/features/tasks/context/TasksContext";
import { dateToYMD, YMDToDate } from "@/lib/date";
import React, { useMemo, useState } from "react";
import { useDate } from "./SelectedDateContext";

type ActivitiesContextType = {
  isEmpty: boolean;
  currentFilter: string;
  setCurrentFilter: React.Dispatch<React.SetStateAction<string>>;
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
  const [currentFilter, setCurrentFilter] = React.useState("Habits");

  const [uncompletedTasksCount, setUncompletedTasksCount] = useState(0);
  const [uncompletedHabitsCount, setUncompletedHabitsCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [completedHabitsCount, setCompletedHabitsCount] = useState(0);

  const includeHabits = useMemo(
    () => currentFilter === "Habits",
    [currentFilter]
  );
  const includeTasks = useMemo(
    () => currentFilter === "Tasks",
    [currentFilter]
  );

  const { selectedDate } = useDate();
  const { habits } = useHabits();
  const { tasks } = useTasks();

  const isEmpty = useMemo(() => {
    if (includeHabits) {
      if (
        habits.length > 0 &&
        habits.some((habit) => {
          return (
            YMDToDate(dateToYMD(selectedDate)) >=
            YMDToDate(dateToYMD(habit.createdAt))
          );
        })
      ) {
        return false;
      }
    }

    if (includeTasks) {
      if (
        tasks.length > 0 &&
        tasks.some((task) => {
          return dateToYMD(task.targetDate) === dateToYMD(selectedDate);
        })
      ) {
        return false;
      }
    }
    return true;
  }, [includeHabits, includeTasks, habits, tasks, selectedDate]);

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
