import { db } from "@/db/db";
import { Task } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import React, { createContext, useContext } from "react";

interface ContextType {
  tasks: Task[];
}

const TasksContext = createContext<ContextType | undefined>(undefined);

export default function TasksProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: tasks } = useLiveQuery(db.query.taskTable.findMany());

  return (
    <TasksContext.Provider value={{ tasks }}>{children}</TasksContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be called within TaskssProvider");
  }
  return context;
};
