import React, { useMemo } from "react";
import { useNewHabit } from "../context/NewHabitContext";
import FillDaily from "./FillRepeatTypeDaily";
import FillRepeatTypeMonthly from "./FillRepeatTypeMonthly";
import FillRepeatTypeWeekly from "./FillRepeatTypeWeekly";

export default function FillRepeatTypeDetails() {
  const { repeatType } = useNewHabit();

  const toRender = useMemo(() => {
    return {
      daily: <FillDaily />,
      weekly: <FillRepeatTypeWeekly />,
      monthly: <FillRepeatTypeMonthly />,
    }[repeatType];
  }, [repeatType]);

  return toRender;
}
