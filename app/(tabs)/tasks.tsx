import AppBackground from "@/components/AppBackground";
import Add from "@/components/ui/Add";
import ViewSwitcher from "@/components/ViewSwitcher";
import Header from "@/features/tasks/components/Header";
import TasksList from "@/features/tasks/components/TasksList";
import { router } from "expo-router";
import React, { useState } from "react";

const viewsConfig = {
  Today: () => Promise.resolve({ default: TasksListToday }),
  Later: () => Promise.resolve({ default: TasksListUpcoming }),
};

const TasksListToday = () => {
  return <TasksList hasLabel={false} displayAllTasks date={new Date()} />;
};

const TasksListUpcoming = () => {
  return <TasksList hasLabel={false} displayAllTasks showUpcoming />;
};

export default function Tasks() {
  const [currentView, setCurrentView] = useState<"Today" | "Later">("Today");

  return (
    <AppBackground className="relative">
      <Header />
      <ViewSwitcher
        viewsConfig={viewsConfig}
        activeView={currentView}
        onSelect={(viewKey: string) =>
          setCurrentView(viewKey as typeof currentView)
        }
        elementWidth={80}
      />
      <Add
        className="mb-[100px] right-[15px]"
        onPress={() => router.navigate("/task/create_task")}
      />
    </AppBackground>
  );
}
