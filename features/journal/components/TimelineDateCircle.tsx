import React from "react";
import { Text, View } from "react-native";

interface TimelineDateCircleProps {
  day: number;
  weekday: string;
  color: string;
}

const TimelineDateCircle = React.memo(function TimelineDateCircle({
  day,
  weekday,
  color,
}: TimelineDateCircleProps) {
  return (
    <View className="w-12 items-center">
      <View
        className="w-9 h-9 rounded-full items-center justify-center mb-1"
        style={{ backgroundColor: color }}
      >
        <Text className="text-base font-bold text-white leading-5">{day}</Text>
        <Text className="text-xs text-white mt-[-2px]">{weekday}</Text>
      </View>
      <View className="w-1 flex-1 bg-zinc-200 mt-0.5 rounded" />
    </View>
  );
});

export default TimelineDateCircle;
