import InterText from "@/components/ui/InterText";
import Modal from "@/layouts/Modal";
import { Colors } from "@/lib/colors";
import React, { createContext, useCallback, useContext, useState } from "react";
import { TouchableOpacity, View } from "react-native";

interface ModalProps {
  showMessage: (msg: string) => void;
}

const ModalContext = createContext<ModalProps | null>(null);

function ModalMessageProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setModalVisible(true);
  }, []);

  const data = {
    showMessage,
  };

  return (
    <ModalContext.Provider value={data}>
      <Modal
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible); // Handles back button on Android
          setMessage(null);
        }}
      >
        <View style={{ gap: 15 }}>
          <InterText>{message}</InterText>
          <View className="flex flex-row items-center justify-end">
            <TouchableOpacity
              className="bg-transparent"
              onPress={() => {
                setModalVisible(false);
                setMessage(null);
              }}
            >
              <InterText customColor={Colors["blue-500"]}>Got it</InterText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {children}
    </ModalContext.Provider>
  );
}

const useModalMessage = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw Error("useModalMessage must be used inside of ModalMessageProvider");
  }
  return context;
};

export { ModalMessageProvider, useModalMessage };
