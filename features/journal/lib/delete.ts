import { db } from "@/db/db";
import { noteTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteNote(id: string) {
  await db.delete(noteTable).where(eq(noteTable.id, id));
}
