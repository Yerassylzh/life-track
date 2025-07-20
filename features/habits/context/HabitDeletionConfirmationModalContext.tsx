import ConfirmModalFooter from "@/components/form/ConfirmModalFooter";
import InterText from "@/components/ui/InterText";
import { HabitWithCompletions } from "@/db/types";
import Modal from "@/layouts/Modal";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { View } from "react-native";
import { deleteHabit } from "../lib/delete";

interface ContextType {
  showModal: (habit: HabitWithCompletions) => void;
}

const HabitDeletionConfirmationModalContext = createContext<
  ContextType | undefined
>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const HabitDeletionConfirmationModalProvider: React.FC<
  ProviderProps
> = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [habit, setHabit] = useState<HabitWithCompletions | null>(null);

  const showModal = (habit: HabitWithCompletions) => {
    setHabit(habit);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setHabit(null);
  };

  const handleConfirm = async () => {
    if (habit) {
      await deleteHabit(habit);
    }
    setIsModalVisible(false);
  };

  return (
    <HabitDeletionConfirmationModalContext.Provider value={{ showModal }}>
      {children}
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="gap-3">
          <InterText>
            Are you sure you want to delete the habit &apos;{habit?.name}&apos;?
            This action cannot be undone.
          </InterText>
          <ConfirmModalFooter
            onCancel={handleClose}
            onOk={handleConfirm}
            okLabel="DELETE"
            okClassName="text-red-500"
          />
        </View>
      </Modal>
    </HabitDeletionConfirmationModalContext.Provider>
  );
};

export const useHabitDeletionConfirmationModal = () => {
  const context = useContext(HabitDeletionConfirmationModalContext);
  if (context === undefined) {
    throw new Error(
      "useHabitDeletionConfirmationModal must be used within a HabitDeletionConfirmationModalProvider"
    );
  }
  return context;
};
