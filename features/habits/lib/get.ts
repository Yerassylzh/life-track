import { db } from "@/db/db";
import { HabitWithCompletions } from "@/db/types";

export async function getHabits(): Promise<
  | {
      success: true;
      habits: HabitWithCompletions[];
    }
  | {
      success: false;
      error: any;
    }
> {
  try {
    const habits = await db.query.habitTable.findMany({
      with: {
        completions: true,
      },
    });

    return {
      success: true,
      habits: habits,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
}
