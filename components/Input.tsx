import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import React from "react";
import { TextInput, View } from "react-native";
import InterText from "./InterText";

type Props = {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  error?: string;
};

export default function Input({
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
        placeholderTextColor={
          theme === "light" ? Colors["gray-700"] : Colors["gray-300"]
        }
        cursorColor={Colors.primary}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        className="p-4 rounded-xl text-lg font-inter"
        style={{ color: theme === "light" ? "black" : "white" }}
      />
      {error && <InterText className="text-red-500 text-sm">{error}</InterText>}
    </View>
  );
}
