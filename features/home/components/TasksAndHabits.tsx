import Add from "@/components/Add";
import InterText from "@/components/InterText";
import TasksList from "@/features/tasks/components/TasksList";
import { Colors } from "@/lib/colors";
import { dateToYMD, getReadableDate } from "@/lib/date";
import { cn } from "@/lib/tailwindClasses";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useActivities } from "../context/ActivitiesCountContext";
import { useDate } from "../context/SelectedDateContext";
import ChooseActivityToCreateButtomSheet from "./ChooseActivityToCreateButtomSheet";
import CompletedHabits from "./CompletedHabits";
import HabitsAndTasksFilter from "./HabitsAndTasksFilter";
import UncompletedHabits from "./UncompletedHabits";

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
        {includeHabits && <UncompletedHabits />}
        {includeTasks && (
          <TasksList
            hasLabel
            date={selectedDate}
            displayBottomBorderForAll
            displayCompleted
          />
        )}
        {includeHabits && <CompletedHabits />}
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

function NoActivities({
  includeHabits,
  includeTasks,
}: {
  includeHabits: boolean;
  includeTasks: boolean;
}) {
  const { selectedDate } = useDate();

  return (
    <View className="items-center justify-center gap-3 pt-[50%]">
      <MaterialCommunityIcons name="sleep" size={50} color={Colors.primary} />
      <InterText className="text-lg font-semibold">
        No{" "}
        {(() => {
          if (includeHabits && includeTasks) {
            return "activities";
          }
          return includeHabits ? "habits" : "tasks";
        })()}
        {" for "}
        {dateToYMD(selectedDate) === dateToYMD(new Date())
          ? "today"
          : getReadableDate(selectedDate)}
      </InterText>
      <InterText className={cn("text-gray-500")}>
        Hit the button at the corner to create one
      </InterText>
    </View>
  );
}
