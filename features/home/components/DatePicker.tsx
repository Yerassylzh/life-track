import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import { FlashList } from "@shopify/flash-list";
import moment, { Moment } from "moment"; // Import Moment type
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dimensions, Text, TouchableWithoutFeedback, View } from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 9;

interface DatePickerProps {
  onDateSelected: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateSelected }) => {
  const [selectedDate, setSelectedDate] = useState<Moment>(() => moment());
  const ref = useRef<FlashList<Moment>>(null);
  const { theme } = usePreferredColorTheme();

  useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollToIndex({
        index: 10,
        animated: true,
        viewPosition: 0.5,
      });
    }, 1000);
  }, []);

  const dates = useMemo(() => {
    const dates: Moment[] = [];
    const today: Moment = moment();

    const delta = 10;

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
    index: number;
  }

  const renderItem = useCallback(
    ({ item }: RenderItemProps) => {
      const isSelected: boolean = item.isSame(selectedDate, "day");

      return (
        <TouchableWithoutFeedback onPress={() => handleDatePress(item)}>
          <View
            className={cn(
              "items-center justify-center py-1 mx-[3px] rounded-xl",
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
              className="text-xs font-medium mb-1"
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
              className="text-xl font-bold"
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
    <View className="h-24 justify-center py-2">
      <FlashList
        ref={ref}
        data={dates}
        renderItem={renderItem}
        estimatedItemSize={20}
        horizontal
        showsHorizontalScrollIndicator={false}
        extraData={[selectedDate, theme]}
      />
    </View>
  );
};

export default DatePicker;
