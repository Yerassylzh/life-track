import React, { createContext, useCallback, useContext, useState } from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";
import { noteColors } from "../lib/colors";
import { useJournalFormContext } from "./JournalFormContext";

type ChooseNoteBackgroundColorContextType = {
  showModal: () => void;
};

const ChooseNoteBackgroundColorModalContext = createContext<
  ChooseNoteBackgroundColorContextType | undefined
>(undefined);

export const ChooseNoteBackgroundColorModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { color, setColor } = useJournalFormContext();

  const showModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  return (
    <ChooseNoteBackgroundColorModalContext.Provider value={{ showModal }}>
      {children}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
              gap: 12,
            }}
          >
            {noteColors.map((color_) => (
              <TouchableOpacity
                key={color_}
                onPress={() => {
                  setColor(color_);
                  setModalVisible(false);
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: color_,
                  borderWidth: color_ === color ? 2 : 0,
                  borderColor: "#222",
                  marginHorizontal: 2,
                }}
              />
            ))}
          </View>
        </Pressable>
      </Modal>
    </ChooseNoteBackgroundColorModalContext.Provider>
  );
};

export function useChooseNoteBackgroundColorModal() {
  const ctx = useContext(ChooseNoteBackgroundColorModalContext);
  if (!ctx)
    throw new Error(
      "useChooseNoteBackgroundColorModal must be used within ChooseNoteBackgroundColorModalProvider"
    );
  return ctx;
}
