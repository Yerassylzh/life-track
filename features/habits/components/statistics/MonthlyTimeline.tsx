import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import { HabitCompletionsManager } from "@/features/habits/lib/HabitCompletionsManager";
import { Colors } from "@/lib/colors";
import { dateToYMD } from "@/lib/date";
import { hexToRgba } from "@/lib/hex";
import { cn } from "@/lib/tailwindClasses";
import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

const DOT_SIZE = 8;
const TICK_SIZE = 18;
const TICK_PADDING = 5;
const LINE_HEIGHT = 1;

const MonthlyTimeline: React.FC<{ habit: HabitWithCompletions }> = ({
  habit,
}) => {
  const { theme } = usePreferredColorTheme();
  const manager = useMemo(
    () => new HabitCompletionsManager(habit, "mon"),
    [habit]
  );
  const today = useMemo(() => new Date(), []);
  const [monthOffset, setMonthOffset] = useState(0);
  const displayMonth = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    return d;
  }, [today, monthOffset]);
  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(year, month, i + 1)
  );
  const isNumeric = !!habit.unit;

  return (
    <View
      className={cn(
        "w-full rounded-xl p-4",
        theme === "dark" ? "bg-gray-900" : "bg-white"
      )}
    >
      <View className="flex-row items-center justify-between mb-2">
        <TouchableOpacity onPress={() => setMonthOffset((o) => o - 1)}>
          <Feather name="chevron-left" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <InterText
          className={cn("text-base font-bold")}
          style={{ color: habit.color }}
        >
          {displayMonth.toLocaleString("default", { month: "long" })} {year}
        </InterText>
        <TouchableOpacity onPress={() => setMonthOffset((o) => o + 1)}>
          <Feather name="chevron-right" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 2,
        }}
      >
        {/* Timeline line */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: TICK_SIZE + TICK_PADDING + DOT_SIZE / 2,
            height: LINE_HEIGHT,
            backgroundColor:
              theme === "dark" ? Colors["gray-700"] : Colors["gray-300"],
            zIndex: 0,
          }}
        />
        {days.map((date, idx) => {
          const ymd = dateToYMD(date);
          const completed = manager.isHabitCompletedAt(ymd);
          let value = 0;
          if (isNumeric) {
            value =
              habit.completions.find(
                (c) => dateToYMD(new Date(c.completedAt)) === ymd
              )?.unitValue || 0;
          }
          return (
            <View
              key={ymd}
              className="flex flex-col items-center"
              style={{ zIndex: 1, width: TICK_SIZE + 10 }}
            >
              {/* Tick or value above dot if completed */}
              <View style={{ height: TICK_SIZE, marginBottom: TICK_PADDING }}>
                <View
                  className={cn("rounded-md flex items-center justify-center")}
                  style={{
                    width: TICK_SIZE,
                    height: TICK_SIZE,
                    backgroundColor:
                      completed || (isNumeric && value > 0)
                        ? hexToRgba(habit.color, 0.2)
                        : "transparent",
                  }}
                >
                  {isNumeric
                    ? value > 0 && (
                        <InterText
                          className="font-bold text-xs"
                          style={{ color: habit.color }}
                        >
                          {value}
                        </InterText>
                      )
                    : completed && (
                        <Feather name="check" size={14} color={habit.color} />
                      )}
                </View>
              </View>
              {/* Dot */}
              <View
                className={cn(
                  "rounded-full",
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                )}
                style={{ width: DOT_SIZE, height: DOT_SIZE }}
              />
              {/* Day label */}
              <InterText
                className={cn(
                  "text-xs mt-1",
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                )}
              >
                {date.getDate()}
              </InterText>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default MonthlyTimeline;
