import { NewTaskProvider } from "@/features/tasks/context/NewTaskContext";
import { Slot } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <NewTaskProvider>
      <Slot />
    </NewTaskProvider>
  );
}
