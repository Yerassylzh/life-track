import ViewSwitcher from "@/components/ViewSwitcher";
import React, { useEffect } from "react";

type Props = {
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export default function HabitReviewPeriodFilter({
  selectedIndex,
  onSelect,
}: Props) {
  useEffect(() => {
    console.log("View switcher rerender");
  });

  return (
    <ViewSwitcher
      views={["Today", "Weekly", "Overall"]}
      selectedIndex={selectedIndex}
      onSelect={onSelect}
      elementWidth={80}
    />
  );
}
