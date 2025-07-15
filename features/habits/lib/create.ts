import { db } from "@/db/db";
import { habitTable } from "@/db/schema";
import { ColorPalette } from "@/lib/colors";
import { eq } from "drizzle-orm";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";

export async function createHabit(
  title: string,
  description: string,
  unit: string,
  colorIndex: number,
  repeatType: "daily" | "weekly" | "monthly",
  daysOfWeek: number[],
  weeklyFreq: number,
  monthlyDays: number[],
  reminderIds: string | null
) {
  try {
    const newHabit = {
      id: uuid(),
      name: title,
      description,
      color: ColorPalette[colorIndex],
      repeatType,
      daysOfWeek: JSON.stringify(daysOfWeek),
      weeklyFreq,
      monthlyDays: JSON.stringify(monthlyDays),
      reminder: reminderIds,
      unit,
    };
    await db.insert(habitTable).values(newHabit);
    const habit = await db.query.habitTable.findFirst({
      where: eq(habitTable.id, newHabit.id),
      with: {
        completions: true,
      },
    });

    return {
      success: true,
      habit,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
}
