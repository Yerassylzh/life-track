import { Colors } from "@/lib/colors";
import React, { useEffect } from "react";
import {
  Text,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  label: string;
  icon: (color: string) => React.ReactNode;
  isFocused: boolean;
} & TouchableWithoutFeedbackProps;

export default function TabBarButton({
  label,
  icon,
  isFocused,
  ...rest
}: Props) {
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = withSpring(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused, animationProgress]);

  const gapStyle = useAnimatedStyle(() => ({
    gap: 5 * animationProgress.value,
  }));

  return (
    <TouchableWithoutFeedback {...rest} className="flex-1">
      <Animated.View
        style={gapStyle}
        className="flex-1 items-center justify-center py-[15px]"
      >
        {icon(isFocused ? Colors.primary : Colors["gray-500"])}
        {isFocused && (
          <Text
            style={{
              color: isFocused ? Colors.primary : Colors["gray-500"],
            }}
          >
            {label}
          </Text>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
