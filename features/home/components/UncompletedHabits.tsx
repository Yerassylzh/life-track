import Input from "@/components/Input";
import InterText from "@/components/InterText";
import ModalBottomSheet from "@/components/ModalBottomSheet";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import DynamicIcon from "@/features/habits/components/DynamicIcon";
import { useHabits } from "@/features/habits/context/HabitsContext";
import { markHabitAsCompleted } from "@/features/habits/lib/update";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { Colors } from "@/lib/colors";
import { dateToYMD, YMDToDate } from "@/lib/date";
import { cn } from "@/lib/tailwindClasses";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import ActivityLabel from "../../../components/ActivityLabel";
import { useDate } from "../context/SelectedDateContext";
import HabitBox from "./HabitBox";

export default function UncompletedHabits() {
  const { habits, habitsCompletionsManager } = useHabits();
  const { selectedDate } = useDate();
  const date = useMemo(() => dateToYMD(selectedDate), [selectedDate]);

  const filter = useCallback(
    (habit: HabitWithCompletions) => {
      if (YMDToDate(date) < YMDToDate(dateToYMD(habit.createdAt))) {
        return false;
      }
      return (
        !habitsCompletionsManager.get(habit.id)?.isHabitCompletedAt(date) &&
        !habitsCompletionsManager
          .get(habit.id)
          ?.isHabitDoesntNeedToCompleteAt(date)
      );
    },
    [habitsCompletionsManager, date]
  );

  return (
    <>
      {habits.filter(filter).map((habit, index) => (
        <HabitBoxWithCompletionsManager key={index} habit={habit} />
      ))}
    </>
  );
}

function HabitBoxWithCompletionsManager({
  habit,
  allowComplete = true,
}: {
  habit: HabitWithCompletions;
  allowComplete?: boolean;
}) {
  const unitInputRef = useRef<BottomSheetModal>(null);
  const { selectedDate } = useDate();

  return (
    <>
      <HabitBox
        hasBottomBorder={true}
        isCompleted={false}
        habit={habit}
        date={dateToYMD(selectedDate)}
        onPress={async () => {
          if (!allowComplete) {
            return;
          }
          if (habit.unit !== null) {
            unitInputRef.current?.present();
            return;
          }
          await markHabitAsCompleted(habit.id, null);
        }}
      />
      <UnitValueInputModal unitInputRef={unitInputRef} habit={habit} />
    </>
  );
}

const WINDOW_HEIGHT = Dimensions.get("window").height;

function UnitValueInputModal({
  unitInputRef,
  habit,
}: {
  unitInputRef: React.RefObject<BottomSheetModal | null>;
  habit: HabitWithCompletions;
}) {
  const { theme } = usePreferredColorTheme();
  const keyboardHeight = useKeyboardHeight();

  const [unitValue, setUnitValue] = useState("");
  const [unitValueError, setUnitValueError] = useState<string | undefined>(
    undefined
  );
  const validateUnitValue = useCallback(() => {
    const num = Number(unitValue);
    if (!isNaN(num) && num > 0) {
      setUnitValueError(undefined);
      return true;
    }
    setUnitValueError("Invalid unit value");
    return false;
  }, [unitValue]);

  return (
    <ModalBottomSheet
      ref={unitInputRef}
      detached
      style={{ marginHorizontal: 20 }}
      bottomInset={Math.max((WINDOW_HEIGHT - 200) / 2, keyboardHeight + 20)}
      handleIndicatorStyle={{ display: "none", height: 0 }}
      paddingY={10}
    >
      <View className="gap-4 flex-1">
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
        <View className="gap-3 flex-grow flex-1 justify-between">
          <Input
            useBottomSheetTextInput={true}
            placeholder="Enter value"
            onChangeText={setUnitValue}
            value={unitValue}
            error={unitValueError}
          />
          <View className="flex-1 flex-row items-center gap-2 border-t border-t-gray-100">
            <Pressable
              style={{
                flex: 1,
                borderRightWidth: 1,
                borderRightColor:
                  theme === "dark" ? Colors["gray-900"] : Colors["gray-100"],
              }}
              className="items-center justify-center py-3"
              onPress={() => unitInputRef.current?.close()}
            >
              <InterText className="font-semibold text-base">CANCEL</InterText>
            </Pressable>
            <Pressable
              style={{ flex: 1 }}
              className="items-center justify-center py-3"
              onPress={async () => {
                if (!validateUnitValue()) {
                  return;
                }
                unitInputRef.current?.close();
                await markHabitAsCompleted(
                  habit.id as string,
                  Number(unitValue) as number
                );
              }}
            >
              <InterText className="font-semibold text-base">OK</InterText>
            </Pressable>
          </View>
        </View>
      </View>
    </ModalBottomSheet>
  );
}
