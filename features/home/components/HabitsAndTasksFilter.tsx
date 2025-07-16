import InterText from "@/components/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import { capitalize } from "@/lib/text";
import React from "react";
import { Pressable, View } from "react-native";

export type FilterType = "all" | "habit" | "task";

type Props = {
  onFilterChange: (filter_: FilterType) => void;
  currentFilter: FilterType;
};

export default function HabitsAndTasksFilter({
  onFilterChange,
  currentFilter,
}: Props) {
  return (
    <View className="w-full flex flex-row gap-2 items-center justify-start px-[15px]">
      {["all", "habit", "task"].map((filterText, index) => (
        <Filter
          key={index}
          selected={currentFilter === filterText}
          onPress={() => onFilterChange(filterText as FilterType)}
          text={capitalize(filterText) + (filterText === "all" ? "" : "s")}
        />
      ))}
    </View>
  );
}

function Filter({
  selected,
  onPress,
  text,
}: {
  selected: boolean;
  onPress: () => void;
  text: string;
}) {
  const { theme } = usePreferredColorTheme();

  return (
    <Pressable
      className={cn(
        "px-3 py-1.5 border border-gray-300 rounded-xl",
        theme === "dark" && "border-gray-700",
        selected && "bg-[rgba(0,149,182,.22)]"
      )}
      onPress={onPress}
    >
      <InterText className="text-sm">{text}</InterText>
    </Pressable>
  );
}
