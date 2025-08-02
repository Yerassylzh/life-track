import * as Notifications from "expo-notifications";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Linking, Text, View } from "react-native";

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
      await Linking.openSettings();
    } catch (e) {
      console.error(e);
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
