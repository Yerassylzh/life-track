import AppBackground from "@/components/AppBackground";
import BackHeader from "@/components/ui/BackHeader";
import InterText from "@/components/ui/InterText";
import { useModalMessage } from "@/context/ModalMessageContext";
import TaskForm, { TaskFormData } from "@/features/tasks/components/TaskForm";
import { createTask } from "@/features/tasks/lib/create";
import {
  NotificationContentType,
  scheduleSingleNotification,
} from "@/lib/notifications";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { View } from "react-native";

export default function CreateTask() {
  const { showMessage } = useModalMessage();

  const handleSubmit = useCallback(
    async (data: TaskFormData) => {
      let reminderIdsStr = null;
      if (data.reminder !== null) {
        const reminderIds = await scheduleSingleNotification(
          data.reminder,
          data.selectedDate,
          {
            title: "Don't forget it",
            body: `You have a task '${data.name}' scheduled for today!`,
          } as NotificationContentType
        );
        reminderIdsStr = JSON.stringify(reminderIds);
      }

      const result = await createTask(
        data.name,
        data.selectedDate,
        reminderIdsStr
      );
      if (result.success) {
        console.log("Task created successfully!");
        router.replace("/(tabs)/home");
      } else {
        console.log("Error occured");
        showMessage(
          `Error occured while creating a task. Logs: ${result.error}`
        );
      }
    },
    [showMessage]
  );

  return (
    <AppBackground className="gap-4">
      <BackHeader>
        <View className="flex-row gap-1.5 items-center justify-start">
          <InterText className="text-[20px]">Create</InterText>
          <InterText className="font-bold text-[20px]">Task</InterText>
        </View>
      </BackHeader>
      <TaskForm onSubmit={handleSubmit} />
    </AppBackground>
  );
}
