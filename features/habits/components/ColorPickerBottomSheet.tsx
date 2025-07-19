import ModalBottomSheet from "@/components/ModalBottomSheet";
import { ColorPalette } from "@/lib/colors";
import React from "react";
import { View } from "react-native";
import { useHabitForm } from "../context/HabitFormContext";
import ColorButton from "./ColorButton";

export default function ColorPickerBottomSheet() {
  const { colorPickerSheetRef, colorIndex, setColorIndex } = useHabitForm();

  return (
    <ModalBottomSheet ref={colorPickerSheetRef}>
      <View className="pb-10 flex-row flex-wrap items-center justify-start gap-3">
        {ColorPalette.map((color, index) => (
          <ColorButton
            key={index}
            backgroundColor={color}
            isSelected={colorIndex === index}
            onPress={() => {
              setColorIndex(index);
              colorPickerSheetRef.current?.close();
            }}
          />
        ))}
      </View>
    </ModalBottomSheet>
  );
}
