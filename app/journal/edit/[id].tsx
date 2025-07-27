import JournalForm from "@/features/journal/components/JournalForm";
import { useJournalFormContext } from "@/features/journal/context/JournalFormContext";
import { getNote } from "@/features/journal/lib/get";
import { updateNote } from "@/features/journal/lib/update";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect } from "react";

export default function Edit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    setTitle,
    setPlainContent,
    setRichContent,
    setImages,
    setColor,
    setDate,
    title,
    plainContent,
    richContent,
    images,
    color,
    editorRef,
  } = useJournalFormContext();

  useEffect(() => {
    (async () => {
      const note = await getNote(id);
      if (note) {
        setTitle(note.title);
        setPlainContent(note.plainContent);
        setRichContent(note.richContent);
        editorRef.current?.setContentHTML(note.richContent);
        setImages(JSON.parse(note.images || "[]"));
        setColor(note.color);
        setDate(new Date(note.createdAt));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, editorRef]);

  const onEdit = useCallback(async () => {
    if (!id) return;
    if (!title.trim() && !plainContent.trim()) return;
    await updateNote({
      id: id,
      title,
      plainContent,
      richContent,
      images,
      color,
    });
  }, [id, title, plainContent, richContent, images, color]);

  return <JournalForm onEdit={onEdit} noteId={id} />;
}
