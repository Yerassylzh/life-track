import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function AppLoading() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={100} />
    </View>
  );
}
