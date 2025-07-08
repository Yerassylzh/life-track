import AppLoading from "@/components/AppLoading";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";

export default function FontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    "Inter-Light": Inter_300Light,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return children;
}
