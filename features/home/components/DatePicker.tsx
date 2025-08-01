import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import moment, { Moment } from "moment"; // Import Moment type
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, Text, TouchableWithoutFeedback, View } from "react-native";

const { width } = Dimensions.get("window");
const GAP = 5;
const numOfDays = 9;
const ITEM_WIDTH = (width - (numOfDays - 1) * GAP) / numOfDays;

interface DatePickerProps {
  onDateSelected: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateSelected }) => {
  const [selectedDate, setSelectedDate] = useState<Moment>(() => moment());
  const { theme } = usePreferredColorTheme();

  const dates = useMemo(() => {
    const dates: Moment[] = [];
    const today: Moment = moment();

    const delta = parseInt((numOfDays / 2).toString());

    for (let i = delta; i > 0; i--) {
      dates.push(moment(today).subtract(i, "days"));
    }

    dates.push(today);

    for (let i = 1; i <= delta; i++) {
      dates.push(moment(today).add(i, "days"));
    }
    return dates;
  }, []);

  const handleDatePress = useCallback(
    (date: Moment): void => {
      setSelectedDate(date);
      if (onDateSelected) {
        onDateSelected(date.toDate());
      }
    },
    [onDateSelected]
  );

  interface RenderItemProps {
    item: Moment;
  }

  const renderItem = useCallback(
    ({ item }: RenderItemProps) => {
      const isSelected: boolean = item.isSame(selectedDate, "day");

      return (
        <TouchableWithoutFeedback
          key={item.toDate().getTime()}
          onPress={() => handleDatePress(item)}
        >
          <View
            className={cn(
              "items-center justify-center py-1 rounded-xl",
              theme === "light" ? "bg-gray-200" : "bg-gray-800"
            )}
            style={{
              width: ITEM_WIDTH,
              backgroundColor: isSelected
                ? Colors.primary
                : theme === "light"
                  ? Colors["gray-200"]
                  : Colors["gray-800"],
            }}
          >
            <Text
              className="text-[10px] font-medium mb-1"
              style={{
                color: isSelected
                  ? "white"
                  : theme === "light"
                    ? Colors["gray-600"]
                    : Colors["gray-400"],
              }}
            >
              {item.format("ddd")}
            </Text>
            <Text
              className="text-base font-bold"
              style={{
                color: isSelected
                  ? "white"
                  : theme === "light"
                    ? Colors["gray-600"]
                    : Colors["gray-400"],
              }}
            >
              {item.format("D")}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [handleDatePress, selectedDate, theme]
  );

  return (
    <View className="justify-center pt-3 pb-6 flex-row" style={{ gap: GAP }}>
      {dates.map((date) => {
        return renderItem({ item: date });
      })}
    </View>
  );
};

export default DatePicker;
