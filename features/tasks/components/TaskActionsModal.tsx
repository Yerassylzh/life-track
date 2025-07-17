import ActivityLabel from "@/components/ActivityLabel";
import InterText from "@/components/InterText";
import ModalBottomSheet, {
  ModalBottomSheetProps,
} from "@/components/ModalBottomSheet";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Task } from "@/db/schema";
import DynamicIcon from "@/features/habits/components/DynamicIcon";
import { Colors } from "@/lib/colors";
import { dateToYMD } from "@/lib/date";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { Pressable, PressableProps, View } from "react-native";

type Props = {
  task: Task;
} & ModalBottomSheetProps;

export default function TaskActionsModal({ task, ref, ...rest }: Props) {
  return (
    <ModalBottomSheet
      ref={ref}
      {...rest}
      handleIndicatorStyle={{ display: "none" }}
      paddingY={10}
      className="pt-0 pb-10"
    >
      <View className="gap-3">
        <TaskActionHeader task={task} />
        <ActivityOption name="edit" iconName="Pencil" />
        <ActivityOption
          customColor={Colors["red-500"]}
          name="edit"
          iconName="Pencil"
        />
      </View>
    </ModalBottomSheet>
  );
}

type ActivityOptionProps = {
  customColor?: string;
  name: string;
  iconName: string;
} & PressableProps;

function ActivityOption({
  customColor,
  iconName,
  name,
  className,
  ...rest
}: ActivityOptionProps) {
  return (
    <Pressable className={cn("py-3 px-2 flex-row gap-3", className)} {...rest}>
      <DynamicIcon size={20} name={iconName} />
      <InterText className={customColor ? `text-[${customColor}]` : ""}>
        {name}
      </InterText>
    </Pressable>
  );
}

function TaskActionHeader({ task }: { task: Task }) {
  const { theme } = usePreferredColorTheme();
  return (
    <View className="flex-row items-center justify-between">
      <View className="gap-1">
        <InterText className="text-xl">{task.name}</InterText>
        <ActivityLabel
          color={Colors.primary}
          text={dateToYMD(task.targetDate)}
        />
      </View>
      <View
        className={cn(
          "w-[40px] h-[40px] bg-gray-100 rounded-xl items-center justify-center",
          theme === "dark" && "bg-gray-900"
        )}
      >
        <DynamicIcon color={Colors.primary} size={22} name={"Clock"} />
      </View>
    </View>
  );
}
