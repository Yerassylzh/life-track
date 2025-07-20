import NoActivities from "@/features/home/components/NoActivities";
import { dateToYMD } from "@/lib/date";
import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import { useHabits } from "../context/HabitsContext";
import useHabitSorter from "../hooks/useHabitSorter";
import HabitBoxDaily from "./HabitBoxDaily";

function HabitsListDaily() {
  const { habits } = useHabits();
  const sortFn = useHabitSorter(dateToYMD(new Date()));

  const sortedHabits = useMemo(() => habits.sort(sortFn), [habits, sortFn]);

  if (sortedHabits.length === 0) {
    return <NoActivities includeHabits />;
  }

  return (
    <ScrollView
      bounces={true}
      style={{ flex: 1 }}
      overScrollMode="always"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 20, paddingBottom: 200, gap: 10 }}
      className="relative px-[15px]"
    >
      {habits.sort(sortFn).map((habit) => (
        <HabitBoxDaily
          key={habit.id}
          habit={habit}
          date={dateToYMD(new Date())}
        />
      ))}
    </ScrollView>
  );
}

export default React.memo(HabitsListDaily);
