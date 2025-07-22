import React, { createContext, useCallback, useContext, useState } from "react";
import { View } from "react-native";
import ImageView from "react-native-image-viewing";

interface FullScreenImageModalContextType {
  showModal: (images: string[], startIndex?: number) => void;
}

const FullScreenImageModalContext = createContext<
  FullScreenImageModalContextType | undefined
>(undefined);

export const FullScreenImageModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);

  const showModal = useCallback((imgs: string[], startIdx: number = 0) => {
    setImages(imgs);
    setImageIndex(startIdx);
    setVisible(true);
  }, []);

  const handleClose = () => setVisible(false);

  return (
    <FullScreenImageModalContext.Provider value={{ showModal }}>
      {children}
      <View>
        <ImageView
          images={images.map((image) => ({ uri: image }))}
          imageIndex={imageIndex}
          visible={visible}
          onRequestClose={handleClose}
          presentationStyle="fullScreen"
        />
      </View>
    </FullScreenImageModalContext.Provider>
  );
};

export function useFullScreenImageModal() {
  const ctx = useContext(FullScreenImageModalContext);
  if (!ctx)
    throw new Error(
      "useFullScreenImageModal must be used within FullScreenImageModalProvider"
    );
  return ctx;
}
