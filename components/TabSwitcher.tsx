import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import React, { ComponentType } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// --- Constants ---
const VIEW_SLIDE_ANIMATION_DURATION = 300;
const { width: screenWidth } = Dimensions.get("window");

// --- Types ---
type TabSwitcherProps = {
  tabs: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  components: ComponentType<any>[];
};

type SwitcherTabsProps = {
  tabs: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

type ViewContainerProps = {
  components: ComponentType<any>[];
  selectedIndex: number;
  animatedStyle: Record<string, unknown>;
};

// --- Sub-components ---

const SwitcherTabs: React.FC<SwitcherTabsProps> = React.memo(
  ({ tabs, selectedIndex, onSelect }) => {
    return (
      <View className="w-full flex flex-row gap-2 items-center justify-start px-[15px]  border-b-gray-900 pb-2.5 pt-4">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            selected={selectedIndex === index}
            onPress={() => onSelect(index)}
            text={tab}
          />
        ))}
      </View>
    );
  }
);
SwitcherTabs.displayName = "SwitcherTabs";

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

export default function TabSwitcher({
  tabs,
  selectedIndex,
  onSelect,
  components,
}: TabSwitcherProps) {
  const viewContainerX = useSharedValue(0);

  const viewSliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: viewContainerX.value }],
    opacity: withTiming(1, { duration: VIEW_SLIDE_ANIMATION_DURATION / 2 }),
  }));

  React.useEffect(() => {
    const targetViewX = -selectedIndex * screenWidth;
    viewContainerX.value = withTiming(targetViewX, {
      duration: VIEW_SLIDE_ANIMATION_DURATION,
    });
  }, [selectedIndex, viewContainerX]);

  return (
    <View style={styles.flexOne}>
      <SwitcherTabs
        tabs={tabs}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
      />
      <ViewContainer
        components={components}
        selectedIndex={selectedIndex}
        animatedStyle={viewSliderStyle}
      />
    </View>
  );
}

function Tab({
  selected,
  onPress,
  text,
}: {
  selected: boolean;
  onPress: () => void;
  text: string;
}) {
  const { theme } = usePreferredColorTheme();

  return (
    <Pressable
      className={cn(
        "px-3 py-1.5 border border-gray-300 rounded-xl",
        theme === "dark" && "border-gray-700",
        selected && "bg-[rgba(0,149,182,.22)]"
      )}
      onPress={onPress}
    >
      <Text className={cn("font-inter text-sm text-black dark:text-white")}>
        {text}
      </Text>
    </Pressable>
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
