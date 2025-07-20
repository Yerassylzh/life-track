import ActionsFlowRenderer, {
  ActivityStep,
} from "@/components/ActionsFlowRenderer";
import ModalBottomSheet from "@/components/ModalBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";

interface ContextType {
  showModal: () => void;
}

const ChooseHabitTypeToCreateContext = createContext<ContextType | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
}

const flow: ActivityStep[] = [
  {
    title: "Yes or No Habit",
    description:
      "Mark whether you did the habit or not. Best for simple goals like meditating, waking up early, or avoiding sugar.",
    iconName: "CheckSquare",
    next: {
      redirectTo: "/habit/create_habit/checkbox",
    },
  },
  {
    title: "Measurable Habit",
    description:
      "Track how much, how long, or how many times you do something. Ideal for habits like reading pages, drinking water, or running kilometers.",
    iconName: "BarChart2",
    next: {
      redirectTo: "/habit/create_habit/numeric",
    },
  },
];

export const ChooseHabitTypeToCreateProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const ref = useRef<BottomSheetModal>(null);
  const showModal = useCallback(() => {
    ref.current?.present();
  }, []);

  return (
    <ChooseHabitTypeToCreateContext.Provider value={{ showModal }}>
      {children}
      <ModalBottomSheet ref={ref}>
        <ActionsFlowRenderer flow={flow} onRedirect={ref.current?.close} />
      </ModalBottomSheet>
    </ChooseHabitTypeToCreateContext.Provider>
  );
};

export const useChooseHabitTypeToCreate = () => {
  const context = useContext(ChooseHabitTypeToCreateContext);
  if (context === undefined) {
    throw new Error(
      "useChooseHabitTypeToCreate must be used within a ChooseHabitTypeToCreateProvider"
    );
  }
  return context;
};
