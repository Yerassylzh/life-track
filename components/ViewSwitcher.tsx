import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import React, {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
} from "react-native-reanimated";
import AppLoading from "./AppLoading";

// --- Constants ---
const PADDING = 16;
const TAB_SWITCH_ANIMATION_CONFIG = {
  damping: 15,
  stiffness: 120,
  mass: 0.9,
};
const { width: screenWidth } = Dimensions.get("window");

// --- Types ---
type ViewsConfig = {
  [key: string]: () => Promise<{ default: ComponentType<any> }>;
};

type ViewSwitcherProps = {
  viewsConfig: ViewsConfig;
  activeView: string;
  onSelect: (viewKey: string) => void;
  elementWidth?: number;
};

type SwitcherTabsProps = {
  views: string[];
  activeView: string;
  onSelect: (viewKey: string) => void;
  onTabLayout: (event: LayoutChangeEvent) => void;
  tabIndicatorStyle: Record<string, unknown>;
  elementWidth: number;
};

type ViewContainerProps = {
  components: {
    component: ComponentType<any> | null;
    loading: boolean;
    error: boolean;
  }[];
  selectedIndex: number;
  animatedStyle: Record<string, unknown>;
};

// --- Main Component ---

export default function ViewSwitcher({
  viewsConfig,
  activeView,
  onSelect,
  elementWidth,
}: ViewSwitcherProps) {
  const viewKeys = useMemo(() => Object.keys(viewsConfig), [viewsConfig]);
  const finalElementWidth =
    elementWidth || screenWidth / viewKeys.length - PADDING;

  // State to hold the actual loaded components (not lazy components)
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState<
    {
      component: ComponentType<any> | null;
      loading: boolean;
      error: boolean;
    }[]
  >(() =>
    viewKeys.map(() => ({ component: null, loading: true, error: false }))
  );

  // --- Component Loading ---
  useEffect(() => {
    // Load all components immediately and mount them
    const loadAllComponents = async () => {
      const loadedComponents = await Promise.allSettled(
        viewKeys.map(async (viewKey, index) => {
          try {
            const moduleExport = await viewsConfig[viewKey]();
            return {
              index,
              component: moduleExport.default,
              loading: false,
              error: false,
            };
          } catch (error) {
            console.error(`Failed to load component for ${viewKey}:`, error);
            return {
              index,
              component: null,
              loading: false,
              error: true,
            };
          }
        })
      );

      // Update components state with loaded results
      setComponents((prevComponents) => {
        const newComponents = [...prevComponents];
        loadedComponents.forEach((result) => {
          if (result.status === "fulfilled") {
            newComponents[result.value.index] = {
              component: result.value.component,
              loading: result.value.loading,
              error: result.value.error,
            };
          } else {
            // Handle rejected promise
            const index = loadedComponents.indexOf(result);
            if (index !== -1) {
              newComponents[index] = {
                component: null,
                loading: false,
                error: true,
              };
            }
          }
        });
        return newComponents;
      });
      setLoading(false);
    };

    loadAllComponents();
  }, [viewsConfig, viewKeys]);

  // --- Animation Hooks ---
  const tabIndicatorX = useSharedValue(PADDING);
  const viewContainerX = useSharedValue(0); // For sliding views
  const tabHeight = useSharedValue(0);
  const activeViewIndex = viewKeys.indexOf(activeView);

  // --- Animated Styles ---
  const tabIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabIndicatorX.value }],
    height: tabHeight.value,
    width: finalElementWidth,
  }));

  const viewContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: viewContainerX.value }],
  }));

  // --- Callbacks and Effects for Animations ---
  const handleTabLayout = useCallback(
    (event: LayoutChangeEvent) => {
      // Set the indicator height once on layout.
      if (tabHeight.value === 0) {
        tabHeight.value = event.nativeEvent.layout.height;
      }
    },
    [tabHeight]
  );

  useEffect(() => {
    const targetIndicatorX = activeViewIndex * finalElementWidth + PADDING;
    tabIndicatorX.value = withSpring(
      targetIndicatorX,
      TAB_SWITCH_ANIMATION_CONFIG
    );

    // Animate the view container as well
    viewContainerX.value = withSpring(
      -activeViewIndex * screenWidth,
      TAB_SWITCH_ANIMATION_CONFIG
    );
  }, [activeViewIndex, finalElementWidth, tabIndicatorX, viewContainerX]);

  return (
    <View style={styles.flexOne}>
      <SwitcherTabs
        views={viewKeys}
        activeView={activeView}
        onSelect={onSelect}
        onTabLayout={handleTabLayout}
        tabIndicatorStyle={tabIndicatorStyle}
        elementWidth={finalElementWidth}
      />
      {loading ? (
        <AppLoading />
      ) : (
        <ViewContainer
          components={components}
          selectedIndex={activeViewIndex}
          animatedStyle={viewContainerAnimatedStyle}
        />
      )}
    </View>
  );
}

// --- Sub-components ---

/**
 * Renders the tappable tabs for switching views.
 */
const SwitcherTabs: React.FC<SwitcherTabsProps> = React.memo(
  ({
    views,
    activeView,
    onSelect,
    onTabLayout,
    tabIndicatorStyle,
    elementWidth,
  }) => {
    const { theme } = usePreferredColorTheme();
    const indicatorBackgroundColor =
      theme === "dark" ? Colors["gray-800"] : "white";
    const selectedIndex = views.indexOf(activeView);

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
              key={view}
              className="py-2.5 items-center justify-center"
              style={{ width: elementWidth }}
              onLayout={onTabLayout}
              onPress={() => onSelect(view)}
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
        {components.map(({ component: Component, loading, error }, index) => (
          <View
            key={index}
            style={[styles.componentView, { width: screenWidth }]}
            pointerEvents={index === selectedIndex ? "auto" : "none"}
          >
            {loading ? null : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load component</Text>
              </View>
            ) : Component ? (
              <Component />
            ) : (
              <AppLoading />
            )}
          </View>
        ))}
      </Animated.View>
    </View>
  )
);
ViewContainer.displayName = "ViewContainer";

// --- Styles ---
const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewContainer: {
    flex: 1,
    overflow: "hidden",
  },
  componentView: {
    flex: 1,
  },
  animatedContainer: {
    flexDirection: "row",
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
