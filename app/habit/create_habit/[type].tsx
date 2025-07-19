import AppBackground from "@/components/AppBackground";
import AppLoading from "@/components/AppLoading";
import BackHeader from "@/components/ui/BackHeader";
import InterText from "@/components/ui/InterText";
import { useModalMessage } from "@/context/ModalMessageContext";
import HabitForm, {
  HabitFormData,
} from "@/features/habits/components/HabitForm";
import { createHabit } from "@/features/habits/lib/create";
import { scheduleNotification } from "@/features/habits/lib/notifications";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { View } from "react-native";

export default function CreateHabit() {
  const { type } = useLocalSearchParams();
  const { showMessage } = useModalMessage();

  const handleSubmit = useCallback(
    async (data: HabitFormData) => {
      let reminderIdsStr = null;
      if (data.reminder !== null) {
        const reminderIds = await scheduleNotification(
          data.reminder,
          data.title,
          data.repeatType,
          data.daysOfWeek,
          data.monthlyDays
        );
        reminderIdsStr = JSON.stringify(reminderIds);
      }

      const result = await createHabit(
        data.title,
        data.description,
        data.unit,
        data.iconName,
        data.colorIndex,
        data.repeatType,
        data.daysOfWeek,
        data.weeklyFreq,
        data.monthlyDays,
        reminderIdsStr
      );
      if (result.success) {
        console.log("Created successfully");
        router.replace("/(tabs)/home");
      } else {
        console.log("Error occured");
        showMessage(
          `Error occured while creating habit. Logs: ${result.error}`
        );
      }
    },
    [showMessage]
  );

  if (type !== "numeric" && type !== "checkbox") {
    console.log("invalid params for create_habit:", type);
    return <AppLoading />;
  }

  return (
    <AppBackground className="gap-4">
      <BackHeader>
        <View className="flex-row gap-1 items-center justify-start">
          <InterText className="text-[20px]">Create</InterText>
          <InterText className="font-bold text-[20px]">Habit</InterText>
        </View>
      </BackHeader>
      <HabitForm type={type} onSubmit={handleSubmit} />
    </AppBackground>
  );
}
