import axios from 'axios';

export interface CardData {
  id: string;
  oracle_id?: string;
  name: string;
  printed_name?: string;
  type_line: string;
  printed_type_line?: string;
  oracle_text?: string;
  printed_text?: string;
  mana_cost: string;
  colors: string[];
  power?: string;
  toughness?: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  set: string;
  collector_number: string;
  rarity?: string;
  flavor_text?: string;
  artist?: string;
}

const SCRYFALL_API = 'https://api.scryfall.com';

/**
 * Searches for a card by name. Returns a list of matches.
 */
// Only kanji triggers lang:ja — hiragana/katakana phonetic readings won't match Scryfall's Japanese printed names
const KANJI_RE = /[一-鿿]/;

async function scryfallSearch(query: string): Promise<CardData[]> {
  const q = KANJI_RE.test(query) ? `lang:ja ${query}` : query;
  const response = await axios.get(`${SCRYFALL_API}/cards/search`, { params: { q } });
  return response.data.data;
}

export async function searchCards(query: string): Promise<CardData[]> {
  try {
    const results = await scryfallSearch(query);
    if (results.length > 0) return results;

    // Literal search found nothing — try Scryfall's fuzzy name lookup as a fallback.
    // This handles OCR noise (small/large kana confusion, missing strokes) without us
    // doing lossy text normalization that could corrupt legitimate small kana in real names.
    const fuzzy = await axios.get(`${SCRYFALL_API}/cards/named`, {
      params: { fuzzy: query, lang: 'ja' },
    });
    return [fuzzy.data];
  } catch {
    return [];
  }
}

/**
 * Fetches the English printing of a card, preferring the same set as the JA card.
 */
export async function getEnglishCard(oracleId: string, preferredSet?: string): Promise<CardData | null> {
  try {
    const response = await axios.get(`${SCRYFALL_API}/cards/search`, {
      params: { q: `lang:en oracleid:${oracleId} game:paper`, order: 'released', dir: 'desc' },
    });
    const cards: CardData[] = response.data.data ?? [];
    if (preferredSet) {
      const sameSet = cards.find(c => c.set === preferredSet);
      if (sameSet) return sameSet;
    }
    return cards[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetches the Japanese localized version of a specific card.
 * Falls back to any Japanese printing of the same card if the exact set/number has no Japanese version.
 */
export async function getJapaneseCard(set: string, collectorNumber: string): Promise<CardData | null> {
  try {
    const response = await axios.get(`${SCRYFALL_API}/cards/${set}/${collectorNumber}/ja`);
    return response.data;
  } catch {
    // Exact printing has no Japanese version — find any Japanese printing by name
    try {
      const enResponse = await axios.get(`${SCRYFALL_API}/cards/${set}/${collectorNumber}`);
      const oracleId: string = enResponse.data.oracle_id;
      const searchResponse = await axios.get(`${SCRYFALL_API}/cards/search`, {
        params: { q: `lang:ja oracleid:${oracleId} game:paper`, order: 'released', dir: 'desc' },
      });
      return searchResponse.data.data[0] ?? null;
    } catch (fallbackError) {
      console.warn(`Could not find any Japanese version for ${set} ${collectorNumber}`, fallbackError);
      return null;
    }
  }
}
