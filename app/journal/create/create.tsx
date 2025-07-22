import JournalForm from "@/features/journal/components/JournalForm";
import { useJournalFormContext } from "@/features/journal/context/JournalFormContext";
import { createNote } from "@/features/journal/lib/create";
import { updateNote } from "@/features/journal/lib/update";
import React, { useCallback, useState } from "react";

export default function Create() {
  const [created, setCreated] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);

  const { title, plainContent, richContent, images, color } =
    useJournalFormContext();

  const onEdit = useCallback(async () => {
    if (!title.trim() && !plainContent.trim()) return;
    if (created && noteId) {
      await updateNote({
        id: noteId,
        title: title,
        plainContent: plainContent,
        richContent: richContent,
        images: images,
        color: color,
      });
      return;
    }

    try {
      const id = await createNote({
        title: title,
        plainContent: plainContent,
        richContent: richContent,
        images: images,
        color: color,
      });
      setNoteId(id);
      setCreated(true);
    } catch (err) {
      console.log(err);
    }
  }, [created, noteId, title, plainContent, richContent, images, color]);

  return <JournalForm onEdit={onEdit} noteId={noteId} />;
}
