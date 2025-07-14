import { db } from "@/db/db";
import { habitTable } from "@/db/schema";

export async function deleteAllHabits(): Promise<void> {
  try {
    await db.delete(habitTable);
  } catch (err) {
    console.log(err);
  }
}
