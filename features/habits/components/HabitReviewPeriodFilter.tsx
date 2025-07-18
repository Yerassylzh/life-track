import ViewSwitcher from "@/components/ViewSwitcher";
import React from "react";

type Props = {
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export default function HabitReviewPeriodFilter({
  selectedIndex,
  onSelect,
}: Props) {
  return (
    <ViewSwitcher
      views={["Today", "Weekly", "Overall"]}
      selectedIndex={selectedIndex}
      onSelect={onSelect}
      elementWidth={80}
    />
  );
}
