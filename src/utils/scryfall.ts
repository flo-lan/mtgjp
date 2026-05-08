import axios from 'axios';

export interface CardData {
  id: string;
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
export async function searchCards(query: string): Promise<CardData[]> {
  try {
    const response = await axios.get(`${SCRYFALL_API}/cards/search`, {
      params: { q: query },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching cards:', error);
    return [];
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
