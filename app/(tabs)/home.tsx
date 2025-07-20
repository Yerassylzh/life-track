import AppBackground from "@/components/AppBackground";
import TabSwitcher from "@/components/TabSwitcher";
import Add from "@/components/ui/Add";
import DatePicker from "@/features/home/components/DatePicker";
import HabitsList from "@/features/home/components/HabitsList";
import Header from "@/features/home/components/Header";
import { ActivitiesProvider } from "@/features/home/context/ActivitiesCountContext";
import {
  ChooseActivityToCreateProvider,
  useChooseActivityToCreate,
} from "@/features/home/context/ChooseActivityToCreateModalContext";
import {
  DateProvider,
  useDate,
} from "@/features/home/context/SelectedDateContext";
import TasksList from "@/features/tasks/components/TasksList";
import React, { useState } from "react";
import { View } from "react-native";

export default function Wrapper() {
  return (
    <DateProvider>
      <ActivitiesProvider>
        <ChooseActivityToCreateProvider>
          <Home />
        </ChooseActivityToCreateProvider>
      </ActivitiesProvider>
    </DateProvider>
  );
}

const TABS = ["Habits", "Tasks"];

const Habits = () => {
  return <HabitsList displayAll={true} allowToDisplayNoHabits />;
};

const Tasks = () => {
  const { selectedDate } = useDate();
  return (
    <TasksList
      hasLabel
      date={selectedDate}
      displayAllTasks
      allowToDisplayNoTasks
    />
  );
};

function Home() {
  const { setSelectedDate } = useDate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { showModal } = useChooseActivityToCreate();

  return (
    <AppBackground className="">
      <Header />
      <DatePicker onDateSelected={setSelectedDate} />
      <View className="flex-1">
        <TabSwitcher
          tabs={TABS}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          components={[Habits, Tasks]}
        />
        <Add className="mb-[100px] right-[15px]" onPress={showModal} />
      </View>
    </AppBackground>
  );
}
