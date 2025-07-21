import AppBackground from "@/components/AppBackground";
import InterText from "@/components/ui/InterText";
import { useScreenInsetsColor } from "@/context/ScreenInsetsColorContext";
import SelectedImages from "@/features/journal/components/SelectedImages";
import { useChooseNoteBackgroundColorModal } from "@/features/journal/context/ChooseNoteBackgroundColorModalContext";
import { useJournalFormContext } from "@/features/journal/context/JournalFormContext";
import { createNote } from "@/features/journal/lib/create";
import { deleteNote } from "@/features/journal/lib/delete";
import { updateNote } from "@/features/journal/lib/update";
import { askForMediaLibraryPermission } from "@/lib/gallery";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Create() {
  const {
    title,
    setTitle,
    content,
    setContent,
    images,
    setImages,
    color,
    date,
  } = useJournalFormContext();
  const { showModal } = useChooseNoteBackgroundColorModal();
  const { setCustomInsetColor } = useScreenInsetsColor();
  const [created, setCreated] = useState(false);
  const [noteId, setNoteId] = useState<string | undefined>(undefined);

  const handleColorPick = useCallback(() => {
    showModal();
  }, [showModal]);

  useEffect(() => {
    setCustomInsetColor(color);
    return () => {
      setCustomInsetColor(null);
    };
  }, [color, setCustomInsetColor]);

  const handleAddImage = useCallback(async () => {
    if (!(await askForMediaLibraryPermission())) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  }, [images, setImages]);

  const handleDelete = useCallback(() => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!noteId) return;
          await deleteNote(noteId);
          router.back();
        },
      },
    ]);
  }, [noteId]);

  const saveNote = useCallback(async () => {
    if (!title.trim() && !content.trim()) return;
    if (created && noteId) {
      await updateNote({
        id: noteId,
        title,
        content,
        images,
        color: color,
      });
      return;
    }

    try {
      const id = await createNote({
        title,
        content,
        images,
        color: color,
      });
      setNoteId(id);
      setCreated(true);
    } catch (err) {
      console.log(err);
    }
  }, [title, content, images, color, created, noteId]);

  useEffect(() => {
    saveNote();
  }, [saveNote]);

  return (
    <AppBackground style={{ backgroundColor: color }}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row justify-start items-center py-4 gap-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Entypo name="chevron-left" size={26} color={"black"} />
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={handleAddImage}>
              <Feather name="camera" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleColorPick}>
              <MaterialCommunityIcons
                name="tshirt-crew-outline"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Feather name="trash-2" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <InterText style={styles.date}>
          {date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </InterText>

        <TextInput
          style={styles.title}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="#3f3f46"
        />

        <SelectedImages />

        <TextInput
          style={styles.content}
          value={content}
          onChangeText={setContent}
          placeholder="Start writing..."
          placeholderTextColor="#3f3f46"
          multiline
          textAlignVertical="top"
        />
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerIcons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
  },
  date: {
    fontSize: 14,
    opacity: 0.9,
    marginTop: 8,
    marginBottom: 4,
    color: "#18181b",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#18181b",
    paddingVertical: 8,
  },

  content: {
    fontSize: 16,
    color: "#18181b",
    lineHeight: 24,
    flex: 1,
    paddingTop: 8,
    textAlignVertical: "top",
    minHeight: 200,
  },
});
