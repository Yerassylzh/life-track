import ActivityLabel from "@/components/ActivityLabel";
import Input from "@/components/Input";
import InterText from "@/components/InterText";
import SheetModal from "@/components/SheetModal";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import DynamicIcon from "@/features/habits/components/DynamicIcon";
import { markHabitAsCompleted } from "@/features/habits/lib/update";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { Colors } from "@/lib/colors";
import { dateToYMD } from "@/lib/date";
import { cn } from "@/lib/tailwindClasses";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";

const WINDOW_HEIGHT = Dimensions.get("window").height;

export default function UnitValueInputModal({
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
    <SheetModal
      ref={unitInputRef}
      bottomInset={Math.max((WINDOW_HEIGHT - 200) / 2, keyboardHeight + 20)}
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
            bgColor={theme === "dark" ? Colors["gray-800"] : undefined}
          />
          <View
            className={cn(
              "flex-1 flex-row items-center gap-2 border-t border-t-gray-100",
              theme === "dark" && "border-t-gray-800"
            )}
          >
            <Pressable
              style={{
                flex: 1,
              }}
              className={cn(
                "items-center justify-center py-3 border-r border-r-gray-100",
                theme === "dark" && "border-r-gray-800"
              )}
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
    </SheetModal>
  );
}
