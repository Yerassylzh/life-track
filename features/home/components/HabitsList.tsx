import { HabitWithCompletions } from "@/db/types";
import { useHabits } from "@/features/habits/context/HabitsContext";
import useHabitSorter from "@/features/habits/hooks/useHabitSorter";
import { dateToYMD, YMDToDate } from "@/lib/date";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo } from "react";
import { Dimensions } from "react-native";
import { useDate } from "../context/SelectedDateContext";
import HabitBox from "./HabitBox";
import NoActivities from "./NoActivities";

type DisplayType =
  | { displayCompleted: boolean }
  | { displayUncompleted: boolean }
  | { displayAll: boolean };

export type HabitsListProps = {
  hasLabel?: boolean;
  allowToDisplayNoHabits?: boolean;
} & DisplayType;

const screenDimensions = Dimensions.get("window");

export default function HabitsList(props: HabitsListProps) {
  const { habits, habitsCompletionsManager } = useHabits();
  const { selectedDate } = useDate();
  const date = useMemo(() => dateToYMD(selectedDate), [selectedDate]);
  const sortFn = useHabitSorter(date);

  const habitsToDisplay = useMemo(() => {
    const filteredHabits = habits.filter((habit) => {
      if (YMDToDate(date) < YMDToDate(dateToYMD(habit.createdAt))) {
        return false;
      }

      if ("displayAll" in props) {
        return true;
      }

      const isCompleted = habitsCompletionsManager
        .get(habit.id)
        ?.isHabitCompletedAt(date);
      const doesNotNeedToComplete = habitsCompletionsManager
        .get(habit.id)
        ?.isHabitDoesntNeedToCompleteAt(date);

      if ("displayCompleted" in props) {
        return props.displayCompleted
          ? isCompleted || doesNotNeedToComplete
          : !isCompleted;
      }
      if ("displayUncompleted" in props) {
        return props.displayUncompleted
          ? !isCompleted && !doesNotNeedToComplete
          : isCompleted;
      }
      return true;
    });

    return filteredHabits.sort(sortFn);
  }, [habits, sortFn, date, props, habitsCompletionsManager]);

  const renderItem = useCallback(
    ({ item }: { item: HabitWithCompletions }) => {
      return (
        <HabitBox
          key={item.id}
          hasBottomBorder={true}
          habit={item}
          date={date}
        />
      );
    },
    [date]
  );

  if (habitsToDisplay.length === 0 && props.allowToDisplayNoHabits) {
    return <NoActivities includeHabits={true} date={selectedDate} />;
  }

  return (
    <FlashList
      bounces={true}
      data={habitsToDisplay}
      renderItem={renderItem}
      overScrollMode="always"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 200, paddingHorizontal: 15 }}
      keyExtractor={(item) => item.id}
      estimatedItemSize={65}
      estimatedListSize={{
        width: screenDimensions.width,
        height: Math.min(screenDimensions.height, 65 * habitsToDisplay.length),
      }}
    />
  );
}
