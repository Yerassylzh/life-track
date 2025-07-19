import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { ColorPalette, Colors } from "@/lib/colors";
import React, { useCallback } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import { useHabitForm } from "../context/HabitFormContext";

export default function FillRepeatTypeMonthly() {
  return (
    <View className="flex-1 gap-3">
      <InterText>On these days</InterText>
      <SimpleCalendar />
    </View>
  );
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const PADDING = 15 + 14 + 14 + 15;
const MARGIN = 6 * 7;
const ITEM_WIDTH = (SCREEN_WIDTH - PADDING - MARGIN) / 7;

const TOTAL_DAYS = 31;
const NUM_COLUMNS = 7;

function SimpleCalendar() {
  const { theme } = usePreferredColorTheme();
  const { monthlyDays, setMonthlyDays, colorIndex } = useHabitForm();

  const toggleDay = useCallback(
    (day: number) => {
      setMonthlyDays((prev) => {
        const result = prev.includes(day)
          ? prev.filter((d) => d !== day)
          : [...prev, day];
        if (result.length === 0) {
          return prev;
        }
        return result;
      });
    },
    [setMonthlyDays]
  );

  const renderItem = useCallback(
    ({ item }: { item: number }) => {
      const isSelected = monthlyDays.includes(item);

      return (
        <Pressable
          style={[
            styles.dayContainer,
            {
              backgroundColor: isSelected
                ? ColorPalette[colorIndex]
                : theme === "light"
                  ? Colors["gray-100"]
                  : Colors["gray-700"],
            },
          ]}
          onPress={() => {
            toggleDay(item);
            Vibration.vibrate(5);
          }}
        >
          <Text style={{ color: isSelected ? "white" : "black" }}>{item}</Text>
        </Pressable>
      );
    },
    [toggleDay, monthlyDays, colorIndex, theme]
  );

  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);

  return (
    <FlatList
      data={days}
      renderItem={renderItem}
      keyExtractor={(item) => item.toString()}
      numColumns={NUM_COLUMNS}
      scrollEnabled={false}
      contentContainerStyle={styles.calendarContainer}
    />
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    alignItems: "flex-start",
  },
  dayContainer: {
    width: ITEM_WIDTH,
    aspectRatio: 1,
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});
