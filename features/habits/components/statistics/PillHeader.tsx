import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { View } from "react-native";

const PillHeader = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  const { theme } = usePreferredColorTheme();
  return (
    <View className="relative flex flex-row items-center justify-center mb-2">
      <View className="absolute left-0 top-0 mr-1">{icon}</View>
      <View
        className={cn(
          "rounded-[10px] px-3 py-1 min-w-[80px] flex items-center justify-center",
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        )}
      >
        <InterText
          className={cn(
            "font-semibold text-center text-[14px]",
            theme === "dark" ? "text-gray-300" : "text-gray-500"
          )}
        >
          {children}
        </InterText>
      </View>
    </View>
  );
};

export default PillHeader;
