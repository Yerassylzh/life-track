import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import { HabitCompletionsManager } from "@/features/habits/lib/HabitCompletionsManager";
import { Colors } from "@/lib/colors";
import { addDaystoDate, dateToYMD, substractDaysFromDate } from "@/lib/date";
import { cn } from "@/lib/tailwindClasses";
import { Feather } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import React, { useMemo, useState } from "react";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import PillHeader from "./PillHeader";
import Streak from "./Streak";

const { width } = Dimensions.get("window");

const CALENDAR_PADDING = 14;
const DAYS_IN_ROW = 7;
const ROWS = 6;
const DAY_CELL_MARGIN = 6;
const DAY_CELL_SIZE =
  (width - CALENDAR_PADDING * 2) / DAYS_IN_ROW - DAY_CELL_MARGIN * 2;

const CalendarView: React.FC<{ habit: HabitWithCompletions }> = ({ habit }) => {
  const manager = useMemo(
    () => new HabitCompletionsManager(habit, "mon"),
    [habit]
  );
  const { theme } = usePreferredColorTheme();
  const [monthOffset, setMonthOffset] = useState(0);
  const today = useMemo(() => new Date(), []);
  const displayMonth = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    return d;
  }, [today, monthOffset]);
  const days = useMemo(() => {
    const firstDay = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth(),
      1
    );
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday-based
    const startDate = substractDaysFromDate(firstDay, startDay);
    const grid: Date[] = [];
    for (let i = 0; i < DAYS_IN_ROW * ROWS; i++) {
      grid.push(addDaystoDate(startDate, i));
    }
    return grid;
  }, [displayMonth]);

  return (
    <ScrollView
      className="w-full"
      contentContainerStyle={{ gap: 10 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        className={cn(
          "w-full rounded-xl p-4 gap-3",
          theme === "dark" ? "bg-gray-900" : "bg-white"
        )}
      >
        <PillHeader
          icon={<Feather name="calendar" size={16} color={habit.color} />}
        >
          Calendar
        </PillHeader>
        <View>
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => setMonthOffset((o) => o - 1)}>
              <Entypo name="chevron-left" size={32} color={habit.color} />
            </TouchableOpacity>
            <InterText
              className={cn("text-xl font-bold")}
              style={{ color: habit.color }}
            >
              {displayMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </InterText>
            <TouchableOpacity onPress={() => setMonthOffset((o) => o + 1)}>
              <Entypo name="chevron-right" size={32} color={habit.color} />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
              <View
                key={d}
                style={{
                  width: DAY_CELL_SIZE,
                  margin: DAY_CELL_MARGIN,
                  alignItems: "center",
                }}
              >
                <InterText
                  className={cn(
                    "text-xs",
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  {d}
                </InterText>
              </View>
            ))}
          </View>
          <View className="flex-row flex-wrap justify-center">
            {days.map((date, idx) => {
              const ymd = dateToYMD(date);
              const isCurrentMonth =
                date.getMonth() === displayMonth.getMonth();
              const completed = manager.isHabitCompletedAt(ymd);
              const notNeeded = manager.isHabitDoesntNeedToCompleteAt(ymd);
              const beforeCreation = ymd < dateToYMD(new Date(habit.createdAt));
              const emptyColor =
                theme === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)";
              let backgroundColor = emptyColor;
              let borderColor = "transparent";
              if (!isCurrentMonth || beforeCreation) {
                backgroundColor = emptyColor;
              } else if (completed) {
                backgroundColor =
                  theme === "dark" ? Colors["gray-800"] : Colors["teal-50"];
                borderColor = habit.color;
              } else if (notNeeded) {
                backgroundColor =
                  theme === "dark" ? Colors["gray-700"] : Colors["amber-50"];
                borderColor = Colors["amber-300"];
              }

              return (
                <View
                  key={ymd}
                  style={{
                    width: DAY_CELL_SIZE,
                    height: DAY_CELL_SIZE,
                    backgroundColor,
                    borderRadius: 16,
                    margin: DAY_CELL_MARGIN,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isCurrentMonth ? 1 : 0.4,
                    borderWidth: 2,
                    borderColor,
                  }}
                >
                  <InterText
                    className={cn(
                      "text-lg font-bold",
                      completed && "text-teal-500",
                      notNeeded && "text-amber-500"
                    )}
                    style={{ color: habit.color }}
                  >
                    {date.getDate()}
                  </InterText>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <Streak
        currentStreak={manager.getCurrentStreak()}
        bestStreak={manager.getBestStreak()}
        color={habit.color}
      />
    </ScrollView>
  );
};

export default CalendarView;
