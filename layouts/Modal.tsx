import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import React from "react";
import { Dimensions, Modal as NativeModal, View } from "react-native";

interface Props {
  children: React.ReactNode;
  visible: boolean;
  onRequestClose: () => void;
}

const { width } = Dimensions.get("window");

export default function Modal({ children, visible, onRequestClose }: Props) {
  const { theme } = usePreferredColorTheme();

  return (
    <View>
      <NativeModal
        animationType="fade"
        backdropColor={"rgba(110,110,110,0.05)"}
        visible={visible}
        onRequestClose={onRequestClose}
      >
        <View className="flex-1 flex items-center justify-center">
          <View
            className={cn(
              "bg-white rounded-xl p-4 pb-0",
              theme === "dark" && "bg-black"
            )}
            style={{
              width: width * 0.8,
            }}
          >
            {children}
          </View>
        </View>
      </NativeModal>
    </View>
  );
}
