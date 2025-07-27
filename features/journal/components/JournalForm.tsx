import AppBackground from "@/components/AppBackground";
import InterText from "@/components/ui/InterText";
import { useScreenInsetsColor } from "@/context/ScreenInsetsColorContext";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { askForMediaLibraryPermission } from "@/lib/gallery";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Camera, ChevronLeft, Shirt, Trash2 } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useChooseNoteBackgroundColorModal } from "../context/ChooseNoteBackgroundColorModalContext";
import { useJournalFormContext } from "../context/JournalFormContext";
import { deleteNote } from "../lib/delete";
import SelectedImages from "./SelectedImages";

type Props = {
  onEdit: () => void;
  noteId: string | null;
  initialContentBody?: string;
};

export default function JournalForm({
  onEdit,
  noteId,
  initialContentBody,
}: Props) {
  const {
    title,
    setTitle,
    setPlainContent,
    setRichContent,
    images,
    setImages,
    color,
    date,
    richContent,
    editorRef,
  } = useJournalFormContext();
  const { showModal } = useChooseNoteBackgroundColorModal();
  const { setCustomInsetColor } = useScreenInsetsColor();

  const keyboardHeight = useKeyboardHeight();

  useEffect(() => {
    onEdit();
  }, [onEdit]);

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

  const scrollRef = useRef<ScrollView>(null);
  const handleCursorPosition = useCallback((scrollY: number) => {
    // Positioning scroll bar
    scrollRef.current!.scrollTo({ y: scrollY - 200, animated: true });
  }, []);

  return (
    <AppBackground style={{ backgroundColor: color }}>
      <View className="flex-row justify-start items-center py-4 gap-2 px-[16px]">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={26} color={"black"} />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleAddImage}>
            <Camera size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleColorPick}>
            <Shirt size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Trash2 size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAvoidingView behavior="padding" className="flex-1 relative">
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          ref={scrollRef}
        >
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

          <RichEditor
            ref={editorRef}
            onLoad={() => {
              editorRef.current?.setContentHTML(richContent);
            }}
            onChange={(content: string) => {
              setRichContent(content);
              setPlainContent(content.replace(/<[^>]*>/g, "") || "");
            }}
            // eslint-disable-next-line react-hooks/exhaustive-deps
            initialContentHTML={useMemo(() => initialContentBody, [])}
            initialHeight={Dimensions.get("window").height * 0.8}
            placeholder="Start typing..."
            useContainer={true}
            onCursorPosition={handleCursorPosition}
            editorStyle={{
              caretColor: Colors.primary,
              backgroundColor: "transparent",
              placeholderColor: Colors["gray-500"],
            }}
          />
        </ScrollView>
        {keyboardHeight > 0 && (
          <View
            className="absolute z-10 bottom-0 bg-red-500 w-full"
            style={{ bottom: keyboardHeight }}
          >
            <RichToolbar editor={editorRef} />
          </View>
        )}
      </KeyboardAvoidingView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 100,
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
