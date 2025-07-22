import AppBackground from "@/components/AppBackground";
import BackHeader from "@/components/ui/BackHeader";
import InterText from "@/components/ui/InterText";
import { useChooseOptionModal } from "@/context/ChooseOptionModalContext";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import SettingsBox from "@/features/settings/components/SettingsBox";
import { useSettingsContext } from "@/features/settings/context/SettingsContext";
import React, { useMemo } from "react";
import { ScrollView } from "react-native-gesture-handler";

export default function Settings() {
  const { firstDayOfWeek, theme, setFirstDayOfWeek, setTheme } =
    useSettingsContext();
  const { changeTheme, isSystem } = usePreferredColorTheme();
  const { showModal } = useChooseOptionModal();

  const settings = useMemo(
    () => [
      {
        icon: "Calendar",
        title: "First day of week",
        value: firstDayOfWeek,
        options: ["Monday", "Sunday"],
        onPress: () => {
          showModal([
            {
              optionName: "Monday",
              onPress: () => setFirstDayOfWeek("Monday"),
            },
            {
              optionName: "Sunday",
              onPress: () => setFirstDayOfWeek("Sunday"),
            },
          ]);
        },
      },
      {
        icon: "Palette",
        title: "Theme",
        value: isSystem
          ? "System"
          : theme.charAt(0).toUpperCase() + theme.slice(1),
        options: ["System", "Light", "Dark"],
        onPress: () => {
          showModal([
            {
              optionName: "System",
              onPress: () => {
                setTheme("system");
                changeTheme("system");
              },
            },
            {
              optionName: "Light",
              onPress: () => {
                setTheme("light");
                changeTheme("light");
              },
            },
            {
              optionName: "Dark",
              onPress: () => {
                setTheme("dark");
                changeTheme("dark");
              },
            },
          ]);
        },
      },
    ],
    [
      changeTheme,
      firstDayOfWeek,
      isSystem,
      setFirstDayOfWeek,
      setTheme,
      showModal,
      theme,
    ]
  );

  return (
    <AppBackground>
      <BackHeader>
        <InterText className="text-[20px] font-semibold">Settings</InterText>
      </BackHeader>
      <ScrollView>
        {settings.map((setting) => (
          <SettingsBox
            key={setting.title}
            iconName={setting.icon}
            title={setting.title}
            value={setting.value}
            onPress={setting.onPress}
          />
        ))}
      </ScrollView>
    </AppBackground>
  );
}
