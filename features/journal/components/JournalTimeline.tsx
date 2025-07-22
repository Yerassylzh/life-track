import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Note } from "@/db/schema";
import { cn } from "@/lib/tailwindClasses";
import { FlashList } from "@shopify/flash-list";
import React, { useMemo } from "react";
import NoteCard from "./NoteCard";

export type JournalTimelineProps = {
  notes: Note[];
  imageMap: Record<string, string | null>;
};

type Section = {
  title: string;
  data: Note[];
};

type FlatDataItem =
  | { type: "header"; title: string }
  | { type: "note"; note: Note };

function groupNotesByMonth(notes: Note[] | undefined): Section[] {
  if (!notes) return [];
  const groups: Record<string, { year: number; month: number; notes: Note[] }> =
    {};
  notes.forEach((note: Note) => {
    const date = new Date(note.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;
    if (!groups[key]) groups[key] = { year, month, notes: [] };
    groups[key].notes.push(note);
  });
  // Sort by year/month descending
  const sorted = Object.values(groups).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
  return sorted.map((g) => ({
    title: `${new Date(g.year, g.month).toLocaleString(undefined, { month: "long" })} ${g.year}`,
    data: g.notes.sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      return bDate - aDate;
    }),
  }));
}

const JournalTimeline: React.FC<JournalTimelineProps> = ({
  notes,
  imageMap,
}) => {
  const sections = useMemo(() => groupNotesByMonth(notes), [notes]);
  const flatData: FlatDataItem[] = useMemo(() => {
    const arr: FlatDataItem[] = [];
    for (const section of sections) {
      arr.push({ type: "header", title: section.title });
      for (const note of section.data) {
        arr.push({ type: "note", note });
      }
    }
    return arr;
  }, [sections]);

  const { theme } = usePreferredColorTheme();

  return (
    <FlashList
      data={flatData}
      estimatedItemSize={180}
      renderItem={({ item }) => {
        if (item.type === "header") {
          return (
            <InterText
              className={cn(
                "mt-6 mb-2 items-center text-lg font-bold text-zinc-900 text-center",
                theme === "dark" && "text-zinc-100"
              )}
            >
              {item.title}
            </InterText>
          );
        }
        return <NoteCard note={item.note} imageUri={imageMap[item.note.id]} />;
      }}
      keyExtractor={(item, idx) =>
        item.type === "header" ? `header-${item.title}` : item.note.id
      }
      contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default JournalTimeline;
