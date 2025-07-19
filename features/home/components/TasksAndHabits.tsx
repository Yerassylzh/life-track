import Add from "@/components/ui/Add";
import TasksList from "@/features/tasks/components/TasksList";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { View } from "react-native";
import { useActivities } from "../context/ActivitiesCountContext";
import { useDate } from "../context/SelectedDateContext";
import ChooseActivityToCreateButtomSheet from "./ChooseActivityToCreateButtomSheet";
import HabitsAndTasksFilter from "./HabitsAndTasksFilter";
import HabitsList from "./HabitsList";

export default function TasksAndHabits() {
  const { currentFilter, setCurrentFilter, includeTasks } = useActivities();
  const activityTypeChoiceRef = useRef<BottomSheetModal>(null);
  const { selectedDate } = useDate();

  return (
    <View className="flex-1 gap-5">
      <HabitsAndTasksFilter
        onFilterChange={setCurrentFilter}
        currentFilter={currentFilter}
      />
      {includeTasks ? (
        <TasksList
          hasLabel
          date={selectedDate}
          displayAllTasks
          allowToDisplayNoTasks
        />
      ) : (
        <HabitsList displayAll={true} allowToDisplayNoHabits />
      )}
      <Add
        className="mb-[100px] right-[15px]"
        onPress={() => activityTypeChoiceRef.current?.present()}
      />
      <ChooseActivityToCreateButtomSheet ref={activityTypeChoiceRef} />
    </View>
  );
}

{
  /* <FlashList
  bounces={true}
  renderItem={renderItem}
  style={{ flex: 1 }}
  overScrollMode="always"
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 200 }}
  className="relative px-[15px]"
/> */
}
