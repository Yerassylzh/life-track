import * as Notifications from "expo-notifications";
import { getSundayBasedWeekday } from "./date";

type NotificationContentType = {
  title: string;
  body: string;
};

export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Permission not granted!");
  }
}

const getRandomReminderForHabit = (
  habitName: string
): NotificationContentType => {
  const options: NotificationContentType[] = [
    {
      title: "Stay on track!",
      body: `Don't forget to work on your '${habitName}' habit today.`,
    },
    {
      title: "Reminder",
      body: `Your habit '${habitName}' is waiting for you!`,
    },
    {
      title: "Keep it up 💪",
      body: `Have you done '${habitName}' today?`,
    },
    {
      title: "Consistency is key!",
      body: `Time to complete '${habitName}' again.`,
    },
    {
      title: "Daily nudge",
      body: `Remember your goal with '${habitName}'!`,
    },
  ];

  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
};

export const scheduleNotification = async (
  time: string,
  habitName: string,
  type: "daily" | "weekly" | "monthly",
  daysOfWeek: number[],
  monthlyDays: number[]
): Promise<string[]> => {
  const [hour, minute] = time.split(":").map((tm) => Number(tm));
  const content = getRandomReminderForHabit(habitName);

  if (type === "daily") {
    return await scheduleDailyNotification(content, daysOfWeek, hour, minute);
  }
  if (type === "weekly") {
    return await scheduleWeeklyNotification(content, hour, minute);
  }
  return await scheduleMonthlyNotification(content, monthlyDays, hour, minute);
};

const scheduleDailyNotification = async (
  content: NotificationContentType,
  daysOfWeek: number[],
  hour: number,
  minute: number
): Promise<string[]> => {
  let reminders: string[] = [];
  for (const day of daysOfWeek) {
    const sundayBased = getSundayBasedWeekday(day);
    const notificationIdentifier =
      await Notifications.scheduleNotificationAsync({
        content,
        trigger: {
          type: "weekly",
          weekday: sundayBased + 1,
          hour,
          minute,
          repeats: true,
        } as Notifications.WeeklyTriggerInput,
      });
    reminders.push(notificationIdentifier);
  }
  return reminders;
};

/// I really don't want to make it complex, so let's just fire it everyday
const scheduleWeeklyNotification = async (
  content: NotificationContentType,
  hour: number,
  minute: number
): Promise<string[]> => {
  const notificationIdentifier = await Notifications.scheduleNotificationAsync({
    content,
    trigger: {
      type: "daily",
      hour,
      minute,
    } as Notifications.DailyTriggerInput,
  });

  // Return array for simplicity. Other notification types use string[]
  return [notificationIdentifier];
};

const scheduleMonthlyNotification = async (
  content: NotificationContentType,
  monthlyDays: number[],
  hour: number,
  minute: number
): Promise<string[]> => {
  const reminders: string[] = [];
  for (const day of monthlyDays) {
    const reminderIdentifier = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: "monthly",
        day,
        hour,
        minute,
      } as Notifications.MonthlyTriggerInput,
    });
    reminders.push(reminderIdentifier);
  }
  return reminders;
};

export const showScheduledNotifications = async () => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log("📋 Scheduled notifications:", scheduled);
};

export const deleteAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
