import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { RefObject, useCallback } from "react";

export type ModalBottomSheetProps = {
  ref?: RefObject<BottomSheetModal | null>;
  children?: React.ReactNode;
};

const ModalBottomSheet = ({ children, ref }: ModalBottomSheetProps) => {
  const { theme } = usePreferredColorTheme();
  // const snapPoints = useMemo(() => [300], []);

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

  return (
    <BottomSheetModal
      ref={ref}
      enablePanDownToClose
      enableContentPanningGesture={true}
      enableDynamicSizing={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        borderRadius: 24,
        backgroundColor: theme === "light" ? "white" : Colors["gray-900"],
      }}
      handleIndicatorStyle={{
        backgroundColor:
          theme === "light" ? Colors["gray-400"] : Colors["gray-600"],
      }}
    >
      <BottomSheetScrollView>
        <BottomSheetView className="px-4 py-10">{children}</BottomSheetView>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default ModalBottomSheet;
