import NoActivities from "@/features/home/components/NoActivities";
import { dateToYMD } from "@/lib/date";
import { FlashList } from "@shopify/flash-list";
import React, { useMemo } from "react";
import { Dimensions, View } from "react-native";
import { useHabits } from "../context/HabitsContext";
import useHabitSorter from "../hooks/useHabitSorter";
import HabitBoxDaily from "./HabitBoxDaily";

const { width: screenW, height: screenH } = Dimensions.get("window");

function HabitsListDaily() {
  const { habits } = useHabits();
  const sortFn = useHabitSorter(dateToYMD(new Date()));

  const sortedHabits = useMemo(
    () => habits.slice().sort(sortFn),
    [habits, sortFn]
  );

  if (sortedHabits.length === 0) {
    return <NoActivities includeHabits />;
  }

  return (
    <FlashList
      data={sortedHabits}
      renderItem={({ item }) => (
        <HabitBoxDaily habit={item} date={dateToYMD(new Date())} />
      )}
      keyExtractor={(item) => item.id}
      estimatedItemSize={63}
      estimatedListSize={{
        width: screenW,
        height: screenH,
      }}
      bounces={true}
      overScrollMode="always"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 20,
        paddingBottom: 200,
        paddingHorizontal: 10,
      }}
      ItemSeparatorComponent={() => <View className="w-full h-[10px]" />}
    />
  );
}

export default React.memo(HabitsListDaily);
