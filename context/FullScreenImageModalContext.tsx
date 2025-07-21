import { Feather } from "@expo/vector-icons";
import React, { createContext, useCallback, useContext, useState } from "react";
import { Dimensions, Image, Modal, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface FullScreenImageModalContextType {
  showModal: (images: string[], startIndex?: number) => void;
}

const FullScreenImageModalContext = createContext<
  FullScreenImageModalContextType | undefined
>(undefined);

const { width, height } = Dimensions.get("window");

export const FullScreenImageModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  const x = useSharedValue(0);

  const showModal = useCallback(
    (imgs: string[], startIdx: number = 0) => {
      setImages(imgs);
      setIndex(startIdx);
      setVisible(true);
      x.value = 0;
    },
    [x]
  );

  const handleClose = () => setVisible(false);

  const goToImage = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < images.length) {
      setIndex(newIndex);
      x.value = 0;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const onGestureEvent = Gesture.Pan()
    .onUpdate((event) => {
      x.value = event.translationX;
    })
    .onEnd((event) => {
      console.log("HERE");
      if (event.translationX < -150 && index < images.length - 1) {
        runOnJS(goToImage)(index + 1);
      } else if (event.translationX > 150 && index > 0) {
        runOnJS(goToImage)(index - 1);
      } else {
        x.value = withSpring(0, {
          damping: 10,
          stiffness: 100,
        });
      }
    });

  return (
    <FullScreenImageModalContext.Provider value={{ showModal }}>
      {children}
      <Modal
        visible={visible}
        animationType="fade"
        onRequestClose={handleClose}
        transparent={false}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 40, right: 20, zIndex: 10 }}
            onPress={handleClose}
          >
            <Feather name="x" size={36} color="#fff" />
          </TouchableOpacity>
          <GestureDetector gesture={onGestureEvent}>
            <Animated.View
              style={[
                {
                  width,
                  height,
                  top: 0,
                  left: 0,
                  position: "absolute",
                  zIndex: 1000,
                  justifyContent: "center",
                  alignItems: "center",
                },
                animatedStyle,
              ]}
            >
              {images[index] && (
                <Image
                  source={{ uri: images[index] }}
                  style={{ width, height, resizeMode: "contain" }}
                />
              )}
            </Animated.View>
          </GestureDetector>
        </View>
      </Modal>
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
