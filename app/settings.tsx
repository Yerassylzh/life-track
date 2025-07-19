import { useModalMessage } from "@/context/ModalMessageContext";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function Settings() {
  const { showMessage } = useModalMessage();

  useEffect(() => {
    showMessage("Hello");
  }, [showMessage]);

  return (
    <View>
      <Text>settings</Text>
    </View>
  );
}
