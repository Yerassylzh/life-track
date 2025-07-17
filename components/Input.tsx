import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { TextInput, View } from "react-native";
import InterText from "./InterText";

type Props = {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  error?: string;
  useBottomSheetTextInput?: boolean;
  className?: string;
  bgColor?: string;
};

export default function Input({
  placeholder,
  onChangeText,
  value,
  error,
  useBottomSheetTextInput,
  className,
  bgColor,
}: Props) {
  const { theme } = usePreferredColorTheme();

  const TextInputWidget = useMemo(
    () => (useBottomSheetTextInput ? BottomSheetTextInput : TextInput),
    [useBottomSheetTextInput]
  );

  return (
    <View className="gap-1">
      <View
        className="p-1 rounded-2xl"
        style={{
          backgroundColor: bgColor
            ? bgColor
            : theme === "light"
              ? Colors["gray-100"]
              : Colors["gray-900"],
        }}
      >
        <TextInputWidget
          placeholderTextColor={
            theme === "light" ? Colors["gray-700"] : Colors["gray-300"]
          }
          cursorColor={Colors.primary}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          className={cn("p-4 rounded-xl text-lg font-inter", className)}
          style={{ color: theme === "light" ? "black" : "white" }}
        />
      </View>
      {error && (
        <InterText className="text-red-500 text-xs ml-3">{error}</InterText>
      )}
    </View>
  );
}
