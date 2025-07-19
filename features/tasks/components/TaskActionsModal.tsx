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
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Pressable, PressableProps, View } from "react-native";
import TaskDeletionConfirmationModal from "./TaskDeletionConfirmationModal";

type Props = {
  task: Task;
} & ModalBottomSheetProps;

export default function TaskActionsModal({ task, ref, ...rest }: Props) {
  const deletionConfirmationModalRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <ModalBottomSheet
        ref={ref}
        {...rest}
        handleIndicatorStyle={{ display: "none" }}
        paddingY={10}
        className="pt-0 pb-10"
      >
        <View className="gap-4">
          <TaskActionHeader task={task} />
          <View className="gap-2">
            <ActivityOption
              name="edit"
              iconName="Pencil"
              onPress={() => {
                ref?.current?.close();
                router.navigate({
                  pathname: `/task/edit/[id]`,
                  params: { id: task.id },
                });
              }}
            />
            <ActivityOption
              customColor={Colors["red-500"]}
              name="delete"
              iconName="Trash2"
              onPress={() => {
                ref?.current?.close();
                deletionConfirmationModalRef.current?.present();
              }}
            />
          </View>
        </View>
      </ModalBottomSheet>
      <TaskDeletionConfirmationModal
        task={task}
        ref={deletionConfirmationModalRef}
      />
    </>
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
