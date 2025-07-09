import { cn } from "@/lib/tailwindClasses";
import moment, { Moment } from "moment"; // Import Moment type
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Assuming Colors.primary is defined elsewhere in your project.
// For demonstration, I'll define a placeholder Colors object.
// In a real NativeWind project, you'd typically define these in your tailwind.config.js
// and use classes like 'bg-primary' directly. For now, we'll use inline styles with Colors.primary.
const Colors = {
  primary: "#00BCD4", // Example primary color (Cyan)
  text: "#333333",
  background: "#F5F5F5",
  selectedText: "#FFFFFF",
  dayText: "#666666",
};

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 7; // Adjust based on how many items you want to show at once

// Define props interface for DatePicker component
interface DatePickerProps {
  onDateSelected: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateSelected }) => {
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const flatListRef = useRef<FlatList<Moment>>(null);

  // Generate dates for 90 days before and 90 days after the current date
  const generateDates = useCallback((): Moment[] => {
    const dates: Moment[] = [];
    const today: Moment = moment();

    // Add dates before today
    for (let i = 90; i > 0; i--) {
      dates.push(moment(today).subtract(i, "days"));
    }

    // Add today
    dates.push(today);

    // Add dates after today
    for (let i = 1; i <= 90; i++) {
      dates.push(moment(today).add(i, "days"));
    }
    return dates;
  }, []);

  const dates: Moment[] = generateDates();

  // Scroll to today's date on initial load
  useEffect(() => {
    const todayIndex: number = dates.findIndex((date: Moment) =>
      date.isSame(moment(), "day")
    );
    if (todayIndex !== -1 && flatListRef.current) {
      // Use setTimeout to ensure FlatList is rendered before scrolling
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: todayIndex,
          animated: false,
          viewPosition: 0.5,
        });
      }, 100);
    }
  }, [dates]); // Add dates to dependency array to ensure it re-runs if dates change (though unlikely here)

  const handleDatePress = (date: Moment): void => {
    setSelectedDate(date);
    if (onDateSelected) {
      onDateSelected(date.toDate()); // Pass JavaScript Date object
    }
  };

  // Define interface for renderItem props
  interface RenderItemProps {
    item: Moment;
    index: number;
  }

  const renderItem = ({ item }: RenderItemProps) => {
    const isSelected: boolean = item.isSame(selectedDate, "day");

    return (
      <TouchableOpacity
        className={cn(
          "items-center justify-center py-2 mx-1.5 rounded-xl",
          "bg-gray-200 shadow-sm shadow-black/20",
          isSelected ? `bg-[${Colors.primary}]` : ""
        )}
        style={{ width: ITEM_WIDTH }} // Apply calculated width using style prop as NativeWind doesn't handle dynamic width based on calculation
        onPress={() => handleDatePress(item)}
      >
        <Text
          className={cn(
            "text-sm font-medium mb-1",
            isSelected ? "text-white" : "text-gray-600"
          )}
        >
          {item.format("ddd")} {/* Day of the week (e.g., Mon, Tue) */}
        </Text>
        <Text
          className={cn(
            "text-2xl font-bold",
            isSelected ? "text-white" : "text-gray-800"
          )}
        >
          {item.format("D")} {/* Date (e.g., 1, 2, 3) */}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="h-24 bg-gray-100 justify-center py-2">
      <FlatList
        ref={flatListRef}
        data={dates}
        renderItem={renderItem}
        keyExtractor={(item: Moment, index: number) =>
          item.format("YYYY-MM-DD") + index
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={dates.findIndex((date: Moment) =>
          date.isSame(moment(), "day")
        )}
        getItemLayout={(
          data: ArrayLike<Moment> | null | undefined,
          index: number
        ) => ({ length: ITEM_WIDTH, offset: ITEM_WIDTH * index, index })}
      />
    </View>
  );
};

export default DatePicker;

// Example Usage (for your App.js or another component):
/*
import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import DatePicker from './DatePicker'; // Adjust path as needed
import { styled } from 'nativewind'; // Import styled for the App component

const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);

const App: React.FC = () => {
  const handleDateSelection = (date: Date) => {
    console.log('Selected Date:', date);
    // You can update your app's state or perform other actions here
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white pt-12">
      <StyledText className="text-3xl font-bold text-center my-5 text-gray-700">Select a Date</StyledText>
      <DatePicker onDateSelected={handleDateSelection} />
      // Other components of your app
    </StyledSafeAreaView>
  );
};

export default App;
*/
