import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import React from "react";
import { View } from "react-native";
import ChooseRepeatType from "./form/ChooseRepeatType";
import FillRepeatTypeDetails from "./form/FillRepeatTypeDetails";

export default function ChooseHabitRepeat() {
  const { theme } = usePreferredColorTheme();

  return (
    <View
      style={{
        backgroundColor: theme === "light" ? "white" : Colors["gray-900"],
      }}
      className="gap-7 items-start justify-center rounded-2xl p-4"
    >
      <InterText className="text-lg font-semibold">Repeat</InterText>
      <ChooseRepeatType />
      <FillRepeatTypeDetails />
    </View>
  );
}
