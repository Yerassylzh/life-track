import SafeScreenView from "@/components/SafeScreenView";
import { PreferredColorThemeProvider } from "@/context/PrefferedColorTheme";
import "@/global.css";
import FontLayout from "@/layouts/Font";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <BottomSheetModalProvider>
        <FontLayout>
          <PreferredColorThemeProvider>
            <SafeScreenView>
              <Stack screenOptions={{ headerShown: false }} />
            </SafeScreenView>
          </PreferredColorThemeProvider>
        </FontLayout>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
