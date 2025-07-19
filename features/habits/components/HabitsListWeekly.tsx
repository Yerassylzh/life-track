import { HabitWithCompletions } from "@/db/types";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useHabits } from "../context/HabitsContext";
import HabitBoxWeekly from "./HabitBoxWeekly";

function HabitsListWeekly() {
  const { habits } = useHabits();

  const renderItem = useCallback(({ item }: { item: HabitWithCompletions }) => {
    return <HabitBoxWeekly key={item.id} habit={item} />;
  }, []);

  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <ActivityIndicator size={"large"} />}
      <FlashList
        bounces={true}
        overScrollMode="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 200,
          paddingHorizontal: 15,
        }}
        ItemSeparatorComponent={useCallback(
          () => (
            <View className="w-full h-[10px]" />
          ),
          []
        )}
        keyExtractor={useCallback((item: HabitWithCompletions) => item.id, [])}
        data={habits}
        renderItem={renderItem}
        estimatedItemSize={141}
        drawDistance={200}
        removeClippedSubviews={false}
        onLoad={({ elapsedTimeInMs }) => {
          setLoading(false);
          console.log(elapsedTimeInMs);
        }}
      />
    </>
  );
}

export default React.memo(HabitsListWeekly);
