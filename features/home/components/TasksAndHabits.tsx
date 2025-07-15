import Add from "@/components/Add";
import { dateToYMD } from "@/lib/date";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import { View } from "react-native";
import { useDate } from "../context/SelectedDateContext";
import ChooseActivityToCreateButtomSheet from "./ChooseActivityToCreateButtomSheet";
import CompletedHabits from "./CompletedHabit";
import HabitsAndTasksFilter, { FilterType } from "./HabitsAndTasksFilter";
import UncompletedHabits from "./UncompletedHabits";

export default function TasksAndHabits() {
  const [currentFilter, setCurrentFilter] = React.useState<FilterType>("all");
  const { selectedDate } = useDate();
  const activityTypeChoiceRef = useRef<BottomSheetModal>(null);

  const includeHabits = useMemo(
    () => ["all", "habit"].includes(currentFilter),
    [currentFilter]
  );
  const includeTasks = useMemo(
    () => ["all", "habit"].includes(currentFilter),
    [currentFilter]
  );

  return (
    <View className="flex-1 relative px-[15px] gap-[20px]">
      <HabitsAndTasksFilter
        onFilterChange={setCurrentFilter}
        currentFilter={currentFilter}
      />
      <View className="gap-1">
        {includeHabits && <CompletedHabits date={dateToYMD(selectedDate)} />}
        {includeTasks && <UncompletedHabits date={dateToYMD(selectedDate)} />}
      </View>
      <Add
        className="mb-[120px] right-[15px]"
        onPress={() => activityTypeChoiceRef.current?.present()}
      />
      <ChooseActivityToCreateButtomSheet ref={activityTypeChoiceRef} />
    </View>
  );
}
