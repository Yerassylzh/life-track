import { HabitWithCompletions } from "@/db/types";
import { useHabits } from "@/features/habits/context/HabitsContext";
import { markHabitAsCompleted } from "@/features/habits/lib/update";
import { dateToYMD, YMDToDate } from "@/lib/date";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { useDate } from "../context/SelectedDateContext";
import HabitBox from "./HabitBox";
import UnitValueInputModal from "./UnitValueInputModal";

export default function UncompletedHabits() {
  const { habits, habitsCompletionsManager } = useHabits();
  const { selectedDate } = useDate();
  const date = useMemo(() => dateToYMD(selectedDate), [selectedDate]);

  const filter = useCallback(
    (habit: HabitWithCompletions) => {
      if (YMDToDate(date) < YMDToDate(dateToYMD(habit.createdAt))) {
        return false;
      }
      return (
        !habitsCompletionsManager.get(habit.id)?.isHabitCompletedAt(date) &&
        !habitsCompletionsManager
          .get(habit.id)
          ?.isHabitDoesntNeedToCompleteAt(date)
      );
    },
    [habitsCompletionsManager, date]
  );

  return (
    <>
      {habits.filter(filter).map((habit, index) => (
        <HabitBoxWithCompletionsManager key={index} habit={habit} />
      ))}
    </>
  );
}

function HabitBoxWithCompletionsManager({
  habit,
  allowComplete = true,
}: {
  habit: HabitWithCompletions;
  allowComplete?: boolean;
}) {
  const unitInputRef = useRef<BottomSheetModal>(null);
  const { selectedDate } = useDate();

  return (
    <>
      <HabitBox
        hasBottomBorder={true}
        isCompleted={false}
        habit={habit}
        date={dateToYMD(selectedDate)}
        onPress={async () => {
          if (!allowComplete) {
            return;
          }
          if (habit.unit !== null) {
            unitInputRef.current?.present();
            return;
          }
          await markHabitAsCompleted(habit.id, null);
        }}
      />
      <UnitValueInputModal unitInputRef={unitInputRef} habit={habit} />
    </>
  );
}
