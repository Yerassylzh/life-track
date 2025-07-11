import AppBackground from "@/components/AppBackground";
import BackHeader from "@/components/BackHeader";
import Input from "@/components/Input";
import InterText from "@/components/InterText";
import LongInput from "@/components/LongInput";
import ColorPicker from "@/features/habits/components/ColorPicker";
import ColorPickerBottomSheet from "@/features/habits/components/ColorPickerBottomSheet";
import HabitRepeat from "@/features/habits/components/HabitRepeat";
import {
  NewHabitProvider,
  useNewHabit,
} from "@/features/habits/context/NewHabitContext";
import React from "react";
import { ScrollView, View } from "react-native";

export default function Wrapper() {
  return (
    <NewHabitProvider>
      <CreateHabit />
    </NewHabitProvider>
  );
}

function CreateHabit() {
  const { description, setDescription, title, setTitle } = useNewHabit();

  return (
    <AppBackground className="gap-4">
      <BackHeader>
        <View className="flex-row gap-1 items-center justify-start">
          <InterText className="text-[20px]">Create</InterText>
          <InterText className="font-bold text-[20px]">Habit</InterText>
        </View>
      </BackHeader>
      <ScrollView>
        <View className="px-[15px] gap-3">
          <Input onChangeText={setTitle} value={title} placeholder="Title" />
          <LongInput
            onChangeText={setDescription}
            value={description}
            placeholder="Description"
          />
          <ColorPicker />
          <HabitRepeat />
        </View>
      </ScrollView>
      <ColorPickerBottomSheet />
    </AppBackground>
  );
}

// // First, set the handler that will cause the notification
// // to show the alert
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowBanner: true,
//     shouldShowList: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// const showScheduledNotifications = async () => {
//   const scheduled = await Notifications.getAllScheduledNotificationsAsync();
//   console.log("📋 Scheduled notifications:", scheduled);
// };

// // Second, call scheduleNotificationAsync()
// Notifications.scheduleNotificationAsync({
//   content: {
//     title: "Look at that notification",
//     body: "I'm so proud of myself!",
//   },
//   trigger: {
//     type: "daily",
//     repeats: true,
//     hour: 20,
//     minute: 38,
//   } as Notifications.DailyTriggerInput,
// });
