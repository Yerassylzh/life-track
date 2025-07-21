import { db } from "@/db/db";
import { noteTable } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";

export async function createNote({
  title,
  content,
  images,
  color,
}: {
  title: string;
  content: string;
  images: string[];
  color: string;
}) {
  const now = Date.now();
  const id = uuidv4();
  const note: typeof noteTable.$inferInsert = {
    id,
    title,
    content,
    createdAt: new Date(now),
    editedAt: new Date(now),
    images: JSON.stringify(images),
    color,
  };
  await db.insert(noteTable).values(note);
  return id;
}
