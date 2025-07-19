import ModalBottomSheet from "@/components/ModalBottomSheet";
import { ColorPalette } from "@/lib/colors";
import React from "react";
import { Pressable, View } from "react-native";
import { useHabitForm } from "../context/HabitFormContext";
import { HabitIconNameType, habitIcons } from "../lib/icons";
import DynamicIcon from "./DynamicIcon";

export default function IconPickerBottomSheet() {
  const { iconPickerSheetRef, setIconName, colorIndex } = useHabitForm();

  return (
    <ModalBottomSheet ref={iconPickerSheetRef}>
      <View className="pb-10 flex-row flex-wrap items-center justify-start gap-3">
        {habitIcons.map((name: HabitIconNameType, index) => (
          <Pressable
            key={index}
            className="p-1"
            onPress={() => {
              setIconName(name);
              iconPickerSheetRef.current?.close();
            }}
          >
            <DynamicIcon
              name={name}
              size={30}
              color={ColorPalette[colorIndex]}
            />
          </Pressable>
        ))}
      </View>
    </ModalBottomSheet>
  );
}
