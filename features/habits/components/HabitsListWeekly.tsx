import { HabitWithCompletions } from "@/db/types";
import NoActivities from "@/features/home/components/NoActivities";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback } from "react";
import { View } from "react-native";
import { useHabits } from "../context/HabitsContext";
import HabitBoxWeekly from "./HabitBoxWeekly";

function HabitsListWeekly() {
  const { habits } = useHabits();

  const renderItem = useCallback(({ item }: { item: HabitWithCompletions }) => {
    return <HabitBoxWeekly habit={item} />;
  }, []);

  if (habits.length === 0) {
    return <NoActivities includeHabits />;
  }

  return (
    <>
      <FlashList
        bounces={true}
        overScrollMode="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 200,
          paddingHorizontal: 15,
        }}
        ItemSeparatorComponent={() => <View className="w-full h-[10px]" />}
        keyExtractor={(item: HabitWithCompletions) => item.id}
        data={habits}
        renderItem={renderItem}
        estimatedItemSize={141}
        drawDistance={200}
        removeClippedSubviews={false}
        onLoad={({ elapsedTimeInMs }) => {
          console.log(elapsedTimeInMs);
        }}
      />
    </>
  );
}

export default React.memo(HabitsListWeekly);
