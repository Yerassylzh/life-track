import { db } from "@/db/db";
import { noteTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getNote(id: string) {
  const notes = await db
    .select()
    .from(noteTable)
    .where(eq(noteTable.id, id))
    .limit(1);
  return notes[0] || null;
}
