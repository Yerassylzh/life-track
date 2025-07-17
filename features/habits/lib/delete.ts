import { db } from "@/db/db";
import { habitTable } from "@/db/schema";
import { HabitWithCompletions } from "@/db/types";
import { deleteNotification } from "@/lib/notifications";
import { eq } from "drizzle-orm";

export async function deleteHabit(habit: HabitWithCompletions): Promise<void> {
  try {
    if (habit.reminder) {
      const reminders = JSON.parse(habit.reminder) as string[];
      for (const reminder of reminders) {
        await deleteNotification(reminder);
      }
    }
    await db.delete(habitTable).where(eq(habitTable.id, habit.id));
  } catch (err) {
    console.log(err);
  }
}
