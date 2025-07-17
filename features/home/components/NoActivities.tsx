import InterText from "@/components/InterText";
import { Colors } from "@/lib/colors";
import { dateToYMD, getReadableDate } from "@/lib/date";
import { cn } from "@/lib/tailwindClasses";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { View } from "react-native";
import { useDate } from "../context/SelectedDateContext";

export default function NoActivities({
  includeHabits,
  includeTasks,
}: {
  includeHabits: boolean;
  includeTasks: boolean;
}) {
  const { selectedDate } = useDate();

  const getActivityText = () => {
    if (includeHabits && includeTasks) {
      return "activities";
    }
    return includeHabits ? "habits" : "tasks";
  };

  const getDateText = () => {
    if (dateToYMD(selectedDate) === dateToYMD(new Date())) {
      return "today";
    }
    return getReadableDate(selectedDate);
  };

  return (
    <View className="items-center justify-center gap-3 pt-[50%]">
      <MaterialCommunityIcons name="sleep" size={50} color={Colors.primary} />
      <InterText className="text-lg font-semibold">
        No {getActivityText()} for {getDateText()}
      </InterText>
      <InterText className={cn("text-gray-500")}>
        Hit the button at the corner to create one
      </InterText>
    </View>
  );
}
