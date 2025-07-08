import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import Svg, { Path } from "react-native-svg";

export default function TabLayout() {
  const { theme } = usePreferredColorTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["primary"],
        headerShown: false,
        tabBarStyle: {
          backgroundColor:
            theme === "dark" ? Colors["gray-950"] : Colors["gray-50"],
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "habits",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width="62" height="52" viewBox="0 0 62 52" fill="none">
      <Path
        d="M61.983 25.9492C61.983 27.7773 60.3685 29.2094 58.5386 29.2094H55.0941L55.1695 45.4797C55.1695 45.7539 55.148 46.0281 55.1157 46.3023V47.9476C55.1157 50.1922 53.1889 52.0101 50.8101 52.0101H49.0879C48.9695 52.0101 48.8511 52.0101 48.7327 52C48.582 52.0101 48.4313 52.0101 48.2806 52.0101L44.7823 52H42.199C39.8202 52 37.8934 50.182 37.8934 47.9375V45.5V39C37.8934 37.2023 36.3542 35.75 34.449 35.75H27.5601C25.6549 35.75 24.1157 37.2023 24.1157 39V45.5V47.9375C24.1157 50.182 22.1889 52 19.8101 52H17.2268H13.7931C13.6316 52 13.4702 51.9898 13.3087 51.9796C13.1795 51.9898 13.0504 52 12.9212 52H11.199C8.82017 52 6.89343 50.182 6.89343 47.9375V36.5625C6.89343 36.4711 6.89343 36.3695 6.9042 36.2781V29.1992H3.45975C1.52225 29.1992 0.0153046 27.7773 0.0153046 25.939C0.0153046 25.025 0.338221 24.2125 1.09169 23.5015L28.6796 0.812499C29.433 0.101562 30.2941 0 31.0476 0C31.8011 0 32.6622 0.203125 33.308 0.710937L60.799 23.5117C61.6601 24.2226 62.0907 25.0351 61.983 25.9492Z"
        fill={color}
      />
    </Svg>
  );
}
