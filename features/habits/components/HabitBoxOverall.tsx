import CompleteButton from "@/components/ui/CompleteButton";
import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import { Colors } from "@/lib/colors";
import { dateToYMD, getMondayBasedWeekday } from "@/lib/date";
import { hexToRgba } from "@/lib/hex";
import { useMappingHelper } from "@shopify/flash-list";
import React, { useMemo } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { useHabitActions } from "../context/HabitActionsContext";

const { width } = Dimensions.get("window");

const DAY_CELL_SIZE = 10;
const DAY_CELL_MARGIN = 2;
const CNT_IN_ROW = parseInt(
  ((width - 15 * 2 - 14 * 2) / (DAY_CELL_SIZE + DAY_CELL_MARGIN * 2)).toString()
);

const CalendarGrid = ({ habit }: { habit: HabitWithCompletions }) => {
  const { isCompleted, doesNotNeedToComplete } = useHabitActions();
  const { theme } = usePreferredColorTheme();

  const todayYMD = useMemo(() => dateToYMD(new Date()), []);

  const days = useMemo(() => {
    const result: { date: string; isFuture: boolean }[] = [];
    const todayDate = new Date();
    const dayOfWeek = getMondayBasedWeekday(todayDate.getDay());

    const daysInGrid = CNT_IN_ROW * 7;

    const endDate = new Date();
    endDate.setDate(todayDate.getDate() + (6 - dayOfWeek));

    const iterDate = new Date(endDate);
    iterDate.setDate(iterDate.getDate() - daysInGrid + 1);

    for (let i = 0; i < daysInGrid; i++) {
      const dateYMD = dateToYMD(iterDate);
      result.push({
        date: dateYMD,
        isFuture: dateYMD > todayYMD,
      });
      iterDate.setDate(iterDate.getDate() + 1);
    }
    return result;
  }, [todayYMD]);

  const { getMappingKey } = useMappingHelper();

  return (
    <View
      style={{
        height: 7 * (DAY_CELL_SIZE + DAY_CELL_MARGIN * 2),
      }}
      className="flex flex-col flex-wrap content-start"
    >
      {days.map(({ date, isFuture }, index) => {
        const completed = isCompleted(habit, date);
        const notNeeded = doesNotNeedToComplete(habit, date);
        const beforeCreation = date < dateToYMD(habit.createdAt);

        const emptyColor =
          theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";

        const backgroundColor =
          isFuture || beforeCreation
            ? emptyColor
            : completed
              ? hexToRgba(habit.color, 0.7)
              : notNeeded
                ? hexToRgba(habit.color, 0.2)
                : emptyColor;

        return (
          <View
            key={getMappingKey(date, index)}
            style={{
              width: DAY_CELL_SIZE,
              height: DAY_CELL_SIZE,
              backgroundColor,
              borderRadius: 2,
              margin: DAY_CELL_MARGIN,
            }}
          />
        );
      })}
    </View>
  );
};

type Props = {
  habit: HabitWithCompletions;
};

export default function HabitBoxOverall({ habit }: Props) {
  const { onPress, onLongPress, isCompleted, doesNotNeedToComplete } =
    useHabitActions();
  const { theme } = usePreferredColorTheme();
  const date = useMemo(() => dateToYMD(new Date()), []);

  return (
    <TouchableOpacity
      style={{ backgroundColor: theme === "dark" ? "black" : "white" }}
      className="rounded-xl p-4"
      onLongPress={() => onLongPress(habit)}
      onPress={async () => await onPress(habit, dateToYMD(new Date()))}
    >
      <View className="flex flex-row items-center justify-between mb-4">
        <InterText className="text-base font-medium">{habit.name}</InterText>
        <CompleteButton
          isCompleted={isCompleted(habit, date)}
          doesNotNeedToComplete={doesNotNeedToComplete(habit, date)}
          tickColor={habit.color}
          bgColorUncompleted={hexToRgba(Colors["gray-100"], 0.4)}
          bgColorCompleted={hexToRgba(habit.color, 0.2)}
        />
      </View>
      <CalendarGrid habit={habit} />
    </TouchableOpacity>
  );
}
