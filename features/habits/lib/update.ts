import { db } from "@/db/db";
import { habitCompletionTable } from "@/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";

export async function markHabitAsCompleted(habitId: string) {
  await db.insert(habitCompletionTable).values({
    id: uuid(),
    habitId,
    completedAt: new Date(),
  });
  // await db.delete(habitCompletionTable);
  // console.log(await db.query.habitCompletionTable.findMany());
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
