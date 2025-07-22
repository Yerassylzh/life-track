import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import DynamicIcon from "@/features/habits/components/ui/DynamicIcon";
import { Colors } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { Pressable, View } from "react-native";

interface SettingsBoxProps {
  iconName: string;
  title: string;
  value: string;
  onPress?: () => void;
}

const SettingsBox: React.FC<SettingsBoxProps> = ({
  iconName,
  title,
  value,
  onPress,
}) => {
  const { theme } = usePreferredColorTheme();

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "gap-3 flex-row items-center px-4 py-3 border-b border-zinc-200",
        theme === "dark" ? "bg-zinc-900 border-zinc-700" : "bg-white"
      )}
      android_ripple={{ color: "#e5e7eb" }}
    >
      <DynamicIcon
        name={iconName}
        size={22}
        color={Colors.primary}
        className="mr-4"
      />
      <View className="flex-1">
        <InterText
          className={cn(
            "text-base font-medium",
            theme === "dark" ? "text-zinc-100" : "text-zinc-900"
          )}
        >
          {title}
        </InterText>
      </View>
      <InterText
        className={cn(
          "text-sm text-zinc-500 ml-2",
          theme === "dark" ? "text-zinc-400" : "text-zinc-500"
        )}
      >
        {value}
      </InterText>
    </Pressable>
  );
};

export default SettingsBox;
