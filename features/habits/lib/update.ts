import { db } from "@/db/db";
import { habitCompletionTable, habitTable } from "@/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";

export async function markHabitAsCompleted(
  habitId: string,
  unitValue: number | null
) {
  const dateStart = new Date();
  dateStart.setHours(0, 0, 0, 0);
  const dateEnd = new Date(dateStart);
  dateEnd.setDate(dateEnd.getDate() + 1);

  const existingCompletion = await db
    .select()
    .from(habitCompletionTable)
    .where(
      and(
        eq(habitCompletionTable.habitId, habitId),
        gte(habitCompletionTable.completedAt, dateStart),
        lt(habitCompletionTable.completedAt, dateEnd)
      )
    )
    .limit(1);

  if (existingCompletion.length > 0) {
    console.log(
      "Habit already completed at this day. New completion is ignored."
    );
    return;
  }
  await db.insert(habitCompletionTable).values({
    id: uuid(),
    habitId,
    completedAt: new Date(),
    unitValue,
  });
}

export async function markHabitAsUncompleted(habitId: string, date: string) {
  const dateStart = new Date(date); // "2025-07-13T00:00:00.000Z"
  const dateEnd = new Date(dateStart);
  dateEnd.setDate(dateEnd.getDate() + 1);

  await db
    .delete(habitCompletionTable)
    .where(
      and(
        eq(habitCompletionTable.habitId, habitId),
        gte(habitCompletionTable.completedAt, dateStart),
        lt(habitCompletionTable.completedAt, dateEnd)
      )
    );
}

export async function updateHabit(
  habitId: string,
  data: {
    name: string;
    description: string;
    unit: string | null;
    iconName: string;
    color: string;
    repeatType: "daily" | "weekly" | "monthly";
    daysOfWeek: string;
    weeklyFreq: number;
    monthlyDays: string;
    reminder: string | null;
  }
) {
  if (data.unit?.length === 0) {
    data.unit = null;
  }

  try {
    await db
      .update(habitTable)
      .set({
        name: data.name,
        description: data.description,
        unit: data.unit,
        iconName: data.iconName,
        color: data.color,
        repeatType: data.repeatType,
        daysOfWeek: data.daysOfWeek,
        weeklyFreq: data.weeklyFreq,
        monthlyDays: data.monthlyDays,
        reminder: data.reminder,
      })
      .where(eq(habitTable.id, habitId));
    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
}
