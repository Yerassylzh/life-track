import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import { HabitCompletionsManager } from "@/features/habits/lib/HabitCompletionsManager";
import { cn } from "@/lib/tailwindClasses";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import AmountCompleted from "./AmountCompleted";
import MonthlyTimeline from "./MonthlyTimeline";
import PillHeader from "./PillHeader";
import Streak from "./Streak";
import SuccessFailDonut from "./SuccessFailDonut";
import TimesCompleted from "./TimesCompleted";

const periods = ["week", "month", "year", "all"] as const;
type Period = (typeof periods)[number];

const StatisticsView: React.FC<{ habit: HabitWithCompletions }> = ({
  habit,
}) => {
  const { theme } = usePreferredColorTheme();
  const manager = useMemo(
    () => new HabitCompletionsManager(habit, "mon"),
    [habit]
  );
  const stats = useMemo(
    () => ({
      currentStreak: manager.getCurrentStreak(),
      bestStreak: manager.getBestStreak(),
      totalSuccess: manager.getTotalSuccess(),
      totalFailure: manager.getTotalFailure(),
      timesCompleted: periods.reduce(
        (acc, p) => ({ ...acc, [p]: manager.getTimesCompleted(p) }),
        {} as Record<Period, number>
      ),
      completionsCount:
        habit.unit != null
          ? periods.reduce(
              (acc, p) => ({ ...acc, [p]: manager.getCompletionsCount(p) }),
              {} as Record<Period, number>
            )
          : undefined,
    }),
    [manager, habit.unit]
  );

  return (
    <ScrollView
      className="w-full"
      contentContainerStyle={{ gap: 10 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        className={cn(
          "w-full rounded-xl p-4",
          theme === "dark" ? "bg-gray-900" : "bg-white"
        )}
      >
        <PillHeader
          icon={<Feather name="pie-chart" size={16} color={habit.color} />}
        >
          Success / Fail
        </PillHeader>
        <SuccessFailDonut
          done={stats.totalSuccess}
          skipped={stats.totalFailure}
          color={habit.color}
        />
      </View>
      <Streak
        currentStreak={stats.currentStreak}
        bestStreak={stats.bestStreak}
        color={habit.color}
      />
      <TimesCompleted
        periods={Array.from(periods)}
        stats={stats}
        habit={habit}
        theme={theme}
      />
      <AmountCompleted
        periods={Array.from(periods)}
        stats={stats}
        habit={habit}
        theme={theme}
      />
      <MonthlyTimeline habit={habit} />
    </ScrollView>
  );
};

export default StatisticsView;
