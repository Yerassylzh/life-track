import React from "react";
import { ActivityIndicator } from "react-native";
import AppBackground from "./AppBackground";

export default function AppLoading() {
  return (
    <AppBackground className="flex-1 items-center justify-center">
      <ActivityIndicator size={100} />
    </AppBackground>
  );
}
