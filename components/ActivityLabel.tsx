import InterText from "@/components/InterText";
import { hexToRgba } from "@/lib/hex";
import { cn } from "@/lib/tailwindClasses";
import { View } from "react-native";

export default function ActivityLabel({
  color,
  text,
}: {
  color: string;
  text: string;
}) {
  return (
    <View
      style={{
        backgroundColor: hexToRgba(color, 0.15),
        alignSelf: "flex-start",
      }}
      className={cn("py-[1px] px-1 rounded-md")}
    >
      <InterText className={cn("text-xs")} customColor={hexToRgba(color)}>
        {text}
      </InterText>
    </View>
  );
}
