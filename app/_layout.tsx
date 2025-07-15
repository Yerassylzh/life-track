import { RequireNotificationPermission } from "@/components/RequireNotificationPermission";
import SafeScreenView from "@/components/SafeScreenView";
import HabitProvider from "@/context/HabitContext";
import { ModalMessageProvider } from "@/context/ModalMessageContext";
import { PreferredColorThemeProvider } from "@/context/PrefferedColorTheme";
import { expoDb } from "@/db/db";
import "@/global.css";
import DbMigrator from "@/layouts/DbMigrator";
import FontLayout from "@/layouts/Font";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  // useEffect(() => {
  //   (async () => {
  //     await deleteAllHabits();
  //     console.log(await getHabits());

  //     await deleteAllNotifications();
  //     console.log(await getAllScheduledNotificationsAsync());
  //   })();
  // }, []);

  useDrizzleStudio(expoDb);

  return (
    <GestureHandlerRootView className="flex-1 bg-blue-500">
      <PreferredColorThemeProvider>
        <FontLayout>
          <ModalMessageProvider>
            <RequireNotificationPermission>
              <DbMigrator>
                <HabitProvider>
                  <BottomSheetModalProvider>
                    <SafeScreenView>
                      <Stack screenOptions={{ headerShown: false }} />
                    </SafeScreenView>
                  </BottomSheetModalProvider>
                </HabitProvider>
              </DbMigrator>
            </RequireNotificationPermission>
          </ModalMessageProvider>
        </FontLayout>
      </PreferredColorThemeProvider>
    </GestureHandlerRootView>
  );
}
