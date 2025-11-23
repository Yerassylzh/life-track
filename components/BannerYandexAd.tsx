import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { AdRequest, BannerAdSize, BannerView } from "yandex-mobile-ads";

const YANDEX_AD_UNIT_ID = process.env.EXPO_PUBLIC_YANDEX_AD_UNIT_ID as string;
const AD_HEIGHT = 70;

let adRequest = new AdRequest({});

export default function BannerYandexAd() {
  const [adSize, setAdSize] = useState<BannerAdSize | null>(null);

  useEffect(() => {
    (async () => {
      setAdSize(
        await BannerAdSize.inlineSize(Dimensions.get("window").width, AD_HEIGHT)
      );
    })();
  }, []);

  return (
    adSize && (
      <View
        style={{ width: Dimensions.get("window").width, height: AD_HEIGHT }}
      >
        <BannerView
          size={adSize!}
          adUnitId={YANDEX_AD_UNIT_ID}
          adRequest={adRequest}
          onAdLoaded={() => console.log("Did load")}
          onAdFailedToLoad={(event: any) =>
            console.log(
              `Did fail to load with error: ${JSON.stringify(event.nativeEvent)}`
            )
          }
          onAdClicked={() => console.log("Did click")}
          onLeftApplication={() => console.log("Did leave application")}
          onReturnToApplication={() => console.log("Did return to application")}
          onAdImpression={(event: any) =>
            console.log(
              `Did track impression: ${JSON.stringify(event.nativeEvent.impressionData)}`
            )
          }
          onAdClose={() => console.log("Did close")}
        />
      </View>
    )
  );
}
