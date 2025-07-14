import { Habit, HabitCompletion } from "./schema";

export type HabitWithCompletions = Habit & {
  completions: HabitCompletion[];
};
