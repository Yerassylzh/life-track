import AppBackground from "@/components/AppBackground";
import BackHeader from "@/components/BackHeader";
import DateSelectInput from "@/components/DateSelectInput";
import Input from "@/components/Input";
import InterText from "@/components/InterText";
import PrimaryButton from "@/components/PrimaryButton";
import ReminderInput from "@/components/ReminderInput";
import { useModalMessage } from "@/context/ModalMessageContext";
import { useNewTask } from "@/features/tasks/context/NewTaskContext";
import { createTask } from "@/features/tasks/lib/create";
import {
  NotificationContentType,
  scheduleSingleNotification,
} from "@/lib/notifications";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";

export default function CreateTask() {
  const {
    title,
    setTitle,
    titleError,
    setTitleError,
    selectedDate,
    setSelectedDate,
    reminder,
    setReminder,
  } = useNewTask();

  const { showMessage } = useModalMessage();

  const validateFormData = useCallback(() => {
    if (title.length === 0) {
      setTitleError("Enter title");
      return false;
    } else {
      setTitleError(undefined);
    }
    return true;
  }, [setTitleError, title]);

  const onPress = useCallback(async () => {
    if (!validateFormData()) {
      return;
    }

    let reminderIdsStr = null;
    if (reminder !== null) {
      const reminderIds = await scheduleSingleNotification(
        reminder,
        selectedDate,
        {
          title: "Don't forget it",
          body: `You have a task '${title}' scheduled for today!`,
        } as NotificationContentType
      );
      reminderIdsStr = JSON.stringify(reminderIds);
    }

    const data = await createTask(title, selectedDate, reminderIdsStr);
    if (data.success) {
      console.log("Task created successfully!");
      router.replace("/(tabs)/home");
    } else {
      console.log("Error occured");
      showMessage(`Error occured while creating a task. Logs: ${data.error}`);
    }
  }, [reminder, selectedDate, showMessage, title, validateFormData]);

  return (
    <AppBackground className="gap-4">
      <BackHeader>
        <View className="flex-row gap-1 items-center justify-start">
          <InterText className="text-[20px]">Create</InterText>
          <InterText className="font-bold text-[20px]">Task</InterText>
        </View>
      </BackHeader>
      <ScrollView
        className="px-[15px] gap-3"
        bounces={true}
        overScrollMode="always"
        style={{ flex: 1 }}
        contentContainerStyle={{ gap: 10, paddingBottom: 200 }}
      >
        <Input
          onChangeText={setTitle}
          value={title}
          placeholder="Title"
          error={titleError}
        />
        <DateSelectInput date={selectedDate} setDate={setSelectedDate} />
        <ReminderInput reminder={reminder} setReminder={setReminder} />
      </ScrollView>
      <PrimaryButton
        label="Save"
        className="self-center absolute bottom-4 w-[90%]"
        onPress={onPress}
      />
    </AppBackground>
  );
}
