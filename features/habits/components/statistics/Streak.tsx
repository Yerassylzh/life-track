import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import PillHeader from "./PillHeader";

const NUMBER_FONT = 18;

type Props = {
  currentStreak: number;
  bestStreak: number;
  color: string;
};

export default function Streak({ currentStreak, bestStreak, color }: Props) {
  const { theme } = usePreferredColorTheme();
  return (
    <View
      className={cn(
        "w-full rounded-xl p-4 flex flex-col gap-2",
        theme === "dark" ? "bg-gray-900" : "bg-white"
      )}
    >
      <PillHeader icon={<Entypo name="link" size={16} color={color} />}>
        Streak
      </PillHeader>
      <View className="flex flex-row justify-between mt-2">
        <View className="flex-1 flex flex-col items-center">
          <InterText
            className={cn(
              "text-xs mb-1",
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            )}
          >
            Current
          </InterText>
          <InterText
            className={cn("font-extrabold", `text-[${NUMBER_FONT}px]`)}
            style={{ color }}
          >
            {currentStreak} {currentStreak === 1 ? "DAY" : "DAYS"}
          </InterText>
        </View>
        <View className="flex-1 flex flex-col items-center">
          <InterText
            className={cn(
              "text-xs mb-1",
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            )}
          >
            Best
          </InterText>
          <InterText
            className={cn("font-extrabold", `text-[${NUMBER_FONT}px]`)}
            style={{ color }}
          >
            {bestStreak} {bestStreak === 1 ? "DAY" : "DAYS"}
          </InterText>
        </View>
      </View>
    </View>
  );
}
