import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { cn } from "@/lib/tailwindClasses";
import { Pressable, TextStyle, View } from "react-native";
import InterText from "../ui/InterText";

type ConfirmFooterProps = {
  onOk: () => void;
  okLabel?: string;
  okClassName?: string;
  okStyle?: TextStyle;

  onCancel: () => void;
  cancelLabel?: string;
  cancelClassName?: string;
  cancelStyle?: TextStyle;
};

function ConfirmFooter({
  onOk,
  okLabel,
  okClassName,
  okStyle,

  onCancel,
  cancelLabel,
  cancelClassName,
  cancelStyle,
}: ConfirmFooterProps) {
  const { theme } = usePreferredColorTheme();

  return (
    <View
      className={cn(
        "flex-row items-center gap-2 border-t border-t-gray-100",
        theme === "dark" && "border-t-gray-800"
      )}
    >
      <Pressable
        style={{
          flex: 1,
        }}
        className={cn(
          "items-center justify-center py-3 border-r border-r-gray-100",
          theme === "dark" && "border-r-gray-800"
        )}
        onPress={() => {
          console.log("Pressed");
          onCancel();
        }}
      >
        <InterText
          className={cn("font-semibold text-base", cancelClassName)}
          style={cancelStyle}
        >
          {cancelLabel || "CANCEL"}
        </InterText>
      </Pressable>
      <Pressable
        style={{ flex: 1 }}
        className="items-center justify-center py-3"
        onPress={onOk}
      >
        <InterText
          className={cn("font-semibold text-base text-red-500", okClassName)}
          style={okStyle}
        >
          {okLabel || "OK"}
        </InterText>
      </Pressable>
    </View>
  );
}
