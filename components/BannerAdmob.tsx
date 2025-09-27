import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  AdRequestConfiguration,
  InterstitialAdLoader,
} from "yandex-mobile-ads";

const YANDEX_AD_UNIT_ID = process.env.YANDEX_AD_UNIT_ID as string;

let adRequestConfiguration = new AdRequestConfiguration({
  adUnitId: YANDEX_AD_UNIT_ID,
});

export default function BannerAdmob() {
  const [loader, setLoader] = useState<InterstitialAdLoader | null>(null);
  const enterId = useEnterId();

  useEffect(() => {
    if (enterId == null || Number(enterId) % 3 !== 0) {
      return;
    }

    console.log("Loader is setting up..");

    (async () => {
      let ldr = await InterstitialAdLoader.create();
      setLoader(ldr);
    })().catch((err) => {
      console.log(err);
    });
  }, [enterId]);

  useEffect(() => {
    if (!loader) {
      return;
    }

    (async () => {
      await loader.loadAd(adRequestConfiguration).then((ad) => {
        if (ad) {
          ad.onAdShown = () => {
            console.log("Did show");
          };
          ad.onAdFailedToShow = (error) => {
            console.log(
              `Did fail to show with error: ${JSON.stringify(error)}`
            );
          };
          ad.onAdClicked = () => {
            console.log("Did click");
          };
          ad.onAdDismissed = () => {
            console.log("Did dismiss");
          };
          ad.onAdImpression = (impressionData) => {
            console.log(
              `Did track impression: ${JSON.stringify(impressionData)}`
            );
          };
          ad.show();
        }
      });
    })();
  }, [loader]);

  return null;
}

function useEnterId(): number | null {
  const [enterId, setEnterId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      let id = await AsyncStorage.getItem("enterId");
      if (id == null) {
        id = "-1";
      }
      setEnterId(Number(id) + 1);
      await AsyncStorage.setItem("enterId", (Number(id) + 1).toString());
    })();
  }, []);
  return enterId;
}
