import { ChooseNoteBackgroundColorModalProvider } from "@/features/journal/context/ChooseNoteBackgroundColorModalContext";
import { JournalFormProvider } from "@/features/journal/context/JournalFormContext";
import { Slot } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <JournalFormProvider>
      <ChooseNoteBackgroundColorModalProvider>
        <Slot />
      </ChooseNoteBackgroundColorModalProvider>
    </JournalFormProvider>
  );
}
