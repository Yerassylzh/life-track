import { isParsable } from "@/lib/json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export function useStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const readValue = useCallback(async (): Promise<T> => {
    const item = await AsyncStorage.getItem(key);
    if (!item) {
      return initialValue;
    }
    return isParsable(item) ? (JSON.parse(item) as T) : (item as T);
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    const wrapper = async () => {
      setStoredValue(await readValue());
    };
    wrapper();
  }, [key, readValue]);

  const setValue = useCallback(
    async (value: T) => {
      try {
        setStoredValue(value);
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch {
        console.log("Error while writing data to storage with key", key);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}
