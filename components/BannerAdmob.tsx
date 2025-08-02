import { useRef } from "react";

let BannerAd: any = null;
let BannerAdSize: any = null;

if (!__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const admob = require("react-native-google-mobile-ads");
  BannerAd = admob.BannerAd;
  BannerAdSize = admob.BannerAdSize;
}

const adUnitId = "ca-app-pub-4326973674601582~1708339850";

export default function BannerAdmob() {
  const bannerRef = useRef<any>(null);
  return (
    !__DEV__ &&
    BannerAd &&
    BannerAdSize && (
      <BannerAd
        ref={bannerRef}
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    )
  );
}
