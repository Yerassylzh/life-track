import ActivityLabel from "@/components/ActivityLabel";
import CompleteButtom from "@/components/CompleteButton";
import InterText from "@/components/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Task } from "@/db/schema";
import DynamicIcon from "@/features/habits/components/DynamicIcon";
import { cn } from "@/lib/tailwindClasses";
import { Pressable, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export type TaskBoxProps = {
  hasBottomBorder?: boolean;
  onPress: () => void;
  task: Task;
  hasLabel?: boolean;
};

export default function TaskBox({
  onPress,
  task,
  hasLabel,
  hasBottomBorder,
}: TaskBoxProps) {
  const { theme } = usePreferredColorTheme();

  const isCompleted = task.completedAt !== null;

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex flex-row items-center justify-between py-3.5",
        hasBottomBorder && "border-b",
        hasBottomBorder &&
          (theme === "dark" ? "border-b-gray-800" : "border-b-gray-200")
      )}
    >
      <View className="flex-row gap-4 items-center justify-between">
        <View
          className={cn(
            "w-[40px] h-[40px] bg-gray-100 rounded-xl items-center justify-center",
            theme === "dark" && "bg-gray-900"
          )}
        >
          <DynamicIcon color={Colors.primary} size={22} name="Clock" />
        </View>
        <View className="flex flex-col justify-between items-start h-[37px]">
          <InterText className={cn("text-base")}>{task.name}</InterText>
          {hasLabel && <ActivityLabel color={Colors.primary} text={"Task"} />}
        </View>
      </View>
      <CompleteButtom isCompleted={isCompleted} />
    </Pressable>
  );
}
