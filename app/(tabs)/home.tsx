import AppBackground from "@/components/AppBackground";
import DatePicker from "@/features/home/components/DatePicker";
import Header from "@/features/home/components/Header";
import React from "react";

export default function Home() {
  return (
    <AppBackground>
      <Header dateString="Today" />
      <DatePicker onDateSelected={() => {}} />
    </AppBackground>
  );
}
