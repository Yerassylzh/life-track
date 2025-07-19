import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import React from "react";
import { TextInput, View } from "react-native";
import InterText from "../ui/InterText";

type Props = {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  error?: string;
};

export default function LongInput({
  placeholder,
  onChangeText,
  value,
  error,
}: Props) {
  const { theme } = usePreferredColorTheme();

  return (
    <View
      className="p-1 rounded-2xl"
      style={{
        backgroundColor:
          theme === "light" ? Colors["gray-100"] : Colors["gray-900"],
      }}
    >
      <TextInput
        multiline
        style={{
          height: 100,
          textAlignVertical: "top",
          color: theme === "light" ? "black" : "white",
        }}
        placeholder={placeholder}
        placeholderTextColor={
          theme === "light" ? Colors["gray-700"] : Colors["gray-300"]
        }
        cursorColor={Colors.primary}
        className="p-4 rounded-xl text-lg font-inter"
        onChangeText={onChangeText}
        value={value}
      />
      {error && <InterText className="text-red-500 text-sm">{error}</InterText>}
    </View>
  );
}
