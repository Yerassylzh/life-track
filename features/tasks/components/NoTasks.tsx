import InterText from "@/components/InterText";
import { Colors } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { View } from "react-native";

export default function NoTasks() {
  return (
    <View className="items-center justify-center gap-3 pt-[50%] flex-1">
      <MaterialCommunityIcons name="sleep" size={50} color={Colors.primary} />
      <InterText className="text-lg font-semibold">
        No tasks scheduled
      </InterText>
      <InterText className={cn("text-gray-500")}>
        Hit the button at the corner to create one
      </InterText>
    </View>
  );
}
