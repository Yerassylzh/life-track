import { db } from "@/db/db";
import { taskTable } from "@/db/schema";
import { YMDToDate } from "@/lib/date";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";

export async function createTask(
  title: string,
  date: string,
  reminderId: string | null
) {
  try {
    const newTask = {
      id: uuid(),
      name: title,
      targetDate: YMDToDate(date),
      reminder: reminderId,
    };

    await db.insert(taskTable).values(newTask);
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
