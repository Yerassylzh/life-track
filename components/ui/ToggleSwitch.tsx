import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import React, { useCallback, useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, Vibration } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  value: boolean;
  defaultValue?: boolean;
  onChange: (value: boolean) => void;
};

const WIDTH = 55;
const HEIGHT = 33;
const PADDING = 3;

export default function ToggleSwitch({ value, defaultValue, onChange }: Props) {
  const { theme } = usePreferredColorTheme();
  const [trackWidth, setTrackWidth] = useState<number | undefined>(undefined);

  const animatedProgress = useSharedValue(
    defaultValue ? Number(defaultValue) : 0
  );

  const animatedTrackStyle = useAnimatedStyle(() => {
    if (trackWidth === undefined) {
      return {};
    }
    return {
      left: animatedProgress.value * (WIDTH - trackWidth - PADDING * 2),
    };
  }, [trackWidth]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.height - PADDING * 2);
  }, []);

  useEffect(() => {
    animatedProgress.value = withSpring(Number(value), { duration: 200 });
  }, [value, animatedProgress]);

  return (
    <Pressable
      onLayout={onLayout}
      style={{
        backgroundColor: value
          ? Colors.primary
          : theme === "light"
            ? Colors["gray-300"]
            : Colors["gray-700"],
        width: WIDTH,
        height: HEIGHT,
      }}
      onPress={() => {
        onChange(!value);
        Vibration.vibrate(10);
      }}
      className="rounded-full relative flex flex-row items-center"
    >
      <Animated.View
        style={[
          animatedTrackStyle,
          {
            backgroundColor: theme === "light" ? "white" : "black",
            width: trackWidth,
            aspectRatio: 1,
            marginLeft: PADDING,
          },
        ]}
        className="rounded-full absolute"
      />
    </Pressable>
  );
}
