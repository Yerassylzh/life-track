import { useRef } from "react";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const APP_ID = process.env.EXPO_PUBLIC_ADMOB_APP_ID as string;
const adUnitId = TestIds.ADAPTIVE_BANNER;

export default function BannerAdmob() {
  const bannerRef = useRef<BannerAd>(null);

  return (
    <BannerAd
      ref={bannerRef}
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      onAdFailedToLoad={(e) => {
        console.log("Ad failed to load: " + e);
      }}
      onAdImpression={() => {
        console.log("Go an Impression on ad");
      }}
    />
  );
}
