import Add from "@/components/Add";
import { navigate } from "expo-router/build/global-state/routing";
import React from "react";
import { View } from "react-native";

type FilterType = "all" | "habit" | "task";

export default function TasksAndHabits() {
  const [currentFilter, setCurrentFilter] = React.useState<FilterType>("all");

  return (
    <View className="flex-1 relative px-[15px]">
      <Add
        className="mb-[120px] right-[15px]"
        onPress={() => navigate("/create_habit")}
      />
    </View>
  );
}
