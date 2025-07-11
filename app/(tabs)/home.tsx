import AppBackground from "@/components/AppBackground";
import DatePicker from "@/features/home/components/DatePicker";
import Header from "@/features/home/components/Header";
import TasksAndHabits from "@/features/home/components/TasksAndHabits";
import {
  DateProvider,
  useDate,
} from "@/features/home/context/SelectedDateContext";
import React from "react";

export default function Wrapper() {
  return (
    <DateProvider>
      <Home />
    </DateProvider>
  );
}

function Home() {
  const { setSelectedDate } = useDate();

  return (
    <AppBackground>
      <Header />
      <DatePicker onDateSelected={setSelectedDate} />
      <TasksAndHabits />
    </AppBackground>
  );
}
