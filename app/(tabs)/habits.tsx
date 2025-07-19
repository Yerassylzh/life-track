import AppBackground from "@/components/AppBackground";
import CreateNewHabitButton from "@/features/habits/components/CreateNewHabitButton";
import HabitReviewPeriodFilter from "@/features/habits/components/HabitReviewPeriodFilter";
import HabitsListDaily from "@/features/habits/components/HabitsListDaily";
import HabitsListOverall from "@/features/habits/components/HabitsListOverall";
import HabitsListWeekly from "@/features/habits/components/HabitsListWeekly";
import Header from "@/features/habits/components/Header";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

function Habits() {
  const [periodFilterIndex, setPeriodFilterIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // All components are pre-mounted
  const components = [
    { Component: HabitsListDaily, key: "daily" },
    { Component: HabitsListWeekly, key: "weekly" },
    { Component: HabitsListOverall, key: "overall" },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -periodFilterIndex * screenWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [periodFilterIndex, slideAnim, fadeAnim]);

  return (
    <AppBackground className="relative">
      <Header />
      <HabitReviewPeriodFilter
        selectedIndex={periodFilterIndex}
        onSelect={setPeriodFilterIndex}
      />

      <View style={{ flex: 1, overflow: "hidden" }}>
        <Animated.View
          style={{
            flexDirection: "row",
            width: screenWidth * components.length,
            flex: 1,
            transform: [{ translateX: slideAnim }],
            opacity: fadeAnim,
          }}
        >
          {components.map(({ Component, key }, index) => (
            <View
              key={key}
              style={{
                width: screenWidth,
                flex: 1,
                pointerEvents: index === periodFilterIndex ? "auto" : "none",
              }}
            >
              <Component />
            </View>
          ))}
        </Animated.View>
      </View>
      <CreateNewHabitButton />
    </AppBackground>
  );
}

export default React.memo(Habits);
