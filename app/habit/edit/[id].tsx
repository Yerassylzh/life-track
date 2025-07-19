import AppBackground from "@/components/AppBackground";
import BackHeader from "@/components/ui/BackHeader";
import InterText from "@/components/ui/InterText";
import HabitForm, {
  HabitFormData,
} from "@/features/habits/components/HabitForm";
import { scheduleNotification } from "@/features/habits/lib/notifications";
import { updateHabit } from "@/features/habits/lib/update";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { View } from "react-native";

import { useModalMessage } from "@/context/ModalMessageContext";
import { useHabits } from "@/features/habits/context/HabitsContext";
import { ColorPalette } from "@/lib/colors";
import { deleteNotification } from "@/lib/notifications";

export default function EditHabit() {
  const { id } = useLocalSearchParams();
  const { showMessage } = useModalMessage();
  const { habits } = useHabits();

  const habit = useMemo(
    () => habits.find((habit_) => habit_.id === id),
    [habits, id]
  );

  const handleSubmit = useCallback(
    async (data: HabitFormData) => {
      if (!habit) return;

      if (habit.reminder) {
        const prevReminders = JSON.parse(habit.reminder) as string[];
        for (const prevReminder of prevReminders) {
          await deleteNotification(prevReminder);
        }
      }

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

      const result = await updateHabit(habit.id, {
        name: data.title,
        description: data.description,
        unit: data.unit,
        iconName: data.iconName,
        color: ColorPalette[data.colorIndex],
        repeatType: data.repeatType,
        daysOfWeek: JSON.stringify(data.daysOfWeek),
        weeklyFreq: data.weeklyFreq,
        monthlyDays: JSON.stringify(data.monthlyDays),
        reminder: reminderIdsStr,
      });

      if (result.success) {
        console.log("Habit updated successfully!");
        router.replace("/(tabs)/home");
      } else {
        console.log("Error occured");
        showMessage(
          `Error occured while updating a habit. Logs: ${result.error}`
        );
      }
    },
    [habit, showMessage]
  );

  if (!habit) {
    return <InterText>Habit not found</InterText>;
  }

  return (
    <AppBackground className="gap-4">
      <BackHeader>
        <View className="flex-row gap-1.5 items-center justify-start">
          <InterText className="text-[20px]">Edit</InterText>
          <InterText className="font-bold text-[20px]">Habit</InterText>
        </View>
      </BackHeader>
      <HabitForm
        habitToEdit={habit}
        type={habit.unit ? "numeric" : "checkbox"}
        onSubmit={handleSubmit}
      />
    </AppBackground>
  );
}
