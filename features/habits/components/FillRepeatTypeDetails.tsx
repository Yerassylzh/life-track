import React, { useMemo } from "react";
import { useHabitForm } from "../context/HabitFormContext";
import FillDaily from "./FillRepeatTypeDaily";
import FillRepeatTypeMonthly from "./FillRepeatTypeMonthly";
import FillRepeatTypeWeekly from "./FillRepeatTypeWeekly";

export default function FillRepeatTypeDetails() {
  const { repeatType } = useHabitForm();

  const toRender = useMemo(() => {
    return {
      daily: <FillDaily />,
      weekly: <FillRepeatTypeWeekly />,
      monthly: <FillRepeatTypeMonthly />,
    }[repeatType];
  }, [repeatType]);

  return toRender;
}
