import AppBackground from "@/components/AppBackground";
import DatePicker from "@/features/home/components/DatePicker";
import Header from "@/features/home/components/Header";
import TasksAndHabits from "@/features/home/components/TasksAndHabits";
import { ActivitiesProvider } from "@/features/home/context/ActivitiesCountContext";
import {
  DateProvider,
  useDate,
} from "@/features/home/context/SelectedDateContext";
import React, { useEffect } from "react";

export default function Wrapper() {
  return (
    <DateProvider>
      <ActivitiesProvider>
        <Home />
      </ActivitiesProvider>
    </DateProvider>
  );
}

function Home() {
  const { setSelectedDate } = useDate();

  useEffect(() => {
    console.log("Home Re-render");
  });

  return (
    <AppBackground className="">
      <Header />
      <DatePicker onDateSelected={setSelectedDate} />
      <TasksAndHabits />
    </AppBackground>
  );
}
