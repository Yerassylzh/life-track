import InterText from "@/components/ui/InterText";
import Modal from "@/layouts/Modal";
import { cn } from "@/lib/tailwindClasses";
import React, { createContext, useCallback, useContext, useState } from "react";
import { Pressable, View } from "react-native";
import { usePreferredColorTheme } from "./PrefferedColorTheme";

export type Option = {
  optionName: string;
  onPress: () => void;
};

interface ChooseOptionModalContextType {
  showModal: (options: Option[]) => void;
}

const ChooseOptionModalContext = createContext<
  ChooseOptionModalContextType | undefined
>(undefined);

export const ChooseOptionModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const { theme } = usePreferredColorTheme();
  const showModal = useCallback((opts: Option[]) => {
    setOptions(opts);
    setVisible(true);
  }, []);

  const handleOptionPress = (onPress: () => void) => {
    setVisible(false);
    onPress();
  };

  return (
    <ChooseOptionModalContext.Provider value={{ showModal }}>
      {children}
      <Modal visible={visible} onRequestClose={() => setVisible(false)}>
        <View
          className={cn(
            "bg-white rounded-2xl p-4",
            theme === "dark" ? "bg-zinc-900" : "bg-white"
          )}
        >
          {options.map((opt, idx) => (
            <Pressable
              key={opt.optionName + idx}
              onPress={() => handleOptionPress(opt.onPress)}
              className={cn(
                "py-3 px-2 border-b border-zinc-200 last:border-b-0",
                theme === "dark" ? "border-zinc-700" : "border-zinc-200"
              )}
            >
              <InterText
                className={cn(
                  "text-base text-zinc-900 text-center",
                  theme === "dark" ? "text-zinc-100" : "text-zinc-900"
                )}
              >
                {opt.optionName}
              </InterText>
            </Pressable>
          ))}
        </View>
      </Modal>
    </ChooseOptionModalContext.Provider>
  );
};

export function useChooseOptionModal() {
  const ctx = useContext(ChooseOptionModalContext);
  if (!ctx)
    throw new Error(
      "useChooseOptionModal must be used within ChooseOptionModalProvider"
    );
  return ctx;
}
