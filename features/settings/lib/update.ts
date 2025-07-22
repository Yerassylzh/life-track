import { db } from "@/db/db";
import { settingsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function changeSetting(key: string, value: string) {
  await db
    .update(settingsTable)
    .set({ [key]: value })
    .where(eq(settingsTable.id, 1));
}
