import { Colors } from "@/lib/colors";
import React from "react";
import {
  Text,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from "react-native";
import Animated from "react-native-reanimated";

type Props = {
  label: string;
  icon: (color: string) => React.ReactNode;
  isFocused: boolean;
} & TouchableWithoutFeedbackProps;

export default function TabBarButton({
  label,
  icon,
  isFocused,
  ...rest
}: Props) {
  return (
    <TouchableWithoutFeedback {...rest} className="flex-1">
      <Animated.View className="flex-1 items-center justify-center py-[10px] gap-1">
        {icon(isFocused ? Colors.primary : Colors["gray-500"])}
        <Text
          style={{
            color: isFocused ? Colors.primary : Colors["gray-500"],
          }}
          className="text-sm"
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
