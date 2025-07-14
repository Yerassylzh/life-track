import { RequireNotificationPermission } from "@/components/RequireNotificationPermission";
import SafeScreenView from "@/components/SafeScreenView";
import { ModalMessageProvider } from "@/context/ModalMessageContext";
import { PreferredColorThemeProvider } from "@/context/PrefferedColorTheme";
import "@/global.css";
import DbMigrator from "@/layouts/DbMigrator";
import FontLayout from "@/layouts/Font";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  // useEffect(() => {
  //   (async () => {
  //     await deleteAllHabits();
  //     console.log(await getHabits());
  //   })();
  // }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <BottomSheetModalProvider>
        <PreferredColorThemeProvider>
          <FontLayout>
            <ModalMessageProvider>
              <RequireNotificationPermission>
                <DbMigrator>
                  <SafeScreenView>
                    <Stack screenOptions={{ headerShown: false }} />
                  </SafeScreenView>
                </DbMigrator>
              </RequireNotificationPermission>
            </ModalMessageProvider>
          </FontLayout>
        </PreferredColorThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
