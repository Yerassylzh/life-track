import AnimatedInterText from "@/components/ui/AnimatedInterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { getReadableDate } from "@/lib/date";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDate } from "../context/SelectedDateContext";

const animationDuration = 100;

export default function Header() {
  const { theme } = usePreferredColorTheme();
  const { selectedDate } = useDate();

  const [dateString, setDateString] = React.useState("Today");

  const animationProgress = useSharedValue(1);

  // As soon as selectedDate changes, it will animate transition
  React.useEffect(() => {
    animationProgress.value = withTiming(0.5, { duration: animationDuration });
    const timeout = setTimeout(() => {
      setDateString(getReadableDate(selectedDate));
      animationProgress.value = withTiming(1, { duration: animationDuration });
    }, animationDuration);
    return () => clearTimeout(timeout);
  }, [selectedDate, animationProgress]);

  const dateOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: animationProgress.value,
    };
  });

  return (
    <View className="w-full px-[25px] py-[10px] items-center justify-between flex-row">
      <AnimatedInterText
        style={dateOpacityStyle}
        className="font-bold text-2xl"
      >
        {dateString}
      </AnimatedInterText>
      <View className="flex-1 flex-row items-center justify-end">
        <Link href="/settings">
          <Feather
            name="settings"
            size={24}
            color={theme === "dark" ? "white" : "black"}
          />
        </Link>
      </View>
    </View>
  );
}
