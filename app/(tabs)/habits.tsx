import AppBackground from "@/components/AppBackground";
import ViewSwitcher from "@/components/ViewSwitcher";
import HabitsListDaily from "@/features/habits/components/HabitsListDaily";
import HabitsListOverall from "@/features/habits/components/HabitsListOverall";
import HabitsListWeekly from "@/features/habits/components/HabitsListWeekly";
import Header from "@/features/habits/components/Header";
import CreateNewHabitButton from "@/features/habits/components/ui/CreateNewHabitButton";
import React, { useState } from "react";

function Habits() {
  const [periodFilterIndex, setPeriodFilterIndex] = useState(0);

  return (
    <AppBackground className="relative">
      <Header />
      <ViewSwitcher
        views={["Today", "Weekly", "Overall"]}
        selectedIndex={periodFilterIndex}
        onSelect={setPeriodFilterIndex}
        elementWidth={80}
        components={[HabitsListDaily, HabitsListWeekly, HabitsListOverall]}
      />
      <CreateNewHabitButton />
    </AppBackground>
  );
}

export default React.memo(Habits);
