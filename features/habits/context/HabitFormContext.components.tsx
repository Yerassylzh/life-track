import ModalBottomSheet from "@/components/ModalBottomSheet";
import { ColorPalette } from "@/lib/colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RefObject } from "react";
import { Pressable, View } from "react-native";
import ColorButton from "../components/form/ColorButton";
import DynamicIcon from "../components/ui/DynamicIcon";
import { HabitIconNameType, habitIcons } from "../lib/icons";
import { useHabitForm } from "./HabitFormContext";

export function ColorPickerBottomSheet({
  ref,
}: {
  ref: RefObject<BottomSheetModal | null>;
}) {
  const { colorIndex, setColorIndex } = useHabitForm();

  return (
    <ModalBottomSheet ref={ref}>
      <View className="pb-10 flex-row flex-wrap items-center justify-start gap-3">
        {ColorPalette.map((color, index) => (
          <ColorButton
            key={index}
            backgroundColor={color}
            isSelected={colorIndex === index}
            onPress={() => {
              ref.current?.dismiss();
              setColorIndex(index);
            }}
          />
        ))}
      </View>
    </ModalBottomSheet>
  );
}

export function IconPickerBottomSheet({
  ref,
}: {
  ref: RefObject<BottomSheetModal | null>;
}) {
  const { colorIndex, setIconName } = useHabitForm();

  return (
    <ModalBottomSheet ref={ref}>
      <View className="pb-10 flex-row flex-wrap items-center justify-start gap-3">
        {habitIcons.map((name: HabitIconNameType, index) => (
          <Pressable
            key={index}
            className="p-1"
            onPress={() => {
              ref.current?.dismiss();
              setIconName(name);
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
