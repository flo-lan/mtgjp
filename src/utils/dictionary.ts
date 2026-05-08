export type WordCategory = "keyword" | "action" | "noun";

export interface DictEntry {
  word: string;
  translation: string;
  category: WordCategory;
}

const RAW_DICT: Record<
  string,
  { translation: string; category: WordCategory }
> = {
  // MTG Keywords / abilities
  飛行: { translation: "Flying", category: "keyword" },
  速攻: { translation: "Haste", category: "keyword" },
  トランプル: { translation: "Trample", category: "keyword" },
  先制攻撃: { translation: "First Strike", category: "keyword" },
  二段攻撃: { translation: "Double Strike", category: "keyword" },
  接死: { translation: "Deathtouch", category: "keyword" },
  警戒: { translation: "Vigilance", category: "keyword" },
  絆魂: { translation: "Lifelink", category: "keyword" },
  到達: { translation: "Reach", category: "keyword" },
  呪禁: { translation: "Hexproof", category: "keyword" },
  破壊不能: { translation: "Indestructible", category: "keyword" },
  防衛: { translation: "Defender", category: "keyword" },
  閃光: { translation: "Flash", category: "keyword" },
  威迫: { translation: "Menace", category: "keyword" },
  果敢: { translation: "Prowess", category: "keyword" },
  占術: { translation: "Scry", category: "keyword" },
  探検: { translation: "Explore", category: "keyword" },
  食物: { translation: "Food", category: "keyword" },
  装備: { translation: "Equip", category: "keyword" },
  護法: { translation: "Ward", category: "keyword" },

  // Actions
  破壊する: { translation: "Destroy", category: "action" },
  追放する: { translation: "Exile", category: "action" },
  タップする: { translation: "Tap", category: "action" },
  アンタップする: { translation: "Untap", category: "action" },
  生け贄に捧げる: { translation: "Sacrifice", category: "action" },
  引く: { translation: "Draw", category: "action" },
  捨てる: { translation: "Discard", category: "action" },
  カウンター: { translation: "Counter", category: "action" },
  対象: { translation: "Target", category: "action" },

  // Nouns / game terms
  クリーチャー: { translation: "Creature", category: "noun" },
  アーティファクト: { translation: "Artifact", category: "noun" },
  エンチャント: { translation: "Enchantment", category: "noun" },
  インスタント: { translation: "Instant", category: "noun" },
  ソーサリー: { translation: "Sorcery", category: "noun" },
  プレインズウォーカー: { translation: "Planeswalker", category: "noun" },
  土地: { translation: "Land", category: "noun" },
  プレイヤー: { translation: "Player", category: "noun" },
  対戦相手: { translation: "Opponent", category: "noun" },
  墓地: { translation: "Graveyard", category: "noun" },
  ライブラリー: { translation: "Library", category: "noun" },
  手札: { translation: "Hand", category: "noun" },
  戦場: { translation: "Battlefield", category: "noun" },
  "マナ・プール": { translation: "Mana Pool", category: "noun" },
  呪文: { translation: "Spell", category: "noun" },
  パーマネント: { translation: "Permanent", category: "noun" },
  トークン: { translation: "Token", category: "noun" },
  ダメージ: { translation: "Damage", category: "noun" },
  ターン: { translation: "Turn", category: "noun" },
  ステップ: { translation: "Step", category: "noun" },
  フェイズ: { translation: "Phase", category: "noun" },
};

export const JA_DICT: Record<string, DictEntry> = Object.fromEntries(
  Object.entries(RAW_DICT).map(([word, v]) => [word, { word, ...v }]),
);

export const SORTED_DICT_KEYS = Object.keys(JA_DICT).sort(
  (a, b) => b.length - a.length,
);

export function extractVocab(text: string): DictEntry[] {
  if (!text) return [];
  const regex = new RegExp(`(${SORTED_DICT_KEYS.join("|")})`);
  const seen = new Set<string>();
  const results: DictEntry[] = [];
  for (const part of text.split(regex)) {
    if (!part || seen.has(part)) continue;
    const entry = JA_DICT[part];
    if (entry) {
      results.push(entry);
      seen.add(part);
    }
  }
  return results;
}
