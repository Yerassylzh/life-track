import InterText from "@/components/InterText";
import ToggleSwitch from "@/components/ToggleSwitch";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import { getFormattedTimeString } from "@/lib/date";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { SetStateAction, useCallback } from "react";
import { Pressable, View } from "react-native";

export type ReminderInputProps = {
  reminder: string | null;
  setReminder: React.Dispatch<SetStateAction<string | null>>;
};

export default function ReminderInput({
  reminder,
  setReminder,
}: ReminderInputProps) {
  const { theme } = usePreferredColorTheme();

  const onReminderChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      selectedDate && setReminder(getFormattedTimeString(selectedDate));
    },
    [setReminder]
  );

  const onReminderPress = useCallback(() => {
    const reminderDate =
      reminder === null
        ? new Date(2025, 0, 1, 8, 0)
        : new Date(
            2025,
            0,
            1,
            Number(reminder.split(":")[0]),
            Number(reminder.split(":")[1])
          );

    DateTimePickerAndroid.open({
      value: reminderDate,
      onChange: onReminderChange,
      mode: "time",
      is24Hour: true,
    });
  }, [reminder, onReminderChange]);

  return (
    <View
      style={{
        backgroundColor: theme === "light" ? "white" : Colors["gray-900"],
      }}
      className="gap-7 items-center justify-between rounded-2xl p-4 flex-row"
    >
      <View className="flex flex-row items-center gap-2">
        <InterText className="text-lg font-semibold">Reminder</InterText>
        {reminder !== null && (
          <Pressable
            style={{
              backgroundColor:
                theme === "light" ? Colors["gray-300"] : Colors["gray-700"],
            }}
            onPress={onReminderPress}
            className="rounded-xl px-2 py-1"
          >
            <InterText>{reminder}</InterText>
          </Pressable>
        )}
      </View>
      <ToggleSwitch
        defaultValue={true}
        value={reminder !== null}
        onChange={(value) => {
          if (!value) {
            setReminder(null);
          } else {
            setReminder("08:00");
          }
        }}
      />
    </View>
  );
}
