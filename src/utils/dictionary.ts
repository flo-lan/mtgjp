export type WordCategory = "keyword" | "action" | "noun";

export interface GroupColor {
  border: string;
  lightBg: string;
  lightText: string;
  darkBg: string;
  darkLabel: string;
}

export const GROUP_COLOR: Record<string, GroupColor> = {
  'Evergreen':      { border: '#B8820A', lightBg: 'rgba(184,130,10,0.13)',  lightText: '#7A5000', darkBg: 'rgba(198,147,32,0.14)', darkLabel: '#E8B630' },
  'Classic':        { border: '#B8820A', lightBg: 'rgba(184,130,10,0.13)',  lightText: '#7A5000', darkBg: 'rgba(198,147,32,0.14)', darkLabel: '#E8B630' },
  'Ability Words':  { border: '#2A9E5C', lightBg: 'rgba(42,158,92,0.10)',   lightText: '#186840', darkBg: 'rgba(42,158,92,0.13)',  darkLabel: '#44C87A' },
  'Actions':        { border: '#C03020', lightBg: 'rgba(192,48,32,0.08)',   lightText: '#881810', darkBg: 'rgba(184,58,40,0.12)',  darkLabel: '#E05540' },
  'Card Types':     { border: '#1880C0', lightBg: 'rgba(24,128,192,0.09)',  lightText: '#0A5080', darkBg: 'rgba(24,128,192,0.14)', darkLabel: '#4AAAE0' },
  'Zones':          { border: '#7840C8', lightBg: 'rgba(120,64,200,0.08)',  lightText: '#4C18A0', darkBg: 'rgba(120,64,200,0.14)', darkLabel: '#A870E8' },
  'Turn Structure': { border: '#C07020', lightBg: 'rgba(192,112,32,0.09)',  lightText: '#884800', darkBg: 'rgba(192,112,32,0.14)', darkLabel: '#E09830' },
  'Properties':     { border: '#2090C0', lightBg: 'rgba(32,144,192,0.08)',  lightText: '#0C6090', darkBg: 'rgba(32,144,192,0.13)', darkLabel: '#50B8E0' },
  'Ability Types':  { border: '#9030A0', lightBg: 'rgba(144,48,160,0.08)',  lightText: '#600880', darkBg: 'rgba(144,48,160,0.14)', darkLabel: '#C050D8' },
  'Colors':         { border: '#18A890', lightBg: 'rgba(24,168,144,0.08)',  lightText: '#0C6858', darkBg: 'rgba(24,168,144,0.13)', darkLabel: '#38C8B0' },
  'Game Terms':     { border: '#A88010', lightBg: 'rgba(168,128,16,0.09)',  lightText: '#705200', darkBg: 'rgba(168,128,16,0.14)', darkLabel: '#D0A828' },
};

const GROUP_COLOR_FALLBACK: GroupColor = {
  border: '#606878', lightBg: 'rgba(96,104,120,0.08)', lightText: '#384050',
  darkBg: 'rgba(96,104,120,0.14)', darkLabel: '#909CB0',
};

export function groupColor(group: string): GroupColor {
  return GROUP_COLOR[group] ?? GROUP_COLOR_FALLBACK;
}

export interface DictEntry {
  word: string;
  translation: string;
  category: WordCategory;
  group: string;
  reading?: string;
}

const RAW_DICT: Record<
  string,
  { translation: string; category: WordCategory; group: string; reading?: string }
> = {
  // ── Evergreen keyword abilities ──────────────────────────────────────────
  飛行: { translation: "Flying", category: "keyword", group: "Evergreen", reading: "ひこう" },
  速攻: { translation: "Haste", category: "keyword", group: "Evergreen", reading: "そっこう" },
  トランプル: { translation: "Trample", category: "keyword", group: "Evergreen" },
  先制攻撃: { translation: "First Strike", category: "keyword", group: "Evergreen", reading: "せんせいこうげき" },
  二段攻撃: { translation: "Double Strike", category: "keyword", group: "Evergreen", reading: "にだんこうげき" },
  接死: { translation: "Deathtouch", category: "keyword", group: "Evergreen", reading: "せっし" },
  警戒: { translation: "Vigilance", category: "keyword", group: "Evergreen", reading: "けいかい" },
  絆魂: { translation: "Lifelink", category: "keyword", group: "Evergreen", reading: "ばんこん" },
  到達: { translation: "Reach", category: "keyword", group: "Evergreen", reading: "とうたつ" },
  呪禁: { translation: "Hexproof", category: "keyword", group: "Evergreen", reading: "じゅきん" },
  破壊不能: { translation: "Indestructible", category: "keyword", group: "Evergreen", reading: "はかいふのう" },
  防衛: { translation: "Defender", category: "keyword", group: "Evergreen", reading: "ぼうえい" },
  瞬速: { translation: "Flash", category: "keyword", group: "Evergreen", reading: "しゅんそく" },
  威迫: { translation: "Menace", category: "keyword", group: "Evergreen", reading: "いはく" },
  果敢: { translation: "Prowess", category: "keyword", group: "Evergreen", reading: "かかん" },
  占術: { translation: "Scry", category: "keyword", group: "Evergreen", reading: "せんじゅつ" },
  探検: { translation: "Explore", category: "keyword", group: "Evergreen", reading: "たんけん" },
  食物: { translation: "Food", category: "keyword", group: "Evergreen", reading: "しょくもつ" },
  装備: { translation: "Equip", category: "keyword", group: "Evergreen", reading: "そうび" },
  護法: { translation: "Ward", category: "keyword", group: "Evergreen", reading: "ごほう" },

  // ── Classic & returning keyword abilities ────────────────────────────────
  感染: { translation: "Infect", category: "keyword", group: "Classic", reading: "かんせん" },
  親和: { translation: "Affinity", category: "keyword", group: "Classic", reading: "しんわ" },
  続唱: { translation: "Cascade", category: "keyword", group: "Classic", reading: "ぞくしょう" },
  サイクリング: { translation: "Cycling", category: "keyword", group: "Classic" },
  召集: { translation: "Convoke", category: "keyword", group: "Classic", reading: "しょうしゅう" },
  待機: { translation: "Suspend", category: "keyword", group: "Classic", reading: "たいき" },
  嵐: { translation: "Storm", category: "keyword", group: "Classic", reading: "あらし" },
  萎縮: { translation: "Wither", category: "keyword", group: "Classic", reading: "いしゅく" },
  毒性: { translation: "Poisonous", category: "keyword", group: "Classic", reading: "どくせい" },
  増殖: { translation: "Proliferate", category: "keyword", group: "Classic", reading: "ぞうしょく" },
  不死: { translation: "Undying", category: "keyword", group: "Classic", reading: "ふし" },
  頑強: { translation: "Persist", category: "keyword", group: "Classic", reading: "がんきょう" },
  狂気: { translation: "Madness", category: "keyword", group: "Classic", reading: "きょうき" },
  発掘: { translation: "Dredge", category: "keyword", group: "Classic", reading: "はっくつ" },
  変異: { translation: "Morph", category: "keyword", group: "Classic", reading: "へんい" },
  フラッシュバック: { translation: "Flashback", category: "keyword", group: "Classic" },
  武士道: { translation: "Bushido", category: "keyword", group: "Classic", reading: "ぶしどう" },
  忍術: { translation: "Ninjutsu", category: "keyword", group: "Classic", reading: "にんじゅつ" },
  変容: { translation: "Mutate", category: "keyword", group: "Classic", reading: "へんよう" },
  変身: { translation: "Transform", category: "keyword", group: "Classic", reading: "へんしん" },
  合体: { translation: "Meld", category: "keyword", group: "Classic", reading: "がったい" },
  昇殿: { translation: "Ascend", category: "keyword", group: "Classic", reading: "しょうでん" },
  搭乗: { translation: "Crew", category: "keyword", group: "Classic", reading: "とうじょう" },
  製造: { translation: "Fabricate", category: "keyword", group: "Classic", reading: "せいぞう" },
  探査: { translation: "Delve", category: "keyword", group: "Classic", reading: "たんさ" },
  怪物化: { translation: "Monstrosity", category: "keyword", group: "Classic", reading: "かいぶつか" },
  授与: { translation: "Bestow", category: "keyword", group: "Classic", reading: "じゅよ" },
  奮励: { translation: "Exert", category: "keyword", group: "Classic", reading: "ふんれい" },
  予顕: { translation: "Foretell", category: "keyword", group: "Classic", reading: "よけん" },
  暴動: { translation: "Riot", category: "keyword", group: "Classic", reading: "ぼうどう" },
  指導: { translation: "Mentor", category: "keyword", group: "Classic", reading: "しどう" },
  進化: { translation: "Evolve", category: "keyword", group: "Classic", reading: "しんか" },
  秘匿: { translation: "Hideaway", category: "keyword", group: "Classic", reading: "ひとく" },
  プロテクション: { translation: "Protection", category: "keyword", group: "Classic" },
  繁殖: { translation: "Populate", category: "keyword", group: "Classic", reading: "はんしょく" },
  増幅: { translation: "Amplify", category: "keyword", group: "Classic", reading: "ぞうふく" },
  殲滅: { translation: "Annihilator", category: "keyword", group: "Classic", reading: "せんめつ" },
  超過: { translation: "Overload", category: "keyword", group: "Classic", reading: "ちょうか" },
  複製: { translation: "Replicate", category: "keyword", group: "Classic", reading: "ふくせい" },
  反響: { translation: "Echo", category: "keyword", group: "Classic", reading: "はんきょう" },
  消散: { translation: "Vanishing", category: "keyword", group: "Classic", reading: "しょうさん" },
  退色: { translation: "Fading", category: "keyword", group: "Classic", reading: "たいしょく" },
  接合: { translation: "Graft", category: "keyword", group: "Classic", reading: "せつごう" },
  奇跡: { translation: "Miracle", category: "keyword", group: "Classic", reading: "きせき" },
  名声: { translation: "Renown", category: "keyword", group: "Classic", reading: "めいせい" },
  変成: { translation: "Transmute", category: "keyword", group: "Classic", reading: "へんせい" },
  暗号: { translation: "Cipher", category: "keyword", group: "Classic", reading: "あんごう" },
  共謀: { translation: "Conspire", category: "keyword", group: "Classic", reading: "きょうぼう" },
  出現: { translation: "Emerge", category: "keyword", group: "Classic", reading: "しゅつげん" },
  崇高: { translation: "Exalted", category: "keyword", group: "Classic", reading: "すうこう" },
  刻印: { translation: "Imprint", category: "keyword", group: "Classic", reading: "こくいん" },
  挑発: { translation: "Provoke", category: "keyword", group: "Classic", reading: "ちょうはつ" },
  踏破: { translation: "Retrace", category: "keyword", group: "Classic", reading: "とうは" },
  適応: { translation: "Adapt", category: "keyword", group: "Classic", reading: "てきおう" },
  支援: { translation: "Support", category: "keyword", group: "Classic", reading: "しえん" },
  監視: { translation: "Surveil", category: "keyword", group: "Classic", reading: "かんし" },
  出撃: { translation: "Dash", category: "keyword", group: "Classic", reading: "しゅつげき" },
  波及: { translation: "Ripple", category: "keyword", group: "Classic", reading: "はきゅう" },
  "血の渇き": { translation: "Bloodthirst", category: "keyword", group: "Classic", reading: "ちのかわき" },
  解放: { translation: "Unleash", category: "keyword", group: "Classic", reading: "かいほう" },
  悪用: { translation: "Exploit", category: "keyword", group: "Classic", reading: "あくよう" },
  強請: { translation: "Extort", category: "keyword", group: "Classic", reading: "ゆすり" },
  被覆: { translation: "Shroud", category: "keyword", group: "Classic", reading: "ひふく" },
  多相: { translation: "Changeling", category: "keyword", group: "Classic", reading: "たそう" },
  キッカー: { translation: "Kicker", category: "keyword", group: "Classic" },
  回収: { translation: "Buyback", category: "keyword", group: "Classic", reading: "かいしゅう" },
  "鬨の声": { translation: "Battle Cry", category: "keyword", group: "Classic", reading: "ときのこえ" },
  喚起: { translation: "Evoke", category: "keyword", group: "Classic", reading: "かんき" },
  反転: { translation: "Flip", category: "keyword", group: "Classic", reading: "はんてん" },
  再生: { translation: "Regenerate", category: "keyword", group: "Classic", reading: "さいせい" },
  集結: { translation: "Rally", category: "keyword", group: "Classic", reading: "しゅうけつ" },
  融合: { translation: "Entwine", category: "keyword", group: "Classic", reading: "ゆうごう" },
  暴走: { translation: "Rampage", category: "keyword", group: "Classic", reading: "ぼうそう" },
  結束: { translation: "Banding", category: "keyword", group: "Classic", reading: "けっそく" },

  // ── Ability words ────────────────────────────────────────────────────────
  上陸: { translation: "Landfall", category: "keyword", group: "Ability Words", reading: "じょうりく" },
  英雄的: { translation: "Heroic", category: "keyword", group: "Ability Words", reading: "えいゆうてき" },
  大隊: { translation: "Battalion", category: "keyword", group: "Ability Words", reading: "だいたい" },
  激昂: { translation: "Enrage", category: "keyword", group: "Ability Words", reading: "げきこう" },
  強襲: { translation: "Raid", category: "keyword", group: "Ability Words", reading: "きょうしゅう" },
  勇猛: { translation: "Ferocious", category: "keyword", group: "Ability Words", reading: "ゆうもう" },
  金属術: { translation: "Metalcraft", category: "keyword", group: "Ability Words", reading: "きんぞくじゅつ" },
  信心: { translation: "Devotion", category: "keyword", group: "Ability Words", reading: "しんじん" },
  魂結び: { translation: "Soulbond", category: "keyword", group: "Ability Words", reading: "たまむすび" },

  // ── Keyword actions ──────────────────────────────────────────────────────
  破壊する: { translation: "Destroy", category: "action", group: "Actions", reading: "はかいする" },
  追放する: { translation: "Exile", category: "action", group: "Actions", reading: "ついほうする" },
  タップする: { translation: "Tap", category: "action", group: "Actions" },
  アンタップする: { translation: "Untap", category: "action", group: "Actions" },
  生け贄に捧げる: { translation: "Sacrifice", category: "action", group: "Actions", reading: "いけにえにささげる" },
  引く: { translation: "Draw", category: "action", group: "Actions", reading: "ひく" },
  捨てる: { translation: "Discard", category: "action", group: "Actions", reading: "すてる" },
  打ち消す: { translation: "Counter", category: "action", group: "Actions", reading: "うちけす" },
  唱える: { translation: "Cast", category: "action", group: "Actions", reading: "となえる" },
  生成する: { translation: "Create", category: "action", group: "Actions", reading: "せいせいする" },
  交換する: { translation: "Exchange", category: "action", group: "Actions", reading: "こうかんする" },
  探す: { translation: "Search", category: "action", group: "Actions", reading: "さがす" },
  切り直す: { translation: "Shuffle", category: "action", group: "Actions", reading: "きりなおす" },
  起動する: { translation: "Activate", category: "action", group: "Actions", reading: "きどうする" },
  公開する: { translation: "Reveal", category: "action", group: "Actions", reading: "こうかいする" },
  格闘する: { translation: "Fight", category: "action", group: "Actions", reading: "かくとうする" },
  切削する: { translation: "Mill", category: "action", group: "Actions", reading: "せっさくする" },
  対象: { translation: "Target", category: "action", group: "Actions", reading: "たいしょう" },

  // ── Card types ───────────────────────────────────────────────────────────
  クリーチャー: { translation: "Creature", category: "noun", group: "Card Types" },
  アーティファクト: { translation: "Artifact", category: "noun", group: "Card Types" },
  エンチャント: { translation: "Enchantment", category: "noun", group: "Card Types" },
  インスタント: { translation: "Instant", category: "noun", group: "Card Types" },
  ソーサリー: { translation: "Sorcery", category: "noun", group: "Card Types" },
  プレインズウォーカー: { translation: "Planeswalker", category: "noun", group: "Card Types" },
  土地: { translation: "Land", category: "noun", group: "Card Types", reading: "とち" },
  バトル: { translation: "Battle", category: "noun", group: "Card Types" },
  同族: { translation: "Kindred", category: "noun", group: "Card Types", reading: "どうぞく" },
  英雄譚: { translation: "Saga", category: "noun", group: "Card Types", reading: "えいゆうたん" },
  伝説の: { translation: "Legendary", category: "noun", group: "Card Types", reading: "でんせつの" },
  氷雪: { translation: "Snow", category: "noun", group: "Card Types", reading: "ひょうせつ" },

  // ── Zones ────────────────────────────────────────────────────────────────
  戦場: { translation: "Battlefield", category: "noun", group: "Zones", reading: "せんじょう" },
  墓地: { translation: "Graveyard", category: "noun", group: "Zones", reading: "ぼち" },
  ライブラリー: { translation: "Library", category: "noun", group: "Zones" },
  手札: { translation: "Hand", category: "noun", group: "Zones", reading: "てふだ" },
  スタック: { translation: "Stack", category: "noun", group: "Zones" },
  追放: { translation: "Exile (zone)", category: "noun", group: "Zones", reading: "ついほう" },
  統率: { translation: "Command (zone)", category: "noun", group: "Zones", reading: "とうそつ" },

  // ── Turn structure ───────────────────────────────────────────────────────
  アップキープ: { translation: "Upkeep", category: "noun", group: "Turn Structure" },
  戦闘: { translation: "Combat", category: "noun", group: "Turn Structure", reading: "せんとう" },
  攻撃: { translation: "Attack", category: "noun", group: "Turn Structure", reading: "こうげき" },
  ターン: { translation: "Turn", category: "noun", group: "Turn Structure" },
  フェイズ: { translation: "Phase", category: "noun", group: "Turn Structure" },
  ステップ: { translation: "Step", category: "noun", group: "Turn Structure" },

  // ── Card properties ──────────────────────────────────────────────────────
  パワー: { translation: "Power", category: "noun", group: "Properties" },
  タフネス: { translation: "Toughness", category: "noun", group: "Properties" },
  忠誠度: { translation: "Loyalty", category: "noun", group: "Properties", reading: "ちゅうせいど" },
  マナ総量: { translation: "Mana Value", category: "noun", group: "Properties", reading: "まなそうりょう" },
  守備値: { translation: "Defense", category: "noun", group: "Properties", reading: "しゅびち" },

  // ── Ability types ────────────────────────────────────────────────────────
  常在型能力: { translation: "Static Ability", category: "noun", group: "Ability Types", reading: "じょうざいがたのうりょく" },
  誘発型能力: { translation: "Triggered Ability", category: "noun", group: "Ability Types", reading: "ゆうはつがたのうりょく" },
  起動型能力: { translation: "Activated Ability", category: "noun", group: "Ability Types", reading: "きどうがたのうりょく" },
  置換効果: { translation: "Replacement Effect", category: "noun", group: "Ability Types", reading: "ちかんこうか" },
  誘発: { translation: "Trigger", category: "noun", group: "Ability Types", reading: "ゆうはつ" },

  // ── Colors ───────────────────────────────────────────────────────────────
  白: { translation: "White", category: "noun", group: "Colors", reading: "しろ" },
  青: { translation: "Blue", category: "noun", group: "Colors", reading: "あお" },
  黒: { translation: "Black", category: "noun", group: "Colors", reading: "くろ" },
  赤: { translation: "Red", category: "noun", group: "Colors", reading: "あか" },
  緑: { translation: "Green", category: "noun", group: "Colors", reading: "みどり" },
  無色: { translation: "Colorless", category: "noun", group: "Colors", reading: "むしょく" },
  多色: { translation: "Multicolored", category: "noun", group: "Colors", reading: "たしょく" },

  // ── General game terms ───────────────────────────────────────────────────
  プレイヤー: { translation: "Player", category: "noun", group: "Game Terms" },
  対戦相手: { translation: "Opponent", category: "noun", group: "Game Terms", reading: "たいせんあいて" },
  コントローラー: { translation: "Controller", category: "noun", group: "Game Terms" },
  オーナー: { translation: "Owner", category: "noun", group: "Game Terms" },
  パーマネント: { translation: "Permanent", category: "noun", group: "Game Terms" },
  トークン: { translation: "Token", category: "noun", group: "Game Terms" },
  呪文: { translation: "Spell", category: "noun", group: "Game Terms", reading: "じゅもん" },
  ダメージ: { translation: "Damage", category: "noun", group: "Game Terms" },
  カウンター: { translation: "Counter (token)", category: "noun", group: "Game Terms" },
  毒: { translation: "Poison", category: "noun", group: "Game Terms", reading: "どく" },
  エネルギー: { translation: "Energy", category: "noun", group: "Game Terms" },
  コスト: { translation: "Cost", category: "noun", group: "Game Terms" },
  優先権: { translation: "Priority", category: "noun", group: "Game Terms", reading: "ゆうせんけん" },
  解決: { translation: "Resolve", category: "noun", group: "Game Terms", reading: "かいけつ" },
  歴史的: { translation: "Historic", category: "noun", group: "Game Terms", reading: "れきしてき" },
  "マナ・プール": { translation: "Mana Pool", category: "noun", group: "Game Terms" },
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
