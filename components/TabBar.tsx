import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { View } from "react-native";
import TabBarButton from "./TabBarButton";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { theme } = usePreferredColorTheme();
  type RouteName = "home" | "habits" | "tasks" | "journal";

  const icons: Record<RouteName, (color: string) => React.ReactNode> = {
    home: (color: string) => <Feather name="home" size={24} color={color} />,
    habits: (color: string) => (
      <MaterialIcons name="event-repeat" size={24} color={color} />
    ),
    tasks: (color: string) => (
      <MaterialIcons name="checklist" size={24} color={color} />
    ),
    journal: (color: string) => (
      <AntDesign name="book" size={24} color={color} />
    ),
  };

  return (
    <View
      style={{
        flexDirection: "row",
      }}
      className={cn(
        "absolute bottom-[25px] items-center justify-evenly mx-[25px] rounded-full shadow-md",
        "bg-gray-900",
        theme === "light" && "bg-white"
      )}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={index}
            label={label as string}
            icon={icons[route.name as RouteName]}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 items-center justify-center"
          />
        );
      })}
    </View>
  );
}
