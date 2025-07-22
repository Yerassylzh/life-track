import AppBackground from "@/components/AppBackground";
import Add from "@/components/ui/Add";
import NoActivities from "@/features/home/components/NoActivities";
import Header from "@/features/journal/components/Header";
import JournalTimeline from "@/features/journal/components/JournalTimeline";
import {
  JournalProvider,
  useJournalContext,
} from "@/features/journal/context/JournalContext";
import { fileExists } from "@/lib/gallery";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

export default function JournalWrapper() {
  return (
    <JournalProvider>
      <JournalScreen />
    </JournalProvider>
  );
}

function JournalScreen() {
  const { notes } = useJournalContext();
  const [imageMap, setImageMap] = useState<Record<string, string | null>>({});

  // Preload first available image for each note (if exists)
  useEffect(() => {
    if (!notes) return;
    let cancelled = false;
    (async () => {
      const map: Record<string, string | null> = {};
      for (const note of notes) {
        let found: string | null = null;
        try {
          const images: string[] = JSON.parse(note.images || "[]");
          for (const img of images) {
            if (await fileExists(img)) {
              found = img;
              break;
            }
          }
        } catch {}
        map[note.id] = found;
      }
      if (!cancelled) setImageMap(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [notes]);

  return (
    <AppBackground>
      <Header />
      {notes && notes.length > 0 ? (
        <JournalTimeline notes={notes} imageMap={imageMap} />
      ) : (
        <NoActivities customTitle="No journal entries yet" />
      )}
      <Add
        className="mb-[100px] right-[15px]"
        onPress={() => router.navigate("/journal/create/create")}
      />
    </AppBackground>
  );
}
