import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

const KEY = 'favorite_cards_v1';

export type FavCard = {
  set: string;
  collectorNumber: string;
  name: string;
  printedName?: string;
  imageUri?: string;
};

async function load(): Promise<FavCard[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function save(favs: FavCard[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(favs));
}

export { load as loadFavorites };

export function useFavoriteCard(set: string, collectorNumber: string) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    load().then(favs =>
      setIsFav(favs.some(f => f.set === set && f.collectorNumber === collectorNumber)),
    );
  }, [set, collectorNumber]);

  const toggle = useCallback(
    async (meta?: Pick<FavCard, 'name' | 'printedName' | 'imageUri'>) => {
      const favs = await load();
      const exists = favs.some(f => f.set === set && f.collectorNumber === collectorNumber);
      await save(
        exists
          ? favs.filter(f => !(f.set === set && f.collectorNumber === collectorNumber))
          : [...favs, { set, collectorNumber, name: meta?.name ?? '', printedName: meta?.printedName, imageUri: meta?.imageUri }],
      );
      setIsFav(!exists);
    },
    [set, collectorNumber],
  );

  return { isFav, toggle };
}
