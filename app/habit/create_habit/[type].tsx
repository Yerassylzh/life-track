import AppBackground from "@/components/AppBackground";
import AppLoading from "@/components/AppLoading";
import BackHeader from "@/components/BackHeader";
import Input from "@/components/Input";
import InterText from "@/components/InterText";
import LongInput from "@/components/LongInput";
import PrimaryButton from "@/components/PrimaryButton";
import { useModalMessage } from "@/context/ModalMessageContext";
import ColorPicker from "@/features/habits/components/ColorPicker";
import ColorPickerBottomSheet from "@/features/habits/components/ColorPickerBottomSheet";
import HabitReminder from "@/features/habits/components/HabitReminder";
import HabitRepeat from "@/features/habits/components/HabitRepeat";
import IconPicker from "@/features/habits/components/IconPicker";
import IconPickerBottomSheet from "@/features/habits/components/IconPickerBottomSheet";
import {
  NewHabitProvider,
  useNewHabit,
} from "@/features/habits/context/NewHabitContext";
import { createHabit } from "@/features/habits/lib/create";
import { scheduleNotification } from "@/lib/notifications";
import { useLocalSearchParams } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";

export default function Wrapper() {
  const { type } = useLocalSearchParams();
  if (type !== "numeric" && type !== "checkbox") {
    console.log("invalid params for create_habit:", type);
    return <AppLoading />;
  }

  return (
    <NewHabitProvider>
      <CreateHabit />
    </NewHabitProvider>
  );
}

function CreateHabit() {
  const { showMessage } = useModalMessage();
  const {
    description,
    setDescription,
    title,
    setTitle,
    setTitleError,
    colorIndex,
    repeatType,
    daysOfWeek,
    weeklyFreq,
    monthlyDays,
    reminder,
    titleError,
  } = useNewHabit();

  const onPress = useCallback(async () => {
    if (title.length === 0) {
      setTitleError("Enter habit name");
      return;
    }

    let reminderIdsStr = null;
    if (reminder !== null) {
      const reminderIds = await scheduleNotification(
        reminder,
        title,
        repeatType,
        daysOfWeek,
        monthlyDays
      );
      reminderIdsStr = JSON.stringify(reminderIds);
    }

    const data = await createHabit(
      title,
      description,
      colorIndex,
      repeatType,
      daysOfWeek,
      weeklyFreq,
      monthlyDays,
      reminderIdsStr
    );
    if (data.success) {
      console.log("Created successfully");
      navigate("/(tabs)/home");
    } else {
      console.log("Error occured");
      showMessage(`Error occured while creating habit. Logs: ${data.error}`);
    }
  }, [
    colorIndex,
    daysOfWeek,
    description,
    monthlyDays,
    reminder,
    repeatType,
    setTitleError,
    title,
    weeklyFreq,
    showMessage,
  ]);

  return (
    <AppBackground className="gap-4">
      <BackHeader>
        <View className="flex-row gap-1 items-center justify-start">
          <InterText className="text-[20px]">Create</InterText>
          <InterText className="font-bold text-[20px]">Habit</InterText>
        </View>
      </BackHeader>
      <ScrollView
        className="px-[15px] gap-3"
        bounces={true}
        overScrollMode="always"
        style={{ flex: 1 }}
        contentContainerStyle={{ gap: 10, paddingBottom: 100 }}
      >
        <Input
          onChangeText={setTitle}
          value={title}
          placeholder="Title"
          error={titleError}
        />
        <LongInput
          onChangeText={setDescription}
          value={description}
          placeholder="Description"
        />
        <View className="flex-row gap-3">
          <ColorPicker />
          <IconPicker />
        </View>
        <HabitRepeat />
        <HabitReminder />
      </ScrollView>
      <PrimaryButton
        label="Save"
        className="self-center absolute bottom-4 w-[90%]"
        onPress={onPress}
      />
      <ColorPickerBottomSheet />
      <IconPickerBottomSheet />
    </AppBackground>
  );
}
