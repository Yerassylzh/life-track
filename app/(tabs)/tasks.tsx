import Add from "@/components/Add";
import AppBackground from "@/components/AppBackground";
import ViewSwitcher from "@/components/ViewSwitcher";
import Header from "@/features/tasks/components/Header";
import TasksList from "@/features/tasks/components/TasksList";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView } from "react-native";

const views = ["Today", "Later"];

export default function Tasks() {
  const [currentView, setCurrentView] = useState<"Today" | "Later">("Today");

  return (
    <AppBackground className="relative">
      <Header />
      <ViewSwitcher
        views={views}
        selectedIndex={currentView === "Today" ? 0 : 1}
        onSelect={(index: number) => {
          setCurrentView(views[index] as typeof currentView);
        }}
        elementWidth={80}
      />
      <ScrollView
        bounces={true}
        style={{ flex: 1 }}
        overScrollMode="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
        className="relative px-[15px]"
      >
        {currentView === "Today" ? (
          <TasksList hasLabel={false} displayAllTasks date={new Date()} />
        ) : (
          <TasksList hasLabel={false} displayAllTasks showUpcoming />
        )}
      </ScrollView>
      <Add
        className="mb-[120px] right-[15px]"
        onPress={() => router.navigate("/task/create_task")}
      />
    </AppBackground>
  );
}
