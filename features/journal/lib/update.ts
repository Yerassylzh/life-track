import { db } from "@/db/db";
import { noteTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateNote({
  id,
  title,
  plainContent,
  richContent,
  images,
  color,
}: {
  id: string;
  title: string;
  plainContent: string;
  richContent: string;
  images: string[];
  color: string;
}) {
  const now = new Date();
  if (title.length === 0) {
    title = "Untitled";
  }
  await db
    .update(noteTable)
    .set({
      title,
      plainContent,
      richContent,
      images: JSON.stringify(images),
      color,
      editedAt: now,
    })
    .where(eq(noteTable.id, id));
}
