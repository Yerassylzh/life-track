import ConfirmModalFooter from "@/components/form/ConfirmModalFooter";
import Input from "@/components/form/Input";
import ActivityLabel from "@/components/ui/ActivityLabel";
import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { HabitWithCompletions } from "@/db/types";
import Modal from "@/layouts/Modal";
import { Colors } from "@/lib/colors";
import { dateToYMD } from "@/lib/date";
import { cn } from "@/lib/tailwindClasses";
import { createContext, useCallback, useContext, useState } from "react";
import { View } from "react-native";
import DynamicIcon from "../components/DynamicIcon";
import { markHabitAsCompleted } from "../lib/update";

type ContextProps = {
  showModal: (habit: HabitWithCompletions) => void;
};

const Context = createContext<ContextProps | undefined>(undefined);

export function UnitValueInputModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = usePreferredColorTheme();
  const [visible, setVisible] = useState(false);
  const [habit, setHabit] = useState<HabitWithCompletions | null>(null);
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

  const showModal = useCallback((habit: HabitWithCompletions) => {
    setHabit(habit);
    setVisible(true);
  }, []);

  const onOk = useCallback(async () => {
    if (!habit) return;

    if (!validateUnitValue()) {
      return;
    }
    setVisible(false);
    await markHabitAsCompleted(habit.id as string, Number(unitValue) as number);
  }, [habit, unitValue, validateUnitValue]);

  const onCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const data = { showModal };

  return (
    <Context.Provider value={data}>
      {children}
      {habit && (
        <Modal visible={visible} onRequestClose={() => setVisible(false)}>
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
              <DynamicIcon
                color={habit.color}
                size={22}
                name={habit.iconName}
              />
            </View>
            <Input
              placeholder="Enter value"
              onChangeText={setUnitValue}
              value={unitValue}
              error={unitValueError}
              bgColor={theme === "dark" ? Colors["gray-800"] : undefined}
            />
          </View>
          <ConfirmModalFooter onOk={onOk} onCancel={onCancel} />
        </Modal>
      )}
    </Context.Provider>
  );
}

export const useUnitValueInputModal = () => {
  const context = useContext(Context);
  if (!context) {
    throw Error(
      "useUnitValueInputModal must be used within UnitValueInputModalProvider"
    );
  }
  return context;
};
