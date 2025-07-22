import InterText from "@/components/ui/InterText";
import { Colors } from "@/lib/colors";
import { getReadableDate } from "@/lib/date";
import { cn } from "@/lib/tailwindClasses";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { View } from "react-native";

export default function NoActivities({
  includeHabits,
  includeTasks,
  customTitle,
  date,
  customDateString,
}: {
  includeHabits?: boolean;
  includeTasks?: boolean;
  customTitle?: string;
  date?: Date;
  customDateString?: string;
}) {
  const getActivityText = () => {
    if (customTitle) {
      return customTitle;
    }
    if (includeHabits && includeTasks) {
      return "activities";
    }
    return includeHabits ? "habits" : "tasks";
  };

  const getDateText = () => {
    if (customDateString) {
      return customDateString;
    }
    if (date) {
      return getReadableDate(date);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <View className="items-center justify-center gap-3">
        <MaterialCommunityIcons name="sleep" size={50} color={Colors.primary} />
        <InterText className="text-lg font-semibold">
          {customTitle ||
            "No " +
              getActivityText() +
              " " +
              (getDateText() ? "for " + getDateText() : "scheduled")}
        </InterText>
        <InterText className={cn("text-gray-500")}>
          Hit the button at the corner to create one
        </InterText>
        <View style={{ height: 65, width: 100 }} />
      </View>
    </View>
  );
}
