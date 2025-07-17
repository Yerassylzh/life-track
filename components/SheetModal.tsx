import React from "react";
import { Dimensions } from "react-native";
import ModalBottomSheet, { ModalBottomSheetProps } from "./ModalBottomSheet";

type Props = {
  approximateHeight?: number;
} & ModalBottomSheetProps;

const WINDOW_HEIGHT = Dimensions.get("window").height;

export default function SheetModal({
  approximateHeight = 200,
  children,
  style,
  handleIndicatorStyle,
  ...rest
}: Props) {
  return (
    <ModalBottomSheet
      detached
      style={[{ marginHorizontal: 20 }, style]}
      bottomInset={(WINDOW_HEIGHT - approximateHeight) / 2}
      handleIndicatorStyle={[
        { display: "none", height: 0 },
        handleIndicatorStyle,
      ]}
      paddingY={10}
      {...rest}
    >
      {children}
    </ModalBottomSheet>
  );
}
