import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import React, { useCallback, useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, Vibration, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useHabitForm } from "../../context/HabitFormContext";

const options = ["Daily", "Weekly", "Monthly"];

export default function ChooseRepeatType() {
  const { theme } = usePreferredColorTheme();
  const { setRepeatType, repeatType } = useHabitForm();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(
      {
        daily: 0,
        weekly: 1,
        monthly: 2,
      }[repeatType]
    );
  }, [repeatType]);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  }, []);

  const animatedX = useSharedValue(3);

  const animatedXStyle = useAnimatedStyle(() => {
    return {
      left: animatedX.value,
    };
  });

  useEffect(() => {
    if (!dimensions?.width) {
      return;
    }

    animatedX.value = withSpring(dimensions.width * selectedIndex, {
      duration: 500,
    });
  }, [selectedIndex, dimensions, animatedX]);

  return (
    <View
      className={cn(
        "w-full flex-row items-center justify-start rounded-lg p-1",
        theme === "light" ? "bg-gray-200" : "bg-gray-800"
      )}
    >
      {dimensions && (
        <Animated.View
          className="absolute rounded-lg ml-1 shadow-md"
          style={[
            {
              width: dimensions.width,
              height: dimensions.height,
              backgroundColor: theme === "light" ? "white" : Colors["gray-900"],
            },
            animatedXStyle,
          ]}
        ></Animated.View>
      )}
      {options.map((option, index) => (
        <Pressable
          key={index}
          className="flex-1 items-center justify-center py-2"
          onLayout={onLayout}
          onPress={() => {
            if (selectedIndex === index) return;
            Vibration.vibrate(5);
            setSelectedIndex(index);
            setRepeatType(
              ["daily", "weekly", "monthly"][index] as
                | "daily"
                | "weekly"
                | "monthly"
            );
          }}
        >
          <InterText
            className={cn(
              "text-sm",
              selectedIndex === index ? "font-bold" : "text-gray-500"
            )}
          >
            {option}
          </InterText>
        </Pressable>
      ))}
    </View>
  );
}
