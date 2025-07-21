import InterText from "@/components/ui/InterText";
import { cn } from "@/lib/tailwindClasses";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import PillHeader from "./PillHeader";

const NUMBER_FONT = 18;

const AmountCompleted = ({
  periods,
  stats,
  habit,
  theme,
}: {
  periods: string[];
  stats: any;
  habit: any;
  theme: string;
}) => {
  if (!habit.unit || !stats.completionsCount) return null;
  return (
    <View
      className={cn(
        "w-full rounded-xl p-4",
        theme === "dark" ? "bg-gray-900" : "bg-white"
      )}
    >
      <PillHeader
        icon={<Feather name="bar-chart-2" size={16} color={habit.color} />}
      >
        Amount completed
      </PillHeader>
      {periods.map((p) => (
        <View key={p} className="flex-row justify-between items-center mb-2">
          <InterText
            className={cn(
              "text-xs",
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            )}
          >
            {p === "all" ? "All time" : `This ${p}`}
          </InterText>
          <InterText
            className={cn("font-extrabold", `text-[${NUMBER_FONT}px]`)}
            style={{ color: habit.color }}
          >
            {stats.completionsCount[p]} {habit.unit}
          </InterText>
        </View>
      ))}
    </View>
  );
};

export default AmountCompleted;
