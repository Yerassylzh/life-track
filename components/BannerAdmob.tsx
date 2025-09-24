// interface AdMobComponents {
//   BannerAd: any;
//   BannerAdSize: any;
// }

// const IS_PUBLISHED = process.env.EXPO_PUBLIC_IS_PUBLISHED === "true";
// const IS_EXPOGO = process.env.EXPO_PUBLIC_IS_EXPO_GO === "true";

export default function BannerAdmob() {
  return null;
  // const bannerRef = useRef<any>(null);
  // const [admobComponents, setAdmobComponents] =
  //   useState<AdMobComponents | null>(null);
  // useEffect(() => {
  //   if (IS_EXPOGO) return;
  //   import("react-native-google-mobile-ads")
  //     .then((admob) => {
  //       setAdmobComponents({
  //         BannerAd: admob.BannerAd,
  //         BannerAdSize: admob.BannerAdSize,
  //       });
  //     })
  //     .catch((error) => {
  //       console.warn("Failed to load AdMob components:", error);
  //     });
  // }, []);
  // const [adFailed, setAdFailed] = useState(false);
  // if (IS_EXPOGO || !admobComponents) {
  //   return null;
  // }
  // const { BannerAd, BannerAdSize } = admobComponents;
  // const adUnitId = IS_PUBLISHED
  //   ? process.env.EXPO_PUBLIC_ADMOB_ID
  //   : process.env.EXPO_PUBLIC_ADMOB_TEST_ID;
  // return (
  //   !adFailed && (
  //     <BannerAd
  //       ref={bannerRef}
  //       unitId={adUnitId}
  //       size={BannerAdSize?.ANCHORED_ADAPTIVE_BANNER}
  //       onAdFailedToLoad={(error: Error) => {
  //         setAdFailed(true);
  //       }}
  //     />
  //   )
  // );
}
