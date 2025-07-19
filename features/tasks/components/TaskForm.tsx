import DateSelectInput from "@/components/form/DateSelectInput";
import Input from "@/components/form/Input";
import PrimaryButton from "@/components/form/PrimaryButton";
import ReminderInput from "@/components/ReminderInput";
import { Task } from "@/db/schema";
import { dateToYMD, getFormattedTimeString } from "@/lib/date";
import { getSingleNotificationInfo } from "@/lib/notifications";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";

export type TaskFormData = {
  name: string;
  selectedDate: string;
  reminder: string | null;
};

type TaskFormProps = {
  taskToEdit?: Task;
  onSubmit: (data: TaskFormData) => void;
};

export default function TaskForm({ taskToEdit, onSubmit }: TaskFormProps) {
  const [name, setName] = useState(taskToEdit?.name || "");
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string>(
    dateToYMD(taskToEdit?.targetDate || new Date())
  );
  const [reminder, setReminder] = useState<string | null>("08:00");

  useEffect(() => {
    const loadNotificationInfo = async () => {
      if (!taskToEdit || taskToEdit.reminder === null) return;

      const reminderIds = JSON.parse(taskToEdit.reminder) as string[];
      const info = await getSingleNotificationInfo(reminderIds[0]);
      if ("alreadyExpired" in info) {
        return;
      }
      if ("value" in info.trigger) {
        setReminder(
          getFormattedTimeString(
            new Date((info.trigger as { value: number }).value)
          )
        );
      }
    };
    loadNotificationInfo();
  }, [taskToEdit]);

  const validateFormData = useCallback(() => {
    if (name.length === 0) {
      setNameError("Enter name");
      return false;
    } else {
      setNameError(undefined);
    }
    return true;
  }, [name]);

  const handlePress = () => {
    if (validateFormData()) {
      onSubmit({
        name,
        selectedDate: selectedDate,
        reminder: reminder,
      });
    }
  };

  return (
    <>
      <ScrollView
        className="px-[15px] gap-3"
        bounces={true}
        overScrollMode="always"
        style={{ flex: 1 }}
        contentContainerStyle={{ gap: 10, paddingBottom: 200 }}
      >
        <Input
          onChangeText={setName}
          value={name}
          placeholder="Title"
          error={nameError}
        />
        <DateSelectInput date={selectedDate} setDate={setSelectedDate} />
        <ReminderInput reminder={reminder} setReminder={setReminder} />
      </ScrollView>
      <PrimaryButton
        label="Save"
        className="self-center absolute bottom-4 w-[90%]"
        onPress={handlePress}
      />
    </>
  );
}
