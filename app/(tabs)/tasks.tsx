import AppBackground from "@/components/AppBackground";
import InterText from "@/components/InterText";
import Header from "@/features/tasks/components/Header";
import React from "react";

export default function Tasks() {
  return (
    <AppBackground>
      <Header />
      <InterText>Tasks</InterText>
    </AppBackground>
  );
}
