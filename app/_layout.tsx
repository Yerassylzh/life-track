import SafeScreenView from "@/components/SafeScreenView";
import { PreferredColorThemeProvider } from "@/context/PrefferedColorTheme";
import "@/global.css";
import FontLayout from "@/layouts/Font";

import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <FontLayout>
      <PreferredColorThemeProvider>
        <SafeScreenView>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeScreenView>
      </PreferredColorThemeProvider>
    </FontLayout>
  );
}
