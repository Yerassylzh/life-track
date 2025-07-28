import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import { cn } from "@/lib/tailwindClasses";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { View } from "lucide-react-native";
import React, { ReactNode, RefObject, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface ModalBottomSheetProps
  extends Omit<BottomSheetModalProps, "children"> {
  ref?: RefObject<BottomSheetModal | null>;
  children?: ReactNode | ReactNode[];
  paddingY?: number;
  className?: string;
}

const ModalBottomSheet = ({
  children,
  ref,
  paddingY,
  handleIndicatorStyle,
  backgroundStyle,
  className,
  ...rest
}: ModalBottomSheetProps) => {
  const { theme } = usePreferredColorTheme();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  const insets = useSafeAreaInsets();

  return (
    <BottomSheetModal
      ref={ref}
      enableContentPanningGesture={true}
      enableDynamicSizing={true}
      android_keyboardInputMode="adjustResize"
      keyboardBehavior="interactive"
      backdropComponent={renderBackdrop}
      enablePanDownToClose={false}
      backgroundStyle={[
        {
          borderRadius: 24,
          backgroundColor: theme === "light" ? "white" : Colors["gray-900"],
        },
        backgroundStyle,
      ]}
      handleIndicatorStyle={[
        {
          backgroundColor:
            theme === "light" ? Colors["gray-400"] : Colors["gray-600"],
        },
        handleIndicatorStyle,
      ]}
      {...rest}
    >
      <BottomSheetScrollView>
        <BottomSheetView
          className={cn("px-4", className)}
          style={{ paddingVertical: paddingY !== undefined ? paddingY : 40 }}
        >
          {children}
          <View
            style={{
              width: "100%",
              height: insets.bottom,
            }}
          />
        </BottomSheetView>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default ModalBottomSheet;
