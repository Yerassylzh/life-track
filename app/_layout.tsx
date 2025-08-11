import { ChooseOptionModalProvider } from "@/context/ChooseOptionModalContext";
import { FullScreenImageModalProvider } from "@/context/FullScreenImageModalContext";
import { ModalMessageProvider } from "@/context/ModalMessageContext";
import { PreferredColorThemeProvider } from "@/context/PrefferedColorTheme";
import { ScreenInsetsColorProvider } from "@/context/ScreenInsetsColorContext";
import { expoDb } from "@/db/db";
import { ChooseHabitTypeToCreateProvider } from "@/features/habits/context/ChooseHabitTypeToCreateContext";
import { HabitActionsProvider } from "@/features/habits/context/HabitActionsContext";
import { HabitActionsModalProvider } from "@/features/habits/context/HabitActionsModalContext";
import { HabitDeletionConfirmationModalProvider } from "@/features/habits/context/HabitDeletionConfirmationModalContext";
import HabitsProvider from "@/features/habits/context/HabitsContext";
import { UnitValueInputModalProvider } from "@/features/habits/context/UnitValueInputModalContext";
import { SettingsProvider } from "@/features/settings/context/SettingsContext";
import { TaskDeletionConfirmationModalProvider } from "@/features/tasks/context/TaskDeletionConfirmationModalContext";
import TasksProvider from "@/features/tasks/context/TasksContext";
import "@/global.css";
import DbMigrator from "@/layouts/DbMigrator";
import FontLayout from "@/layouts/Font";
import { RequireNotificationPermission } from "@/layouts/RequireNotificationPermission";
import SafeScreenView from "@/layouts/SafeScreenView";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  useEffect(() => {
    import("react-native-google-mobile-ads").then((mobileAds) => {
      mobileAds
        .default()
        .initialize()
        .then((adapterStatuses) => {
          // Initialization complete!
        });
    });
  }, []);

  useDrizzleStudio(expoDb);

  return (
    <GestureHandlerRootView className="flex-1">
      <PreferredColorThemeProvider>
        <FontLayout>
          <ModalMessageProvider>
            <RequireNotificationPermission>
              <SettingsProvider>
                <DbMigrator>
                  <HabitsProvider>
                    <TasksProvider>
                      <BottomSheetModalProvider>
                        <UnitValueInputModalProvider>
                          <TaskDeletionConfirmationModalProvider>
                            <HabitDeletionConfirmationModalProvider>
                              <ChooseHabitTypeToCreateProvider>
                                <HabitActionsModalProvider>
                                  <HabitActionsProvider>
                                    <FullScreenImageModalProvider>
                                      <ScreenInsetsColorProvider>
                                        <ChooseOptionModalProvider>
                                          <SafeScreenView>
                                            <Stack
                                              screenOptions={{
                                                headerShown: false,
                                                animation: "fade_from_bottom",
                                                animationDuration: 100,
                                              }}
                                            />
                                          </SafeScreenView>
                                        </ChooseOptionModalProvider>
                                      </ScreenInsetsColorProvider>
                                    </FullScreenImageModalProvider>
                                  </HabitActionsProvider>
                                </HabitActionsModalProvider>
                              </ChooseHabitTypeToCreateProvider>
                            </HabitDeletionConfirmationModalProvider>
                          </TaskDeletionConfirmationModalProvider>
                        </UnitValueInputModalProvider>
                      </BottomSheetModalProvider>
                    </TasksProvider>
                  </HabitsProvider>
                </DbMigrator>
              </SettingsProvider>
            </RequireNotificationPermission>
          </ModalMessageProvider>
        </FontLayout>
      </PreferredColorThemeProvider>
    </GestureHandlerRootView>
  );
}
