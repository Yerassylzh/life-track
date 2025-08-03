import { useEffect, useRef, useState } from "react";

interface AdMobComponents {
  BannerAd: any;
  BannerAdSize: any;
  TestIds: any;
}

const IS_PUBLISHED = process.env.EXPO_PUBLIC_IS_PUBLISHED === "true";
const IS_EXPOGO = process.env.EXPO_PUBLIC_IS_EXPO_GO === "true";

export default function BannerAdmob() {
  const bannerRef = useRef<any>(null);
  const [admobComponents, setAdmobComponents] =
    useState<AdMobComponents | null>(null);

  useEffect(() => {
    if (IS_EXPOGO) return;
    import("react-native-google-mobile-ads")
      .then((admob) => {
        setAdmobComponents({
          BannerAd: admob.BannerAd,
          BannerAdSize: admob.BannerAdSize,
          TestIds: admob.TestIds,
        });
      })
      .catch((error) => {
        console.warn("Failed to load AdMob components:", error);
      });
  }, []);

  if (IS_EXPOGO || !admobComponents) {
    return null;
  }

  const { BannerAd, BannerAdSize, TestIds } = admobComponents;

  const adUnitId =
    IS_PUBLISHED && !__DEV__
      ? process.env.EXPO_PUBLIC_ADMOB_ID
      : TestIds.BANNER;

  return (
    <BannerAd
      ref={bannerRef}
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
  );
}
