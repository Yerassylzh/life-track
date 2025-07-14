import React from "react";
import { Modal as NativeModal } from "react-native";

interface Props {
  children: React.ReactNode;
  visible: boolean;
  onRequestClose: () => void;
}

export default function Modal({ children, visible, onRequestClose }: Props) {
  return (
    <NativeModal
      animationType="fade"
      backdropColor={"rgba(110,110,110,0.05)"}
      visible={visible}
      onRequestClose={onRequestClose}
      className="flex-1"
    >
      {children}
    </NativeModal>
  );
}
