import AsyncStorage from '@react-native-async-storage/async-storage';
import { SrsCard } from './srs';

const STUDY_KEY = 'study_list_v1';

export async function loadStudyList(): Promise<SrsCard[]> {
  try {
    const raw = await AsyncStorage.getItem(STUDY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveStudyList(cards: SrsCard[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STUDY_KEY, JSON.stringify(cards));
  } catch {
    // Storage errors are non-fatal
  }
}
