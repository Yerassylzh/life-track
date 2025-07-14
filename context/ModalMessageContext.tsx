import Modal from "@/components/Modal";
import React, { createContext, useCallback, useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
        <View className="flex-1 flex items-center justify-center">
          <View className="w-[250px] p-[15px] bg-white rounded-[15px] gap-[15px]">
            <Text className="text-[14px]">{message}</Text>
            <View className="flex flex-row items-center justify-end">
              <TouchableOpacity
                className="bg-transparent"
                onPress={() => {
                  setModalVisible(false);
                  setMessage(null);
                }}
              >
                <Text className="text-blue-600">Got it</Text>
              </TouchableOpacity>
            </View>
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
