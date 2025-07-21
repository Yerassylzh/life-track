import { Colors } from "@/lib/colors";
import React, { createContext, useContext, useMemo, useState } from "react";
import { usePreferredColorTheme } from "./PrefferedColorTheme";

interface ScreenInsetsColorContextType {
  insetColor: string;
  setCustomInsetColor: (color: string | null) => void;
}

const ScreenInsetsColorContext = createContext<
  ScreenInsetsColorContextType | undefined
>(undefined);

export const ScreenInsetsColorProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { theme } = usePreferredColorTheme();
  const defaultInsetColor = useMemo(
    () => (theme === "dark" ? Colors["gray-950"] : Colors["gray-50"]),
    [theme]
  );
  const [customInsetColor, setCustomInsetColor] = useState<string | null>(null);

  return (
    <ScreenInsetsColorContext.Provider
      value={{
        insetColor: customInsetColor || defaultInsetColor,
        setCustomInsetColor,
      }}
    >
      {children}
    </ScreenInsetsColorContext.Provider>
  );
};

export function useScreenInsetsColor() {
  const ctx = useContext(ScreenInsetsColorContext);
  if (!ctx)
    throw new Error(
      "useScreenInsetsColor must be used within ScreenInsetsColorProvider"
    );
  return ctx;
}
