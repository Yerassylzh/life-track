import InterText from "@/components/ui/InterText";
import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Note } from "@/db/schema";
import TimelineDateCircle from "@/features/journal/components/TimelineDateCircle";
import { Colors } from "@/lib/colors";
import { hexToRgba } from "@/lib/hex";
import { cn } from "@/lib/tailwindClasses";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, Pressable, View } from "react-native";

const { width } = Dimensions.get("window");

function cropTitle(title: string, max: number = 40) {
  return title.length > max ? title.slice(0, max - 1) + "…" : title;
}

export type NoteCardProps = { note: Note; imageUri: string | null };

const NoteCard = React.memo(function NoteCard({
  note,
  imageUri,
}: NoteCardProps) {
  const { theme } = usePreferredColorTheme();
  const date = new Date(note.createdAt);
  const day = date.getDate();
  const weekday = date.toLocaleDateString(undefined, { weekday: "short" });
  const preview =
    note.plainContent.split(/\s+/).slice(0, 30).join(" ") +
    (note.plainContent.split(/\s+/).length > 30 ? "..." : "");

  return (
    <Pressable
      className="flex-row items-start pb-1 gap-2"
      onPress={() =>
        router.navigate({
          pathname: "/journal/edit/[id]",
          params: { id: note.id },
        })
      }
    >
      <TimelineDateCircle day={day} weekday={weekday} color={note.color} />
      <View
        className={cn(
          "flex-1 rounded-xl border border-gray-200 mb-6 gap-3",
          theme === "light" ? "bg-gray-50" : "bg-gray-950",
          theme === "dark" && "border-gray-800"
        )}
        style={{
          backgroundColor:
            theme === "light" ? Colors["gray-50"] : Colors["gray-900"],
        }}
      >
        <View
          className="flex-row justify-start items-center px-2 py-1.5 rounded-t-xl"
          style={{ backgroundColor: note.color }}
        >
          <InterText
            className="font-semibold text-base"
            customColor={hexToRgba(Colors["zinc-900"], 0.8)}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {cropTitle(note.title)}
          </InterText>
        </View>
        <View className="items-center justify-center">
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{ width: width - 43 - 16 * 2 - 12 * 2, aspectRatio: 1 }}
              className="rounded-xl mb-2"
              resizeMode="contain"
            />
          )}
        </View>
        <InterText className="text-sm px-2 pb-2">{preview}</InterText>
      </View>
    </Pressable>
  );
});

export default NoteCard;
