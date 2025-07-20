import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { ColorPalette, Colors } from "@/lib/colors";
import { Dimensions, Pressable, Text, Vibration, View } from "react-native";
import { useHabitForm } from "../../context/HabitFormContext";

const screenDim = Dimensions.get("window");

export default function FillDaily() {
  const { daysOfWeek, setDaysOfWeek } = useHabitForm();

  return (
    <View className="w-full gap-3">
      <InterText>On these days</InterText>
      <View className="flex-row items-center justify-between">
        {Array.from({ length: 7 }).map((_, index: number) => (
          <DayOfWeekBox
            key={index}
            index={index}
            onChange={(value: boolean) => {
              if (!value && daysOfWeek.length === 1) {
                return false;
              }

              if (!value) {
                setDaysOfWeek((prev) => prev.filter((day, _) => day !== index));
              } else {
                setDaysOfWeek((prev) => {
                  return [...prev, index].sort();
                });
              }

              return true;
            }}
          />
        ))}
      </View>
    </View>
  );
}

const dayOfWeekFirstLetters = "MTWTFSS";

function DayOfWeekBox({
  index,
  onChange,
}: {
  index: number;
  onChange: (value: boolean) => boolean;
}) {
  const { theme } = usePreferredColorTheme();
  const { colorIndex, daysOfWeek } = useHabitForm();

  return (
    <Pressable
      onPress={() => {
        const wasSelected = daysOfWeek.includes(index);
        onChange(!wasSelected);
        Vibration.vibrate(5);
      }}
      style={{
        backgroundColor: daysOfWeek.includes(index)
          ? ColorPalette[colorIndex]
          : theme === "light"
            ? Colors["gray-200"]
            : Colors["gray-800"],
        width: screenDim.width / 11,
        height: screenDim.width / 11,
      }}
      className="items-center justify-center rounded-md"
    >
      <Text
        style={{
          color: daysOfWeek.includes(index) ? "white" : Colors["gray-500"],
        }}
        className="font-inter text-sm"
      >
        {dayOfWeekFirstLetters[index]}
      </Text>
    </Pressable>
  );
}
