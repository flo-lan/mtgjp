import React, { ReactNode } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import ManaSymbol from './ManaSymbol';
import { getColorTheme, CardColorTheme } from './colors';

import ArtistIcon from '../../assets/artist-icon.svg';
import SetSymbolSvg from '../../assets/set-symbol.svg';
import { edgesMaskRaw } from './svgStrings';

const bgWhite = require('../../assets/bgWhite.webp');
const bgBlue = require('../../assets/bgBlue.webp');
const bgBlack = require('../../assets/bgBlack.webp');
const bgRed = require('../../assets/bgRed.webp');
const bgGreen = require('../../assets/bgGreen.webp');
const bgGold = require('../../assets/bgGold.webp');
const bgArtifact = require('../../assets/bgArtifact.webp');
const bgWB = require('../../assets/bgWB.webp');
const bgUB = require('../../assets/bgUB.webp');
const bgUR = require('../../assets/bgUR.webp');
const bgBR = require('../../assets/bgBR.webp');
const bgBG = require('../../assets/bgBG.webp');
const bgRW = require('../../assets/bgRW.webp');
const bgRG = require('../../assets/bgRG.webp');
const bgGW = require('../../assets/bgGW.webp');
const bgGU = require('../../assets/bgGU.webp');
const bgLand = require('../../assets/bgLand.webp');

const MONO_TEXTURES: Record<string, any> = { W: bgWhite, U: bgBlue, B: bgBlack, R: bgRed, G: bgGreen };
const DUAL_TEXTURES: Record<string, any> = {
  WB: bgWB, BW: bgWB, UB: bgUB, BU: bgUB, UR: bgUR, RU: bgUR,
  BR: bgBR, RB: bgBR, BG: bgBG, GB: bgBG, RW: bgRW, WR: bgRW,
  RG: bgRG, GR: bgRG, GW: bgGW, WG: bgGW, GU: bgGU, UG: bgGU,
};

export function getTextureUrl(manaCost: string[], frame?: string): any {
  if (frame === 'vehicle') return bgArtifact;
  const WUBRG = new Set(['W', 'U', 'B', 'R', 'G']);
  const colors = new Set<string>();
  for (const sym of manaCost) {
    const s = sym.toUpperCase();
    if (WUBRG.has(s)) { colors.add(s); continue; }
    if (s.includes('/')) {
      const [a, b] = s.split('/');
      if (WUBRG.has(a)) colors.add(a);
      if (WUBRG.has(b)) colors.add(b);
    }
  }
  if (frame === 'land' && colors.size === 0) return bgLand;
  if (colors.size === 0) return bgArtifact;
  if (colors.size === 1) { const [c] = colors; return MONO_TEXTURES[c]; }
  if (colors.size === 2) {
    const key = [...colors].join('');
    if (DUAL_TEXTURES[key]) return DUAL_TEXTURES[key];
  }
  return bgGold;
}

export function ColoredSvg({ xml, vars, style }: { xml: string; vars?: Record<string, string>; style?: any }) {
  let processedXml = xml;
  if (vars) {
    for (const [key, value] of Object.entries(vars)) {
      // Matches var(--key) or var(--key, #fallback)
      processedXml = processedXml.replace(new RegExp(`var\\(\\s*${key}\\s*(?:,[^)]*)?\\)`, 'g'), value);
    }
  }
  return (
    <View style={style}>
      <SvgXml xml={processedXml} width="100%" height="100%" />
    </View>
  );
}

export function DropShadow({ style }: { style?: any }) {
  return <ColoredSvg xml={edgesMaskRaw} style={style} />;
}

export function useCardTheme(manaCost: string[], frame?: string) {
  const theme = getColorTheme(manaCost, frame);
  const textureUrl = getTextureUrl(manaCost, frame);
  return { theme, textureUrl };
}

export function getThemeVars(theme: CardColorTheme) {
  return {
    frameVars: { '--fill-0': theme.card },
    fieldVars: { '--fill-0': theme.nameType },
    borderVars: { '--stroke-0': theme.border },
    legendVars: { '--fill-0': theme.border },
    ptVars: { '--fill-0': theme.nameType },
  };
}

export function ManaCostRow({ manaCost, style }: { manaCost: string[]; style?: any }) {
  return (
    <View style={[styles.manaRow, style]}>
      {manaCost.map((symbol, i) => (
        <ManaSymbol key={i} symbol={symbol} size={18} margin={0} />
      ))}
    </View>
  );
}

const RARITY_MAP: Record<string, string> = { common: 'C', uncommon: 'U', rare: 'R', mythic: 'M' };

export function getSetSymbolUrl(setCode: string, rarity?: string): string {
  const code = setCode.toUpperCase();
  const file = (rarity && RARITY_MAP[rarity.toLowerCase()]) || rarity?.toUpperCase() || 'R';
  return `https://cdn.jsdelivr.net/gh/Investigamer/mtg-vectors@main/svg/optimized/set/${code}/${file}.svg`;
}

export function SetSymbolIcon({ setCode, rarity, setSymbolUrl, style }: any) {
  const src = setSymbolUrl ? setSymbolUrl : setCode ? getSetSymbolUrl(setCode, rarity) : null;
  return (
    <View style={style}>
      {src ? (
        <Image source={{ uri: src }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
      ) : (
        <SetSymbolSvg width="100%" height="100%" />
      )}
    </View>
  );
}

export function Metadata({
  cardNumber, totalCards, rarity, setCode, language, artist,
  style
}: any) {
  return (
    <View style={style}>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {cardNumber && totalCards && `${cardNumber}/${totalCards} `}
          {rarity && rarity}
        </Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {[setCode, language].filter(Boolean).join(' • ')}
        </Text>
        <ArtistIcon width={10} height={10} style={{ marginHorizontal: 4 }} />
        <Text style={styles.metaText}>{artist}</Text>
      </View>
    </View>
  );
}

export function Copyright({ year, style }: any) {
  return (
    <View style={style}>
      <Text style={styles.metaText}>{year ?? '2026'} Fan Made Card & Not For Sale</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  manaRow: {
    flexDirection: 'row',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metaText: {
    fontSize: 7,
    color: 'white',
  }
});
