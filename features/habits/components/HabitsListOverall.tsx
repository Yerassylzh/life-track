import NoActivities from "@/features/home/components/NoActivities";
import React from "react";
import { useHabits } from "../context/HabitsContext";

function HabitsListOverall() {
  const { habits } = useHabits();

  if (habits.length === 0) {
    return <NoActivities includeHabits />;
  }
}

export default React.memo(HabitsListOverall);
