import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

export default function JournalTextInput({
  value,
  onChangeText,
  placeholder,
}: Props) {
  const { theme } = usePreferredColorTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#222" : "#f3f3f3" },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme === "dark" ? "#aaa" : "#888"}
        style={[styles.input, { color: theme === "dark" ? "#fff" : "#222" }]}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    minHeight: 100,
    fontWeight: "400",
    padding: 0,
  },
});
