import ModalBottomSheet from "@/components/ModalBottomSheet";
import { useHabits } from "@/context/HabitContext";
import { HabitWithCompletions } from "@/db/types";
import { markHabitAsCompleted } from "@/features/habits/lib/update";
import { dateToYMD, YMDToDate } from "@/lib/date";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef } from "react";
import HabitBox from "./HabitBox";

type Props = {
  date: string;
};

export default function UncompletedHabits({ date }: Props) {
  const { habits, habitsCompletionsManager } = useHabits();

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

  const unitInputRef = useRef<BottomSheetModal>(null);

  return (
    <>
      {habits.filter(filter).map((habit, index) => (
        <HabitBox
          key={index}
          hasBottomBorder={true}
          isCompleted={false}
          habit={habit}
          onPress={async () => {
            if (date !== dateToYMD(new Date())) {
              return;
            }
            if (habit.unit !== null) {
              unitInputRef.current?.present();
              return;
            }
            await markHabitAsCompleted(habit.id);
          }}
        />
      ))}
      <ModalBottomSheet ref={unitInputRef}>
        <BottomSheetTextInput />
      </ModalBottomSheet>
    </>
  );
}
