import InterText from "@/components/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import { dateToYMD, getReadableDate, YMDToDate } from "@/lib/date";
import { hexToRgba } from "@/lib/hex";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { SetStateAction, useCallback } from "react";
import { Pressable, View } from "react-native";

export type DateSelectInputProps = {
  date: string;
  setDate: React.Dispatch<SetStateAction<string>>;
};

export default function DateSelectInput({
  date,
  setDate,
}: DateSelectInputProps) {
  const { theme } = usePreferredColorTheme();

  const onDateChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (!selectedDate) {
        return;
      }
      if (
        YMDToDate(dateToYMD(selectedDate)) < YMDToDate(dateToYMD(new Date()))
      ) {
        return;
      }
      setDate(dateToYMD(selectedDate));
    },
    [setDate]
  );

  const onDatePress = useCallback(() => {
    DateTimePickerAndroid.open({
      value: YMDToDate(date),
      onChange: onDateChange,
      mode: "date",
    });
  }, [date, onDateChange]);

  return (
    <View
      style={{
        backgroundColor: theme === "light" ? "white" : Colors["gray-900"],
      }}
      className="gap-7 items-center justify-between rounded-2xl p-4 flex-row"
    >
      <View className="flex flex-row items-center gap-2">
        <InterText className="text-lg font-semibold">Date</InterText>
      </View>
      <Pressable
        onPress={onDatePress}
        className="rounded-md p-2"
        style={{ backgroundColor: hexToRgba(Colors.primary, 0.3) }}
      >
        <InterText customColor={hexToRgba(Colors.primary)}>
          {getReadableDate(YMDToDate(date))}
        </InterText>
      </Pressable>
    </View>
  );
}
