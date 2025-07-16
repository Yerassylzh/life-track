import * as Notifications from "expo-notifications";
import { YMDToDate } from "./date";

export type NotificationContentType = {
  title: string;
  body: string;
};

export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Permission not granted!");
  }
}

export const scheduleSingleNotification = async (
  time: string,
  date: string,
  content: NotificationContentType
): Promise<string[]> => {
  const date_ = YMDToDate(date);
  const targetDate = new Date(
    date_.getFullYear(),
    date_.getMonth(),
    date_.getDate(),
    Number(time.split(":")[0]),
    Number(time.split(":")[1])
  );

  const notificationId = await Notifications.scheduleNotificationAsync({
    content,
    trigger: {
      date: targetDate,
    } as Notifications.DateTriggerInput,
  });

  return [notificationId];
};

export const showScheduledNotifications = async () => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log("📋 Scheduled notifications:", scheduled);
};

export const deleteAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
