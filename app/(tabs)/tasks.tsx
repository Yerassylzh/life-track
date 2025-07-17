import AppBackground from "@/components/AppBackground";
import InterText from "@/components/InterText";
import ViewSwitcher from "@/components/ViewSwitcher";
import Header from "@/features/tasks/components/Header";
import React, { useState } from "react";

const views = ["Today", "Later"];

export default function Tasks() {
  const [currentView, setCurrentView] = useState<"Today" | "Later">("Today");

  return (
    <AppBackground>
      <Header />
      <ViewSwitcher
        views={views}
        selectedIndex={currentView === "Today" ? 0 : 1}
        onSelect={(index: number) => {
          setCurrentView(views[index] as typeof currentView);
        }}
        elementWidth={80}
      />
      <InterText>Tasks</InterText>
    </AppBackground>
  );
}
