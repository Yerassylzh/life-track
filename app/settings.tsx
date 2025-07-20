import AppLoading from "@/components/AppLoading";
import { useModalMessage } from "@/context/ModalMessageContext";
import React, { useEffect } from "react";
import { View } from "react-native";

export default function Settings() {
  const { showMessage } = useModalMessage();

  useEffect(() => {
    showMessage("Hello");
  }, [showMessage]);

  return (
    <View className="flex-1">
      <AppLoading />
    </View>
  );
}
