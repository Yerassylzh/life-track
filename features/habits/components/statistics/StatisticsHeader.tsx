import BackHeader from "@/components/ui/BackHeader";
import InterText from "@/components/ui/InterText";
import { HabitWithCompletions } from "@/db/types";
import DynamicIcon from "@/features/habits/components/ui/DynamicIcon";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { View } from "react-native";

interface StatisticsHeaderProps {
  habit?: HabitWithCompletions;
}

const StatisticsHeader: React.FC<StatisticsHeaderProps> = ({ habit }) => {
  return (
    <BackHeader>
      <View
        className={cn("flex-1 flex-row items-center justify-between px-2 py-2")}
      >
        <InterText className="text-[20px] font-bold">
          {habit ? habit.name : "Habit"}
        </InterText>
        {habit && (
          <DynamicIcon name={habit.iconName} color={habit.color} size={24} />
        )}
      </View>
    </BackHeader>
  );
};

export default StatisticsHeader;
