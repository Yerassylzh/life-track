import { Colors } from "@/lib/colors";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function BackHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = useNavigation();

  return (
    <View className="flex-row justify-start items-center p-4 gap-2">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Entypo name="chevron-left" size={26} color={Colors.primary} />
      </TouchableOpacity>
      {children}
    </View>
  );
}
