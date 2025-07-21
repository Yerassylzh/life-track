import ModalBottomSheet from "@/components/ModalBottomSheet";
import { HabitWithCompletions } from "@/db/types";
import { Colors } from "@/lib/colors";
import { router } from "expo-router";
import React, { createContext, useContext, useRef } from "react";
import { View } from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useHabitDeletionConfirmationModal } from "../context/HabitDeletionConfirmationModalContext";
import {
  ActivityOption,
  HabitActionHeader,
} from "./HabitActionsModalContext.components";

type HabitActionsModalContextType = {
  showModal: (habit: HabitWithCompletions) => void;
};

const HabitActionsModalContext =
  createContext<HabitActionsModalContextType | null>(null);

export function HabitActionsModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const modalRef = useRef<BottomSheetModal>(null);
  const [currentHabit, setCurrentHabit] =
    React.useState<HabitWithCompletions | null>(null);
  const { showModal: showHabitDeletionConfirmationModal } =
    useHabitDeletionConfirmationModal();

  const showModal = (habit: HabitWithCompletions) => {
    setCurrentHabit(habit);
    modalRef.current?.present();
  };

  return (
    <HabitActionsModalContext.Provider value={{ showModal }}>
      {children}
      <ModalBottomSheet
        ref={modalRef}
        handleIndicatorStyle={{ display: "none" }}
        paddingY={10}
        className="pt-0 pb-10"
      >
        {currentHabit && (
          <View className="gap-4">
            <HabitActionHeader habit={currentHabit} />
            <View className="gap-2">
              <ActivityOption
                name="edit"
                iconName="Pencil"
                onPress={() => {
                  modalRef.current?.close();
                  router.navigate({
                    pathname: `/habit/edit/[id]`,
                    params: { id: currentHabit.id },
                  });
                }}
              />
              <ActivityOption
                name="statistics"
                iconName="BarChart2"
                onPress={() => {
                  modalRef.current?.close();
                  router.navigate({
                    pathname: `/habit/statistics/[id]`,
                    params: { id: currentHabit.id },
                  });
                }}
              />
              <ActivityOption
                customColor={Colors["red-500"]}
                name="delete"
                iconName="Trash2"
                onPress={() => {
                  modalRef.current?.close();
                  showHabitDeletionConfirmationModal(currentHabit);
                }}
              />
            </View>
          </View>
        )}
      </ModalBottomSheet>
    </HabitActionsModalContext.Provider>
  );
}

export const useHabitActionsModal = () => {
  const context = useContext(HabitActionsModalContext);
  if (!context) {
    throw new Error(
      "useHabitActionsModal must be used within a HabitActionsModalProvider"
    );
  }
  return context;
};
