import ModalBottomSheet, {
  ModalBottomSheetProps,
} from "@/components/ModalBottomSheet";
import ActivityLabel from "@/components/ui/ActivityLabel";
import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import DynamicIcon from "@/features/habits/components/DynamicIcon";
import { Colors } from "@/lib/colors";
import { dateToYMD } from "@/lib/date";
import { cn } from "@/lib/tailwindClasses";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Pressable, PressableProps, View } from "react-native";
import HabitDeletionConfirmationModal from "./HabitDeletionConfirmationModal";

type Props = {
  habit: HabitWithCompletions;
} & ModalBottomSheetProps;

export default function HabitActionsModal({ habit, ref, ...rest }: Props) {
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
          <HabitActionHeader habit={habit} />
          <View className="gap-2">
            <ActivityOption
              name="edit"
              iconName="Pencil"
              onPress={() => {
                ref?.current?.close();
                router.navigate({
                  pathname: `/habit/edit/[id]`,
                  params: { id: habit.id },
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
      <HabitDeletionConfirmationModal
        ref={deletionConfirmationModalRef}
        habit={habit}
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

function HabitActionHeader({ habit }: { habit: HabitWithCompletions }) {
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
