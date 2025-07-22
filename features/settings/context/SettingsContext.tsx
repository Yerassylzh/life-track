import { useStorage } from "@/hooks/useStorage";
import React, { createContext, ReactNode, useContext } from "react";
import { defaultSettings } from "../lib/contants";

interface SettingsContextValue {
  firstDayOfWeek: string;
  theme: string;
  setFirstDayOfWeek: (value: string) => void;
  setTheme: (value: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [firstDayOfWeek, setFirstDayOfWeek] = useStorage(
    "firstDayOfWeek",
    defaultSettings.firstDayOfWeek
  );
  const [theme, setTheme] = useStorage(
    "theme",
    defaultSettings.theme.toLowerCase()
  );

  return (
    <SettingsContext.Provider
      value={{ firstDayOfWeek, theme, setFirstDayOfWeek, setTheme }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error(
      "useSettingsContext must be used within a SettingsProvider"
    );
  return ctx;
}
