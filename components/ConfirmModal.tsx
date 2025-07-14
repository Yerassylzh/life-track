import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "./Modal";

interface Props {
  children: React.ReactNode;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  children,
  visible,
  onOk,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} onRequestClose={onCancel}>
      {children}
      <View className="w-full flex flex-row items-center justify-end">
        <TouchableOpacity className="bg-transparent" onPress={onCancel}>
          <Text className="text-blue-600">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-transparent" onPress={onOk}>
          <Text className="text-blue-600">Ok</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
