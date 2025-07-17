import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import React, { useCallback, useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  views: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  elementWidth?: number;
};

type DimensionsType = {
  width: number;
  height: number;
};

const PADDING = 16;

export default function ViewSwitcher({
  views,
  selectedIndex,
  onSelect,
  elementWidth = 100,
}: Props) {
  const { theme } = usePreferredColorTheme();

  const [dimensions, setDimensions] = useState<DimensionsType | null>(null);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const newDimensions = {
        width: elementWidth,
        height: event.nativeEvent.layout.height,
      };
      if (newDimensions !== dimensions) {
        setDimensions(newDimensions);
      }
    },
    [dimensions, elementWidth]
  );

  const animatedX = useSharedValue(PADDING);

  useEffect(() => {
    animatedX.value = withSpring(selectedIndex * elementWidth, {
      duration: 500,
    });
  }, [selectedIndex, animatedX, elementWidth]);

  const animatedXStyle = useAnimatedStyle(() => {
    return {
      left: animatedX.value + PADDING,
    };
  });

  return (
    <View
      className={cn(
        "flex flex-row border-b border-b-gray-100 pb-2.5 pt-4 px-4 relative",
        theme === "dark" && "border-b-gray-900"
      )}
    >
      <Animated.View
        className={"absolute top-4 rounded-full"}
        style={[
          animatedXStyle,
          { backgroundColor: theme === "dark" ? Colors["gray-800"] : "white" },
          dimensions !== null
            ? { width: dimensions.width, height: dimensions.height }
            : {},
        ]}
      />
      {views.map((view, index) => {
        return (
          <Pressable
            key={index}
            className={cn("py-2.5 flex items-center justify-center")}
            style={{ width: elementWidth }}
            onLayout={onLayout}
            onPress={() => onSelect(index)}
          >
            <Text
              className={cn(
                "font-inter font-bold text-gray-400 text-lg",
                theme === "dark" && "text-gray-600",
                index === selectedIndex &&
                  (theme === "dark" ? "text-white" : "text-black")
              )}
            >
              {view}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
