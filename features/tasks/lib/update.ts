import { db } from "@/db/db";
import { taskTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function markTaskAsCompleted(taskId: string) {
  await db
    .update(taskTable)
    .set({
      completedAt: new Date(),
    })
    .where(eq(taskTable.id, taskId));
}

export async function markTaskAsUncompleted(taskId: string) {
  await db
    .update(taskTable)
    .set({
      completedAt: null,
    })
    .where(eq(taskTable.id, taskId));
}
