import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { View } from "react-native";

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
  const { theme } = usePreferredColorTheme();

  return (
    <View className="w-12 items-center">
      <View
        className="w-9 h-9 rounded-full items-center justify-center mb-1"
        style={{ backgroundColor: color }}
      >
        <InterText className="text-base font-bold text-zinc-800 opacity-60 leading-5">
          {day}
        </InterText>
        <InterText className="text-xs text-zinc-800 opacity-60 mt-[-2px]">
          {weekday}
        </InterText>
      </View>
      <View
        className={cn(
          "w-1 flex-1 bg-zinc-200 mt-0.5 rounded",
          theme === "dark" && "bg-zinc-800"
        )}
      />
    </View>
  );
});

export default TimelineDateCircle;
