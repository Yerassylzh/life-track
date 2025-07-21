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

const ChooseActivityToCreateContext = createContext<ContextType | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
}

const flow: ActivityStep[] = [
  {
    title: "Habit",
    description:
      "Activity that repeats over time. It has detailed tracking and statistics",
    iconName: "Trophy",
    next: [
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
    ],
  },
  {
    title: "Task",
    description: "Single instance activity without tracking over time",
    iconName: "Check",
    next: {
      redirectTo: "/task/create_task",
    },
  },
  {
    title: "Journal entry",
    description:
      "Write your thoughts, experiences, or reflections. You can also add images",
    iconName: "Album",
    next: {
      redirectTo: "/journal/create/create",
    },
  },
];

export const ChooseActivityToCreateProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const ref = useRef<BottomSheetModal>(null);
  const showModal = useCallback(() => {
    ref.current?.present();
  }, []);

  return (
    <ChooseActivityToCreateContext.Provider value={{ showModal }}>
      {children}
      <ModalBottomSheet ref={ref}>
        <ActionsFlowRenderer
          flow={flow}
          onRedirect={() => {
            console.log("Closed");
            ref.current?.dismiss();
          }}
        />
      </ModalBottomSheet>
    </ChooseActivityToCreateContext.Provider>
  );
};

export const useChooseActivityToCreate = () => {
  const context = useContext(ChooseActivityToCreateContext);
  if (context === undefined) {
    throw new Error(
      "useChooseActivityToCreate must be used within a ChooseActivityToCreateProvider"
    );
  }
  return context;
};
