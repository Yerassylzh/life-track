import { HabitWithCompletions } from "@/db/types";
import { useHabits } from "@/features/habits/context/HabitsContext";
import {
  markHabitAsCompleted,
  markHabitAsUncompleted,
} from "@/features/habits/lib/update";
import { dateToYMD, YMDToDate } from "@/lib/date";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { useDate } from "../context/SelectedDateContext";
import HabitBox from "./HabitBox";
import UnitValueInputModal from "./UnitValueInputModal";

type DisplayType =
  | { displayCompleted: boolean }
  | { displayUncompleted: boolean };

export type HabitsListProps = {
  hasLabel?: boolean;
} & DisplayType;

export default function HabitsList(props: HabitsListProps) {
  const { habits, habitsCompletionsManager } = useHabits();
  const { selectedDate } = useDate();
  const date = useMemo(() => dateToYMD(selectedDate), [selectedDate]);

  const filter = useCallback(
    (habit: HabitWithCompletions) => {
      if (YMDToDate(date) < YMDToDate(dateToYMD(habit.createdAt))) {
        return false;
      }
      const isCompleted =
        habitsCompletionsManager.get(habit.id)?.isHabitCompletedAt(date) ||
        habitsCompletionsManager
          .get(habit.id)
          ?.isHabitDoesntNeedToCompleteAt(date);

      if ("displayCompleted" in props) {
        return props.displayCompleted ? isCompleted : !isCompleted;
      }
      return !isCompleted;
    },
    [habitsCompletionsManager, date, props]
  );

  return (
    <>
      {habits.filter(filter).map((habit, index) => (
        <HabitBoxWithCompletionsManager
          key={index}
          habit={habit}
          isCompleted={"displayCompleted" in props && props.displayCompleted}
        />
      ))}
    </>
  );
}

function HabitBoxWithCompletionsManager({
  habit,
  isCompleted,
}: {
  habit: HabitWithCompletions;
  isCompleted: boolean;
}) {
  const unitInputRef = useRef<BottomSheetModal>(null);
  const { selectedDate } = useDate();
  const date = dateToYMD(selectedDate);

  const handlePress = async () => {
    if (isCompleted) {
      if (date !== dateToYMD(new Date())) {
        return;
      }
      await markHabitAsUncompleted(habit.id, date);
    } else {
      if (habit.unit !== null) {
        unitInputRef.current?.present();
        return;
      }
      await markHabitAsCompleted(habit.id, null);
    }
  };

  return (
    <>
      <HabitBox
        hasBottomBorder={true}
        isCompleted={isCompleted}
        habit={habit}
        date={date}
        onPress={handlePress}
      />
      <UnitValueInputModal unitInputRef={unitInputRef} habit={habit} />
    </>
  );
}
