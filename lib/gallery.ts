import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export async function askForMediaLibraryPermission() {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert(
      "Permission required",
      "You need to allow access to your photos to add images."
    );
    return false;
  }
  return true;
}

export async function fileExists(uri: string): Promise<boolean> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    return info.exists;
  } catch {
    return false;
  }
}
