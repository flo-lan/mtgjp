// Card + glossary data. Self-authored study text — does not reproduce the
// trademarked card frame, expansion chrome, or printed flavor text verbatim.

window.GLOSSARY = {
  creature: {
    jp: 'クリーチャー', kana: 'kuriichaa', en: 'Creature', cat: 'type',
    def_jp: '戦場に出ているクリーチャー・カード。攻撃や防御ができる。',
    def_en: 'A permanent that can attack and block. The most common card type.',
    glyph: '◐',
  },
  planeswalker: {
    jp: 'プレインズウォーカー', kana: 'pureinzuwookaa', en: 'Planeswalker', cat: 'type-pw',
    def_jp: 'プレインズウォーカー・カード。各プレイヤーは伝説の能力者を１体までコントロールできる。',
    def_en: 'A powerful ally with loyalty abilities. One per controller (legendary rule).',
    glyph: '✦',
  },
  damage: {
    jp: 'ダメージ', kana: 'dameeji', en: 'Damage', cat: 'action',
    def_jp: 'ダメージは、クリーチャーやプレイヤーのライフを減らす。０以下になったら破壊される（プレイヤーは敗北する）。',
    def_en: 'Reduces life or toughness. Lethal damage destroys creatures; 0 life loses the game.',
    glyph: '✸',
  },
  player: {
    jp: 'プレイヤー', kana: 'pureiyaa', en: 'Player', cat: 'type',
    def_jp: 'ゲームの参加者。各プレイヤーはライフ、ライブラリー、手札、墓地などを持つ。',
    def_en: 'A participant in the game. Has life total, library, hand, graveyard, etc.',
    glyph: '☻',
  },
  target: {
    jp: '対象', kana: 'taishou', en: 'Target', cat: 'action',
    def_jp: '呪文や能力が選んだ特定の対象。プレイ時に決定する。',
    def_en: 'A specific object chosen for a spell or ability when it is cast/activated.',
    glyph: '◎',
  },
  instant: {
    jp: 'インスタント', kana: 'insutanto', en: 'Instant', cat: 'type',
    def_jp: '優先権がある時にいつでも唱えられる呪文。解決後は墓地に置かれる。',
    def_en: 'A spell castable any time you have priority. Goes to the graveyard after resolving.',
    glyph: '⏵',
  },
  flying: {
    jp: '飛行', kana: 'hikou', en: 'Flying', cat: 'ability',
    def_jp: 'このクリーチャーは飛行を持たないクリーチャーにブロックされない。',
    def_en: 'Can only be blocked by creatures with flying or reach.',
    glyph: '➤',
  },
  trample: {
    jp: 'トランプル', kana: 'toranpuru', en: 'Trample', cat: 'ability',
    def_jp: 'ブロックされた状態で、過剰なダメージを防御プレイヤーに与えられる。',
    def_en: 'Excess combat damage carries through to the defending player.',
    glyph: '➡',
  },
  haste: {
    jp: '速攻', kana: 'sokkou', en: 'Haste', cat: 'ability',
    def_jp: '召喚酔いを無視して、戦場に出たターンに攻撃や能力の起動ができる。',
    def_en: 'Ignores summoning sickness — can attack and tap the turn it enters play.',
    glyph: '⚡',
  },
  graveyard: {
    jp: '墓地', kana: 'bochi', en: 'Graveyard', cat: 'zone',
    def_jp: '破壊されたり、捨てられたりしたカードが置かれる場所。',
    def_en: 'Discard pile. Destroyed and discarded cards go here, face up.',
    glyph: '⌬',
  },
  battlefield: {
    jp: '戦場', kana: 'senjou', en: 'Battlefield', cat: 'zone',
    def_jp: '土地、クリーチャー、その他のパーマネントがプレイされる場所。',
    def_en: 'The play area where lands and permanents exist after being cast.',
    glyph: '◇',
  },
  power: {
    jp: 'パワー', kana: 'pawaa', en: 'Power', cat: 'action',
    def_jp: 'クリーチャーが戦闘で与えるダメージの量。',
    def_en: 'How much combat damage a creature deals.',
    glyph: '✸',
  },
};

// Keyword colors — five-channel system. Cool / type, violet / proper-noun
// type, amber / action verb, green / keyword ability, rose / zone.
window.CAT_COLORS = {
  type:    { fg: '#6BD4E8', bg: 'rgba(107,212,232,0.10)', border: 'rgba(107,212,232,0.45)' },
  'type-pw':{fg: '#B69CF7', bg: 'rgba(182,156,247,0.10)', border: 'rgba(182,156,247,0.45)' },
  action:  { fg: '#E8A56B', bg: 'rgba(232,165,107,0.10)', border: 'rgba(232,165,107,0.45)' },
  ability: { fg: '#8FD49C', bg: 'rgba(143,212,156,0.10)', border: 'rgba(143,212,156,0.45)' },
  zone:    { fg: '#F08C9C', bg: 'rgba(240,140,156,0.10)', border: 'rgba(240,140,156,0.45)' },
};

// Sample cards. The "rules" array is a sequence of either:
//  - { jp, kana, en } → plain text (kana shown above as furigana)
//  - { kw }          → looks up a keyword from GLOSSARY
window.CARDS = [
  {
    id: 'lightning-bolt',
    nameJp: '稲妻', nameKana: 'いなずま', nameRomaji: 'inazuma',
    nameEn: 'Lightning Bolt',
    typeKw: 'instant',
    cost: '{R}',
    setCode: 'M11 · 170/249 · C',
    artist: 'Chris Rahn',
    artHue: 18, // warm red — used to tint the placeholder
    rules: [
      { jp: '稲妻は', kana: 'いなずま' },
      { kw: 'creature' }, { jp: 'や' },
      { kw: 'planeswalker' }, { jp: 'や' },
      { kw: 'player' }, { jp: 'のうち１つを' },
      { kw: 'target' }, { jp: 'とする。稲妻はそれに３点の' },
      { kw: 'damage' }, { jp: 'を与える。' },
    ],
    rulesEn: 'Lightning Bolt deals 3 damage to any target.',
    notes: '入門編。シンプルだが「対象」「ダメージ」など基本ルールを学べる。',
  },
  {
    id: 'serra-angel',
    nameJp: '《セラの天使》', nameKana: 'セラのてんし', nameRomaji: 'sera no tenshi',
    nameEn: 'Serra Angel',
    typeKw: 'creature',
    cost: '{3}{W}{W}',
    setCode: 'CORE · 24/280 · U',
    artist: '—',
    artHue: 48,
    rules: [
      { kw: 'flying' }, { jp: '、警戒' },
    ],
    rulesEn: 'Flying, vigilance',
    notes: '能力キーワードのみ。短文でも文法構造を確認できる。',
  },
  {
    id: 'shock',
    nameJp: '《ショック》', nameKana: 'ショック', nameRomaji: 'shokku',
    nameEn: 'Shock',
    typeKw: 'instant',
    cost: '{R}',
    setCode: 'CORE · 156/280 · C',
    artist: '—',
    artHue: 12,
    rules: [
      { jp: 'ショックは' },
      { kw: 'creature' }, { jp: 'や' },
      { kw: 'player' }, { jp: 'のうち１つを' },
      { kw: 'target' }, { jp: 'とする。ショックはそれに２点の' },
      { kw: 'damage' }, { jp: 'を与える。' },
    ],
    rulesEn: 'Shock deals 2 damage to any target.',
    notes: '稲妻と並行して読むと、数詞の違いが学びやすい。',
  },
];
