import AppBackground from "@/components/AppBackground";
import BackHeader from "@/components/BackHeader";
import InterText from "@/components/InterText";
import { useModalMessage } from "@/context/ModalMessageContext";
import TaskForm, { TaskFormData } from "@/features/tasks/components/TaskForm";
import { updateTask } from "@/features/tasks/lib/update";
import {
  NotificationContentType,
  scheduleSingleNotification,
} from "@/lib/notifications";
import * as Notifications from "expo-notifications";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { View } from "react-native";

import { useTasks } from "@/features/tasks/context/TasksContext";
import { YMDToDate } from "@/lib/date";

export default function EditTask() {
  const { id } = useLocalSearchParams();
  const { showMessage } = useModalMessage();

  const { tasks } = useTasks();
  const task = useMemo(() => {
    return tasks.find((task_) => id === task_.id) || null;
  }, [tasks, id]);

  const handleSubmit = useCallback(
    async (data: TaskFormData) => {
      if (!task) return;

      if (task.reminder) {
        const prevReminderIds = JSON.parse(task.reminder);
        prevReminderIds.map((id: string) =>
          Notifications.cancelScheduledNotificationAsync(id)
        );
      }

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

      const result = await updateTask(task.id, {
        name: data.name,
        targetDate: YMDToDate(data.selectedDate),
        reminder: reminderIdsStr,
      });

      if (result.success) {
        console.log("Task updated successfully!");
        router.replace("/(tabs)/home");
      } else {
        console.log("Error occured");
        showMessage(
          `Error occured while updating a task. Logs: ${result.error}`
        );
      }
    },
    [task, showMessage]
  );

  if (!task) {
    return <InterText>Task not found</InterText>;
  }

  return (
    <AppBackground className="gap-4">
      <BackHeader>
        <View className="flex-row gap-1 items-center justify-start">
          <InterText className="text-[20px]">Edit</InterText>
          <InterText className="font-bold text-[20px]">Task</InterText>
        </View>
      </BackHeader>
      <TaskForm taskToEdit={task} onSubmit={handleSubmit} />
    </AppBackground>
  );
}
