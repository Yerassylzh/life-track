import { usePreferredColorTheme } from "@/context/PrefferedColorTheme";
import { Colors } from "@/lib/colors";
import BottomSheetGorhom, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { RefObject, useCallback } from "react";

type Props = {
  ref: RefObject<BottomSheetGorhom | null>;
  children: React.ReactNode;
};

const BottomSheet = ({ children, ref }: Props) => {
  const { theme } = usePreferredColorTheme();
  // const snapPoints = useMemo(() => ["40%"], []);

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
    <BottomSheetGorhom
      ref={ref}
      index={-1}
      enablePanDownToClose
      enableContentPanningGesture={true}
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
      <BottomSheetView className="px-4 py-10">{children}</BottomSheetView>
    </BottomSheetGorhom>
  );
};

export default BottomSheet;
