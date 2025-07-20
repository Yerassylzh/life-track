import ActivityLabel from "@/components/ui/ActivityLabel";
import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import { dateToYMD } from "@/lib/date";
import { cn } from "@/lib/tailwindClasses";
import { Pressable, PressableProps, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import DynamicIcon from "../components/ui/DynamicIcon";

type ActivityOptionProps = {
  customColor?: string;
  name: string;
  iconName: string;
} & PressableProps;

export function ActivityOption({
  customColor,
  iconName,
  name,
  className,
  ...rest
}: ActivityOptionProps) {
  return (
    <Pressable className={cn("py-3 px-2 flex-row gap-3", className)} {...rest}>
      <DynamicIcon
        size={20}
        name={iconName}
        color={customColor || Colors["gray-500"]}
      />
      <InterText customColor={customColor || Colors["gray-500"]}>
        {name}
      </InterText>
    </Pressable>
  );
}

export function HabitActionHeader({ habit }: { habit: HabitWithCompletions }) {
  const { theme } = usePreferredColorTheme();
  return (
    <View className="flex-row items-center justify-between">
      <View className="gap-1">
        <InterText className="text-xl">{habit.name}</InterText>
        <ActivityLabel color={habit.color} text={dateToYMD(new Date())} />
      </View>
      <View
        className={cn(
          "w-[40px] h-[40px] bg-gray-100 rounded-xl items-center justify-center",
          theme === "dark" && "bg-gray-900"
        )}
      >
        <DynamicIcon color={habit.color} size={22} name={habit.iconName} />
      </View>
    </View>
  );
}
