import Add from "@/components/Add";
import InterText from "@/components/InterText";
import { useHabits } from "@/context/HabitContext";
import { Colors } from "@/lib/colors";
import { dateToYMD, YMDToDate } from "@/lib/date";
import { cn } from "@/lib/tailwindClasses";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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

  const { habits } = useHabits();
  const isEmpty = useMemo(() => {
    let habitsEmpty = true;
    if (includeHabits) {
      if (
        habits.length > 0 &&
        habits.some((habit) => {
          return (
            YMDToDate(dateToYMD(new Date())) >=
            YMDToDate(dateToYMD(habit.createdAt))
          );
        })
      ) {
        habitsEmpty = false;
      }
    }

    let tasksEmpty = true;
    if (includeTasks) {
      // soon
    }
    return habitsEmpty && tasksEmpty;
  }, [includeHabits, includeTasks]);

  return (
    <View className="flex-1 relative px-[15px] gap-[20px]">
      <HabitsAndTasksFilter
        onFilterChange={setCurrentFilter}
        currentFilter={currentFilter}
      />
      <View
        className="gap-1"
        style={
          isEmpty
            ? {
                flex: 1,
                alignItems: "center",
              }
            : {}
        }
      >
        {includeHabits && <CompletedHabits date={dateToYMD(selectedDate)} />}
        {includeHabits && <UncompletedHabits date={dateToYMD(selectedDate)} />}
        {isEmpty && (
          <View className="items-center justify-center gap-3 pt-[50%]">
            <MaterialCommunityIcons
              name="sleep"
              size={50}
              color={Colors.primary}
            />
            <InterText className="text-lg font-semibold">
              No activities for today
            </InterText>
            <InterText className={cn("text-gray-500")}>
              Hit the button at the corner to create one
            </InterText>
          </View>
        )}
      </View>
      <Add
        className="mb-[120px] right-[15px]"
        onPress={() => activityTypeChoiceRef.current?.present()}
      />
      <ChooseActivityToCreateButtomSheet ref={activityTypeChoiceRef} />
    </View>
  );
}
