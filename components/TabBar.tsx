import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { lazy } from "react";
import { View } from "react-native";
import TabBarButton from "./TabBarButton";

lazy(() => import("@/app/(tabs)/home"));
lazy(() => import("@/app/(tabs)/habits"));
lazy(() => import("@/app/(tabs)/tasks"));
lazy(() => import("@/app/(tabs)/journal"));

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

// import Habits from "@/app/(tabs)/habits";
// import Home from "@/app/(tabs)/home";
// import Journal from "@/app/(tabs)/journal";
// import Tasks from "@/app/(tabs)/tasks";
// import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
// import { cn } from "@/lib/tailwindClasses";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import Feather from "@expo/vector-icons/Feather";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
// import React, { useMemo, useState } from "react";
// import { View } from "react-native";
// import Animated from "react-native-reanimated";
// import TabBarButton from "./TabBarButton";

// export default function TabBar({
//   state,
//   descriptors,
//   navigation,
// }: BottomTabBarProps) {
//   const { theme } = usePreferredColorTheme();
//   type RouteName = "home" | "habits" | "tasks" | "journal";

//   const icons: Record<RouteName, (color: string) => React.ReactNode> = {
//     home: (color: string) => <Feather name="home" size={24} color={color} />,
//     habits: (color: string) => (
//       <MaterialIcons name="event-repeat" size={24} color={color} />
//     ),
//     tasks: (color: string) => (
//       <MaterialIcons name="checklist" size={24} color={color} />
//     ),
//     journal: (color: string) => (
//       <AntDesign name="book" size={24} color={color} />
//     ),
//   };

//   const [currentRoute, setCurrentRoute] = useState<RouteName>("home");

//   const Components = useMemo(() => {
//     return [
//       {
//         routeName: "home",
//         Component: Home,
//       },
//       {
//         routeName: "habits",
//         Component: Habits,
//       },
//       {
//         routeName: "tasks",
//         Component: Tasks,
//       },
//       {
//         routeName: "journal",
//         Component: Journal,
//       },
//     ];
//   }, []);

//   return (
//     <View style={{ flex: 1, position: "relative" }}>
//       {Components.map(({ routeName, Component }) => {
//         return (
//           <Animated.View
//             key={routeName}
//             style={{ opacity: routeName === currentRoute ? 1 : 0 }}
//           >
//             <Component />
//           </Animated.View>
//         );
//       })}
//       <View
//         style={{
//           flexDirection: "row",
//         }}
//         className={cn(
//           "absolute bottom-[25px] items-center justify-evenly mx-[25px] rounded-full shadow-md",
//           "bg-gray-900",
//           theme === "light" && "bg-white"
//         )}
//       >
//         {state.routes.map((route, index) => {
//           const { options } = descriptors[route.key];
//           const label =
//             options.tabBarLabel !== undefined
//               ? options.tabBarLabel
//               : options.title !== undefined
//                 ? options.title
//                 : route.name;

//           const isFocused = state.index === index;

//           const onPress = () => {
//             // const event = navigation.emit({
//             //   type: "tabPress",
//             //   target: route.key,
//             //   canPreventDefault: true,
//             // });
//             // if (!isFocused && !event.defaultPrevented) {
//             //   navigation.navigate(route.name, route.params);
//             // }
//             setCurrentRoute(route.name as RouteName);
//           };

//           const onLongPress = () => {
//             navigation.emit({
//               type: "tabLongPress",
//               target: route.key,
//             });
//           };

//           return (
//             <TabBarButton
//               key={index}
//               label={label as string}
//               icon={icons[route.name as RouteName]}
//               isFocused={isFocused}
//               onPress={onPress}
//               onLongPress={onLongPress}
//               className="flex-1 items-center justify-center"
//             />
//           );
//         })}
//       </View>
//     </View>
//   );
// }
