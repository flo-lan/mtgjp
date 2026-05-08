export type WordCategory = "keyword" | "action" | "noun";

export interface DictEntry {
  word: string;
  translation: string;
  category: WordCategory;
  reading?: string;
}

const RAW_DICT: Record<
  string,
  { translation: string; category: WordCategory; reading?: string }
> = {
  // MTG Keywords / abilities
  飛行: { translation: "Flying", category: "keyword", reading: "ひこう" },
  速攻: { translation: "Haste", category: "keyword", reading: "そっこう" },
  トランプル: { translation: "Trample", category: "keyword" },
  先制攻撃: {
    translation: "First Strike",
    category: "keyword",
    reading: "せんせいこうげき",
  },
  二段攻撃: {
    translation: "Double Strike",
    category: "keyword",
    reading: "にだんこうげき",
  },
  接死: { translation: "Deathtouch", category: "keyword", reading: "せっし" },
  警戒: { translation: "Vigilance", category: "keyword", reading: "けいかい" },
  絆魂: { translation: "Lifelink", category: "keyword", reading: "ばんこん" },
  到達: { translation: "Reach", category: "keyword", reading: "とうたつ" },
  呪禁: { translation: "Hexproof", category: "keyword", reading: "じゅきん" },
  破壊不能: {
    translation: "Indestructible",
    category: "keyword",
    reading: "はかいふのう",
  },
  防衛: { translation: "Defender", category: "keyword", reading: "ぼうえい" },
  閃光: { translation: "Flash", category: "keyword", reading: "せんこう" },
  威迫: { translation: "Menace", category: "keyword", reading: "いはく" },
  果敢: { translation: "Prowess", category: "keyword", reading: "かかん" },
  占術: { translation: "Scry", category: "keyword", reading: "せんじゅつ" },
  探検: { translation: "Explore", category: "keyword", reading: "たんけん" },
  食物: { translation: "Food", category: "keyword", reading: "しょくもつ" },
  装備: { translation: "Equip", category: "keyword", reading: "そうび" },
  護法: { translation: "Ward", category: "keyword", reading: "ごほう" },

  // Keyword abilities — classic / returning
  感染: { translation: "Infect", category: "keyword", reading: "かんせん" },
  親和: { translation: "Affinity", category: "keyword", reading: "しんわ" },
  続唱: { translation: "Cascade", category: "keyword", reading: "ぞくしょう" },
  サイクリング: { translation: "Cycling", category: "keyword" },
  召集: {
    translation: "Convoke",
    category: "keyword",
    reading: "しょうしゅう",
  },
  待機: { translation: "Suspend", category: "keyword", reading: "たいき" },
  嵐: { translation: "Storm", category: "keyword", reading: "あらし" },
  萎縮: { translation: "Wither", category: "keyword", reading: "いしゅく" },
  毒性: { translation: "Poisonous", category: "keyword", reading: "どくせい" },
  増殖: {
    translation: "Proliferate",
    category: "keyword",
    reading: "ぞうしょく",
  },
  不死: { translation: "Undying", category: "keyword", reading: "ふし" },
  頑強: { translation: "Persist", category: "keyword", reading: "がんきょう" },
  狂気: { translation: "Madness", category: "keyword", reading: "きょうき" },
  発掘: { translation: "Dredge", category: "keyword", reading: "はっくつ" },
  変異: { translation: "Morph", category: "keyword", reading: "へんい" },
  フラッシュバック: { translation: "Flashback", category: "keyword" },
  武士道: { translation: "Bushido", category: "keyword", reading: "ぶしどう" },
  忍術: { translation: "Ninjutsu", category: "keyword", reading: "にんじゅつ" },
  変容: { translation: "Mutate", category: "keyword", reading: "へんよう" },
  変身: { translation: "Transform", category: "keyword", reading: "へんしん" },
  合体: { translation: "Meld", category: "keyword", reading: "がったい" },
  昇殿: { translation: "Ascend", category: "keyword", reading: "しょうでん" },
  搭乗: { translation: "Crew", category: "keyword", reading: "とうじょう" },
  製造: { translation: "Fabricate", category: "keyword", reading: "せいぞう" },
  探査: { translation: "Delve", category: "keyword", reading: "たんさ" },
  怪物化: {
    translation: "Monstrosity",
    category: "keyword",
    reading: "かいぶつか",
  },
  授与: { translation: "Bestow", category: "keyword", reading: "じゅよ" },
  奮励: { translation: "Exert", category: "keyword", reading: "ふんれい" },
  予顕: { translation: "Foretell", category: "keyword", reading: "よけん" },
  暴動: { translation: "Riot", category: "keyword", reading: "ぼうどう" },
  指導: { translation: "Mentor", category: "keyword", reading: "しどう" },
  進化: { translation: "Evolve", category: "keyword", reading: "しんか" },
  秘匿: { translation: "Hideaway", category: "keyword", reading: "ひとく" },
  プロテクション: { translation: "Protection", category: "keyword" },
  繁殖: { translation: "Populate", category: "keyword", reading: "はんしょく" },
  増幅: { translation: "Amplify", category: "keyword", reading: "ぞうふく" },
  殲滅: {
    translation: "Annihilator",
    category: "keyword",
    reading: "せんめつ",
  },
  超過: { translation: "Overload", category: "keyword", reading: "ちょうか" },
  複製: { translation: "Replicate", category: "keyword", reading: "ふくせい" },
  反響: { translation: "Echo", category: "keyword", reading: "はんきょう" },
  消散: {
    translation: "Vanishing",
    category: "keyword",
    reading: "しょうさん",
  },
  退色: { translation: "Fading", category: "keyword", reading: "たいしょく" },
  接合: { translation: "Graft", category: "keyword", reading: "せつごう" },
  奇跡: { translation: "Miracle", category: "keyword", reading: "きせき" },
  名声: { translation: "Renown", category: "keyword", reading: "めいせい" },
  変成: { translation: "Transmute", category: "keyword", reading: "へんせい" },
  暗号: { translation: "Cipher", category: "keyword", reading: "あんごう" },
  共謀: { translation: "Conspire", category: "keyword", reading: "きょうぼう" },
  出現: { translation: "Emerge", category: "keyword", reading: "しゅつげん" },
  崇高: { translation: "Exalted", category: "keyword", reading: "すうこう" },
  刻印: { translation: "Imprint", category: "keyword", reading: "こくいん" },
  挑発: { translation: "Provoke", category: "keyword", reading: "ちょうはつ" },
  踏破: { translation: "Retrace", category: "keyword", reading: "とうは" },
  適応: { translation: "Adapt", category: "keyword", reading: "てきおう" },
  支援: { translation: "Support", category: "keyword", reading: "しえん" },
  監視: { translation: "Surveil", category: "keyword", reading: "かんし" },
  出撃: { translation: "Dash", category: "keyword", reading: "しゅつげき" },
  波及: { translation: "Ripple", category: "keyword", reading: "はきゅう" },
  血の渇き: {
    translation: "Bloodthirst",
    category: "keyword",
    reading: "ちのかわき",
  },
  解放: { translation: "Unleash", category: "keyword", reading: "かいほう" },
  悪用: { translation: "Exploit", category: "keyword", reading: "あくよう" },
  強請: { translation: "Extort", category: "keyword", reading: "ゆすり" },
  被覆: { translation: "Shroud", category: "keyword", reading: "ひふく" },
  多相: { translation: "Changeling", category: "keyword", reading: "たそう" },
  キッカー: { translation: "Kicker", category: "keyword" },
  回収: { translation: "Buyback", category: "keyword", reading: "かいしゅう" },
  鬨の声: {
    translation: "Battle Cry",
    category: "keyword",
    reading: "ときのこえ",
  },
  喚起: { translation: "Evoke", category: "keyword", reading: "かんき" },
  反転: { translation: "Flip", category: "keyword", reading: "はんてん" },
  再生: { translation: "Regenerate", category: "keyword", reading: "さいせい" },
  集結: { translation: "Rally", category: "keyword", reading: "しゅうけつ" },
  融合: { translation: "Entwine", category: "keyword", reading: "ゆうごう" },
  暴走: { translation: "Rampage", category: "keyword", reading: "ぼうそう" },
  結束: { translation: "Banding", category: "keyword", reading: "けっそく" },

  // Ability words
  上陸: { translation: "Landfall", category: "keyword", reading: "じょうりく" },
  英雄的: {
    translation: "Heroic",
    category: "keyword",
    reading: "えいゆうてき",
  },
  大隊: { translation: "Battalion", category: "keyword", reading: "だいたい" },
  激昂: { translation: "Enrage", category: "keyword", reading: "げきこう" },
  強襲: { translation: "Raid", category: "keyword", reading: "きょうしゅう" },
  勇猛: { translation: "Ferocious", category: "keyword", reading: "ゆうもう" },
  金属術: {
    translation: "Metalcraft",
    category: "keyword",
    reading: "きんぞくじゅつ",
  },

  // Actions
  破壊する: {
    translation: "Destroy",
    category: "action",
    reading: "はかいする",
  },
  追放する: {
    translation: "Exile",
    category: "action",
    reading: "ついほうする",
  },
  タップする: { translation: "Tap", category: "action" },
  アンタップする: { translation: "Untap", category: "action" },
  生け贄に捧げる: {
    translation: "Sacrifice",
    category: "action",
    reading: "いけにえにささげる",
  },
  引く: { translation: "Draw", category: "action", reading: "ひく" },
  捨てる: { translation: "Discard", category: "action", reading: "すてる" },
  カウンター: { translation: "Counter", category: "action" },
  対象: { translation: "Target", category: "action", reading: "たいしょう" },
  格闘する: {
    translation: "Fight",
    category: "action",
    reading: "かくとうする",
  },
  切削する: {
    translation: "Mill",
    category: "action",
    reading: "せっさくする",
  },

  // Nouns / game terms
  クリーチャー: { translation: "Creature", category: "noun" },
  アーティファクト: { translation: "Artifact", category: "noun" },
  エンチャント: { translation: "Enchantment", category: "noun" },
  インスタント: { translation: "Instant", category: "noun" },
  ソーサリー: { translation: "Sorcery", category: "noun" },
  プレインズウォーカー: { translation: "Planeswalker", category: "noun" },
  土地: { translation: "Land", category: "noun", reading: "とち" },
  プレイヤー: { translation: "Player", category: "noun" },
  対戦相手: {
    translation: "Opponent",
    category: "noun",
    reading: "たいせんあいて",
  },
  墓地: { translation: "Graveyard", category: "noun", reading: "ぼち" },
  ライブラリー: { translation: "Library", category: "noun" },
  手札: { translation: "Hand", category: "noun", reading: "てふだ" },
  戦場: { translation: "Battlefield", category: "noun", reading: "せんじょう" },
  "マナ・プール": { translation: "Mana Pool", category: "noun" },
  呪文: { translation: "Spell", category: "noun", reading: "じゅもん" },
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
