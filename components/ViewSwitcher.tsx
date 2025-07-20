import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import React, { ComponentType, useCallback } from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// --- Constants ---
const PADDING = 16;
const TAB_SWITCH_ANIMATION_CONFIG = { damping: 15, stiffness: 120, mass: 0.9 };
const VIEW_SLIDE_ANIMATION_DURATION = 300;
const { width: screenWidth } = Dimensions.get("window");

// --- Types ---
type ViewSwitcherProps = {
  views: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  elementWidth?: number;
  components: ComponentType<any>[];
};

type SwitcherTabsProps = {
  views: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onTabLayout: (event: LayoutChangeEvent) => void;
  tabIndicatorStyle: Record<string, unknown>;
  elementWidth: number;
};

type ViewContainerProps = {
  components: ComponentType<any>[];
  selectedIndex: number;
  animatedStyle: Record<string, unknown>;
};

// --- Sub-components ---

/**
 * Renders the tappable tabs for switching views.
 */
const SwitcherTabs: React.FC<SwitcherTabsProps> = React.memo(
  ({
    views,
    selectedIndex,
    onSelect,
    onTabLayout,
    tabIndicatorStyle,
    elementWidth,
  }) => {
    const { theme } = usePreferredColorTheme();
    const indicatorBackgroundColor =
      theme === "dark" ? Colors["gray-800"] : "white";

    return (
      <View
        className={cn(
          "flex-row relative border-b pb-2.5 pt-4 px-4 items-center justify-start",
          theme === "dark" ? "border-b-gray-900" : "border-b-gray-100"
        )}
      >
        <Animated.View
          className="absolute top-4 rounded-full"
          style={[
            tabIndicatorStyle,
            { backgroundColor: indicatorBackgroundColor },
          ]}
        />
        {views.map((view, index) => {
          const isSelected = index === selectedIndex;
          const textColor = isSelected
            ? theme === "dark"
              ? "text-white"
              : "text-black"
            : theme === "dark"
              ? "text-gray-600"
              : "text-gray-400";

          return (
            <Pressable
              key={index}
              className="py-2.5 items-center justify-center"
              style={{ width: elementWidth }}
              onLayout={onTabLayout}
              onPress={() => onSelect(index)}
            >
              <Text className={cn("font-inter font-bold text-lg", textColor)}>
                {view}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }
);
SwitcherTabs.displayName = "SwitcherTabs";

/**
 * Renders the container that slides between different views.
 */
const ViewContainer: React.FC<ViewContainerProps> = React.memo(
  ({ components, selectedIndex, animatedStyle }) => (
    <View style={styles.viewContainer}>
      <Animated.View
        style={[
          styles.animatedContainer,
          { width: screenWidth * components.length },
          animatedStyle,
        ]}
      >
        {components.map((Component, index) => (
          <View
            key={index}
            style={[styles.componentView, { width: screenWidth }]}
            pointerEvents={index === selectedIndex ? "auto" : "none"}
          >
            <Component />
          </View>
        ))}
      </Animated.View>
    </View>
  )
);
ViewContainer.displayName = "ViewContainer";

// --- Main Component ---

export default function ViewSwitcher({
  views,
  selectedIndex,
  onSelect,
  elementWidth = screenWidth / views.length - PADDING,
  components,
}: ViewSwitcherProps) {
  // --- Animation Hooks ---
  const tabIndicatorX = useSharedValue(PADDING);
  const tabHeight = useSharedValue(0);
  const viewContainerX = useSharedValue(0);

  // --- Animated Styles ---
  const tabIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabIndicatorX.value }],
    height: tabHeight.value,
    width: elementWidth,
  }));

  const viewSliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: viewContainerX.value }],
    opacity: withTiming(1, { duration: VIEW_SLIDE_ANIMATION_DURATION / 2 }),
  }));

  // --- Callbacks and Effects ---
  const handleTabLayout = useCallback(
    (event: LayoutChangeEvent) => {
      // Set the indicator height once on layout
      if (tabHeight.value === 0) {
        tabHeight.value = event.nativeEvent.layout.height;
      }
    },
    [tabHeight]
  );

  React.useEffect(() => {
    const targetIndicatorX = selectedIndex * elementWidth + PADDING;
    tabIndicatorX.value = withSpring(
      targetIndicatorX,
      TAB_SWITCH_ANIMATION_CONFIG
    );

    const targetViewX = -selectedIndex * screenWidth;
    viewContainerX.value = withTiming(targetViewX, {
      duration: VIEW_SLIDE_ANIMATION_DURATION,
    });
  }, [selectedIndex, elementWidth, tabIndicatorX, viewContainerX]);

  return (
    <View style={styles.flexOne}>
      <SwitcherTabs
        views={views}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        onTabLayout={handleTabLayout}
        tabIndicatorStyle={tabIndicatorStyle}
        elementWidth={elementWidth}
      />
      <ViewContainer
        components={components}
        selectedIndex={selectedIndex}
        animatedStyle={viewSliderStyle}
      />
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    overflow: "hidden",
  },
  animatedContainer: {
    flexDirection: "row",
    flex: 1,
  },
  componentView: {
    flex: 1,
  },
});
