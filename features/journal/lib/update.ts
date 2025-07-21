import { db } from "@/db/db";
import { noteTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateNote({
  id,
  title,
  content,
  images,
  color,
}: {
  id: string;
  title: string;
  content: string;
  images: string[];
  color: string;
}) {
  const now = new Date();
  await db
    .update(noteTable)
    .set({
      title,
      content,
      images: JSON.stringify(images),
      color,
      editedAt: now,
    })
    .where(eq(noteTable.id, id));
}
