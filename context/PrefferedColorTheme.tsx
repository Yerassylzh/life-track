import { useStorage } from "@/hooks/useStorage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useColorScheme } from "react-native";

type PreferredColorTheme = "light" | "dark" | "system";

interface PreferredColorThemeContextProps {
  isSystem: boolean;
  theme: "light" | "dark";
  changeTheme: (theme: PreferredColorTheme) => void;
}

const PreferredColorThemeContext = createContext<
  PreferredColorThemeContextProps | undefined
>(undefined);

export const usePreferredColorTheme = () => {
  const context = useContext(PreferredColorThemeContext);
  if (!context) {
    throw new Error(
      "usePreferredColorTheme must be used within a PreferredColorThemeProvider"
    );
  }
  return context;
};

interface ProviderProps {
  children: ReactNode;
  initialTheme?: PreferredColorTheme;
}

export const PreferredColorThemeProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const systemTheme = useColorScheme();
  const [isSystem, setIsSystem] = useStorage<boolean>("isSystemTheme", true);
  const [theme, setTheme] = useStorage<"light" | "dark">("theme", "light");

  const changeTheme = useCallback(
    (pTheme: PreferredColorTheme) => {
      if (pTheme === "system") {
        setIsSystem(true);
        setTheme(systemTheme || "light");
      } else {
        setIsSystem(false);
        setTheme(pTheme);
      }
    },
    [systemTheme, setIsSystem, setTheme]
  );

  useEffect(() => {
    changeTheme("system");
  }, [changeTheme]);

  return (
    <PreferredColorThemeContext.Provider
      value={{ isSystem, theme, changeTheme }}
    >
      {children}
    </PreferredColorThemeContext.Provider>
  );
};
