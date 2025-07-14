import * as Notifications from "expo-notifications";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import AppBackground from "./AppBackground";
import InterText from "./InterText";
import PrimaryButton from "./PrimaryButton";

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
      <AppBackground className="flex-col justify-center items-center gap-7">
        <InterText style={{ fontSize: 16, marginBottom: 10 }}>
          Notification permission is required to use this app.
        </InterText>
        <PrimaryButton
          label="Try Again"
          onPress={requestPermission}
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
