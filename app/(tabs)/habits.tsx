import Add from "@/components/Add";
import AppBackground from "@/components/AppBackground";
import InterText from "@/components/InterText";
import ChooseHabitTypeToCreate from "@/features/habits/components/ChooseHabitTypeToCreate";
import HabitBoxDaily from "@/features/habits/components/HabitBoxDaily";
import HabitReviewPeriodFilter from "@/features/habits/components/HabitReviewPeriodFilter";
import Header from "@/features/habits/components/Header";
import { useHabits } from "@/features/habits/context/HabitsContext";
import useHabitSorter from "@/features/habits/hooks/useHabitSorter";
import { dateToYMD } from "@/lib/date";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

export default function Habits() {
  const [periodFilterIndex, setPeriodFilterIndex] = useState(0);

  const HabitsListComponent = useMemo(() => {
    const components = [HabitsListDaily, HabitsListWeekly, HabitsListOverall];
    return components[periodFilterIndex];
  }, [periodFilterIndex]);

  return (
    <AppBackground className="relative">
      <Header />
      <HabitReviewPeriodFilter
        selectedIndex={periodFilterIndex}
        onSelect={setPeriodFilterIndex}
      />
      {HabitsListComponent && <HabitsListComponent />}
      <CreateNewHabitButton />
    </AppBackground>
  );
}

function CreateNewHabitButton() {
  const activityTypeChoiceRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <Add
        className="mb-[120px] right-[15px]"
        onPress={() => activityTypeChoiceRef.current?.present()}
      />
      <ChooseHabitTypeToCreate ref={activityTypeChoiceRef} />
    </>
  );
}

function HabitsListDaily() {
  const { habits } = useHabits();
  const sortFn = useHabitSorter(dateToYMD(new Date()));

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

function HabitsListWeekly() {
  return <InterText>Weekly</InterText>;
}

function HabitsListOverall() {
  return <InterText>Overall</InterText>;
}
