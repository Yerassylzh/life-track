import AppBackground from "@/components/AppBackground";
import AppLoading from "@/components/AppLoading";
import ViewSwitcher from "@/components/ViewSwitcher";
import CalendarView from "@/features/habits/components/statistics/CalendarView";
import StatisticsHeader from "@/features/habits/components/statistics/StatisticsHeader";
import StatisticsView from "@/features/habits/components/statistics/StatisticsView";
import { useHabits } from "@/features/habits/context/HabitsContext";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";

export default function HabitStatisticsPage() {
  const { id } = useLocalSearchParams();
  const { habits } = useHabits();
  const habit = useMemo(() => habits.find((h) => h.id === id), [habits, id]);

  const [activeView, setActiveView] = React.useState("Statistics");
  const viewsConfig = React.useMemo(
    () => ({
      Statistics: async () => ({
        default: () => (habit ? <StatisticsView habit={habit} /> : null),
      }),
      Calendar: async () => ({
        default: () => (habit ? <CalendarView habit={habit} /> : null),
      }),
    }),
    [habit]
  );

  if (!habit) return <AppLoading />;

  return (
    <AppBackground>
      <StatisticsHeader habit={habit} />
      <ViewSwitcher
        viewsConfig={viewsConfig}
        activeView={activeView}
        onSelect={setActiveView}
      />
    </AppBackground>
  );
}
