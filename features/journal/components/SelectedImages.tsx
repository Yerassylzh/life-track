import { useFullScreenImageModal } from "@/context/FullScreenImageModalContext";
import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useJournalFormContext } from "../context/JournalFormContext";

export default function SelectedImages() {
  const { images } = useJournalFormContext();
  const { showModal } = useFullScreenImageModal();

  return (
    <View
      style={{
        height: images.length > 0 ? 80 : 20,
        marginTop: images.length > 0 ? 10 : 0,
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((img, idx) => (
          <Pressable
            key={idx}
            style={styles.galleryImage}
            onPress={() => {
              console.log("pressed");
              showModal(images, idx);
            }}
          >
            <Image source={{ uri: img }} style={styles.galleryImage} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  galleryImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
  },
});
