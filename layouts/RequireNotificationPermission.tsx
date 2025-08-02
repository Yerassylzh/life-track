import * as Application from "expo-application";
import * as IntentLauncher from "expo-intent-launcher";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, Text, View } from "react-native";
import AppBackground from "../components/AppBackground";
import PrimaryButton from "../components/form/PrimaryButton";
import InterText from "../components/ui/InterText";

export const RequireNotificationPermission: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermission = useCallback(async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setHasPermission(status === "granted");
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    if (hasPermission) return;

    const id = setInterval(async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        clearInterval(id);
        setHasPermission(true);
      }
    }, 100);
    return () => clearInterval(id);
  }, [hasPermission]);

  const handleOpenSettings = useCallback(async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    const hasPermission = status === "granted";
    if (hasPermission) {
      setHasPermission(true);
      return;
    }

    try {
      if (Platform.OS === "android" && Platform.Version >= 26) {
        try {
          await IntentLauncher.startActivityAsync(
            IntentLauncher.ActivityAction.APP_NOTIFICATION_SETTINGS,
            {
              extra: {
                "android.provider.extra.APP_PACKAGE": Application.applicationId,
              },
            }
          );
          return; // Exit if successful
        } catch {
          console.warn(
            "Direct notification settings failed, falling back to app settings"
          );
        }
      }

      // iOS and Android fallback (opens app settings)
      await Linking.openSettings();
    } catch {
      Alert.alert(
        "Error",
        "Unable to open settings. Please configure notifications manually in device settings."
      );
    }
  }, []);

  if (hasPermission === null) {
    return (
      <AppBackground className="flex-col justify-center items-center gap-7">
        <ActivityIndicator size={100} />
        <Text style={{ marginTop: 10 }}>Checking permissions...</Text>
      </AppBackground>
    );
  }

  if (!hasPermission) {
    return (
      <AppBackground className="flex-col justify-center items-center gap-5">
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <InterText
            style={{
              flex: 1,
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Please, turn on notifications for the best experience
          </InterText>
        </View>
        <PrimaryButton
          label="Enable Notifications"
          onPress={handleOpenSettings}
          className="w-[80%]"
        />
      </AppBackground>
    );
  }

  return children;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
