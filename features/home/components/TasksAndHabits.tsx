import Add from "@/components/Add";
import TasksList from "@/features/tasks/components/TasksList";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useActivities } from "../context/ActivitiesCountContext";
import { useDate } from "../context/SelectedDateContext";
import ChooseActivityToCreateButtomSheet from "./ChooseActivityToCreateButtomSheet";
import HabitsAndTasksFilter from "./HabitsAndTasksFilter";
import HabitsList from "./HabitsList";
import NoActivities from "./NoActivities";

export default function TasksAndHabits() {
  const {
    currentFilter,
    setCurrentFilter,
    includeHabits,
    includeTasks,
    isEmpty,
  } = useActivities();
  const activityTypeChoiceRef = useRef<BottomSheetModal>(null);
  const { selectedDate } = useDate();

  return (
    <View className="flex-1 gap-5">
      <HabitsAndTasksFilter
        onFilterChange={setCurrentFilter}
        currentFilter={currentFilter}
      />
      <ScrollView
        bounces={true}
        style={{ flex: 1 }}
        overScrollMode="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
        className="relative px-[15px]"
      >
        {includeTasks && (
          <TasksList
            hasLabel
            date={selectedDate}
            displayBottomBorderForAll
            displayUncompleted
          />
        )}
        {includeHabits && <HabitsList displayUncompleted />}
        {includeTasks && (
          <TasksList
            hasLabel
            date={selectedDate}
            displayBottomBorderForAll
            displayCompleted
          />
        )}
        {includeHabits && <HabitsList displayCompleted />}
        {isEmpty && (
          <NoActivities
            includeHabits={includeHabits}
            includeTasks={includeTasks}
          />
        )}
      </ScrollView>
      <Add
        className="mb-[120px] right-[15px]"
        onPress={() => activityTypeChoiceRef.current?.present()}
      />
      <ChooseActivityToCreateButtomSheet ref={activityTypeChoiceRef} />
    </View>
  );
}
