import AppBackground from "@/components/AppBackground";
import ViewSwitcher from "@/components/ViewSwitcher";
import HabitsListDaily from "@/features/habits/components/HabitsListDaily";
import HabitsListOverall from "@/features/habits/components/HabitsListOverall";
import HabitsListWeekly from "@/features/habits/components/HabitsListWeekly";
import Header from "@/features/habits/components/Header";
import CreateNewHabitButton from "@/features/habits/components/ui/CreateNewHabitButton";
import React, { useState } from "react";

const viewsConfig = {
  Today: () => Promise.resolve({ default: HabitsListDaily }),
  Weekly: () => Promise.resolve({ default: HabitsListWeekly }),
  Overall: () => Promise.resolve({ default: HabitsListOverall }),
};

function Habits() {
  const [currentView, setCurrentView] = useState("Today");

  return (
    <AppBackground className="relative">
      <Header />
      <ViewSwitcher
        onSelect={setCurrentView}
        viewsConfig={viewsConfig}
        activeView={currentView}
        elementWidth={80}
      />
      <CreateNewHabitButton />
    </AppBackground>
  );
}

export default React.memo(Habits);
