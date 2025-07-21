import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { Dimensions, View } from "react-native";
import PieChart, { Slice } from "react-native-pie-chart";

interface SuccessFailDonutProps {
  done: number;
  skipped: number;
  color: string;
}

const DOT_COLORS = ["#e5e7eb", Colors["red-500"]];
const screenWidth = Dimensions.get("window").width;
const chartWidth = Math.min(screenWidth * 0.6, 220);
const RADIUS = chartWidth / 2;
const INNER_RADIUS = RADIUS * 0.7;
const LABEL_RADIUS = (RADIUS + INNER_RADIUS) / 2;

function getLabelPosition(
  startAngle: number,
  endAngle: number,
  radius: number
) {
  // Subtract 90 degrees to align with 12 o'clock start
  const angle = (startAngle + endAngle) / 2 - 90;
  const rad = (angle * Math.PI) / 180;
  return {
    left: RADIUS + radius * Math.cos(rad) - 16, // -16 to center larger text
    top: RADIUS + radius * Math.sin(rad) - 16, // -16 to center larger text
  };
}

const SuccessFailDonut: React.FC<SuccessFailDonutProps> = ({
  done,
  skipped,
  color,
}) => {
  const { theme } = usePreferredColorTheme();
  const total = done + skipped;
  const series = [
    { value: done, color: color },
    { value: skipped, color: DOT_COLORS[1] },
  ] as Slice[];

  // Calculate angles for each slice
  let startAngle = 0;
  const angles = series.map((s) => {
    const angle = (s.value / (total || 1)) * 360;
    const res = { start: startAngle, end: startAngle + angle };
    startAngle += angle;
    return res;
  });

  return (
    <View
      className={cn(
        "p-4 w-full items-center rounded-xl",
        theme === "dark" ? "bg-gray-900" : "bg-white"
      )}
    >
      <View
        style={{ width: chartWidth, height: chartWidth, position: "relative" }}
      >
        <PieChart
          series={series.map((value) => ({
            value: value.value,
            color: value.color,
          }))}
          widthAndHeight={chartWidth}
          cover={0.7}
        />
        {/* Overlay numbers on the ring */}
        {series.map((s, i) => {
          if (s.value === 0) return null;
          const pos = getLabelPosition(
            angles[i].start,
            angles[i].end,
            LABEL_RADIUS
          );
          return (
            <InterText
              key={i}
              className="absolute font-bold text-base"
              style={{
                color: "white",
                fontWeight: "bold",
                left: pos.left,
                top: pos.top,
                width: 32,
                height: 32,
                textAlign: "center",
                lineHeight: 32,
                fontSize: 16,
              }}
            >
              {s.value}
            </InterText>
          );
        })}
      </View>
      <View className="flex-row justify-center mt-3">
        <View className="flex-row items-center mx-3">
          <View
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: color }}
          />
          <InterText className="text-xs">Done</InterText>
        </View>
        <View className="flex-row items-center mx-3">
          <View
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: DOT_COLORS[1] }}
          />
          <InterText className="text-xs">Failed</InterText>
        </View>
      </View>
    </View>
  );
};

export default SuccessFailDonut;
