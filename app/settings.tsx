import { Colors } from "@/lib/colors";
import React, { useRef } from "react";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

export default function Settings() {
  const ref = useRef<RichEditor>(null);

  return (
    <SafeAreaView style={styles.root}>
      <RichToolbar editor={ref} />
      <View style={{ flex: 1 }}>
        <RichEditor
          ref={ref}
          initialHeight={Dimensions.get("window").height}
          placeholder="Start typing..."
          editorStyle={{ caretColor: Colors.primary }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    alignSelf: "center",
    paddingVertical: 10,
  },
  root: {
    flex: 1,
    backgroundColor: "#eaeaea",
  },
  editor: {
    flex: 1,
    padding: 0,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: 30,
    marginVertical: 5,
    backgroundColor: "white",
  },
});
