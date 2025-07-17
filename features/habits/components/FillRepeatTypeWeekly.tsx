import InterText from "@/components/InterText";
import { ColorPalette } from "@/lib/colors";
import { hexToRgba } from "@/lib/hex";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { TouchableOpacity, Vibration, View } from "react-native";
import { useHabitForm } from "../context/HabitFormContext";

export default function FillRepeatTypeWeekly() {
  const { weeklyFreq } = useHabitForm();

  return (
    <View className="w-full flex-row items-center justify-between">
      <View>
        <InterText className="text-lg">Frequency</InterText>
        <InterText className="text-gray-500">
          {weeklyFreq === 7 ? "Every day" : weeklyFreq + " times a week"}
        </InterText>
      </View>
      <View className="flex flex-row gap-4 items-center justify-end">
        <MinusButton />
        <InterText>{weeklyFreq}</InterText>
        <PlusButton />
      </View>
    </View>
  );
}

function PlusButton() {
  const { colorIndex, setWeeklyFreq, weeklyFreq } = useHabitForm();
  return (
    <TouchableOpacity
      style={{
        backgroundColor: hexToRgba(ColorPalette[colorIndex], 0.2),
        opacity: weeklyFreq === 7 ? 0.5 : 1,
      }}
      className="p-3 rounded-xl"
      onPress={() => {
        setWeeklyFreq((prev) => Math.min(7, prev + 1));
        Vibration.vibrate(5);
      }}
    >
      <AntDesign name="plus" size={15} color={ColorPalette[colorIndex]} />
    </TouchableOpacity>
  );
}

function MinusButton() {
  const { colorIndex, setWeeklyFreq, weeklyFreq } = useHabitForm();
  return (
    <TouchableOpacity
      style={{
        backgroundColor: hexToRgba(ColorPalette[colorIndex], 0.2),
        opacity: weeklyFreq === 1 ? 0.5 : 1,
      }}
      className="p-3 rounded-xl"
      onPress={() => {
        setWeeklyFreq((prev) => Math.max(1, prev - 1));
        Vibration.vibrate(5);
      }}
    >
      <AntDesign name="minus" size={15} color={ColorPalette[colorIndex]} />
    </TouchableOpacity>
  );
}
