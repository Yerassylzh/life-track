import { db } from "@/db/db";
import { Task, taskTable } from "@/db/schema";
import { deleteNotification } from "@/lib/notifications";
import { eq } from "drizzle-orm";

export const deleteTask = async (task: Task) => {
  if (task.reminder) {
    const reminderId = (JSON.parse(task.reminder) as string[])[0];
    await deleteNotification(reminderId);
  }
  await db.delete(taskTable).where(eq(taskTable.id, task.id));
};
