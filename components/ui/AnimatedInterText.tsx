import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { TextProps } from "react-native";
import Animated from "react-native-reanimated";

export default function AnimatedInterText({
  className,
  children,
  ...rest
}: TextProps) {
  const { theme } = usePreferredColorTheme();

  return (
    <Animated.Text
      className={cn(
        "font-inter",
        theme === "dark" ? "text-white" : "text-black",
        className
      )}
      {...rest}
    >
      {children}
    </Animated.Text>
  );
}
