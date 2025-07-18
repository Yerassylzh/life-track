import InterText from "@/components/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function Header() {
  const { theme } = usePreferredColorTheme();

  return (
    <View className="w-full px-[25px] py-[10px] items-center justify-between flex-row">
      <InterText className="font-bold text-[25px]">Habits</InterText>
      <View className="flex-1 flex-row items-center justify-end">
        <Link href="/settings">
          <Feather
            name="settings"
            size={24}
            color={theme === "dark" ? "white" : "black"}
          />
        </Link>
      </View>
    </View>
  );
}
