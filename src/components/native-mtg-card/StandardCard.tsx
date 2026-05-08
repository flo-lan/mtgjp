import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import ManaSymbol from './ManaSymbol';
import { FuriganaText } from '../FuriganaText';
import {
  ColoredSvg,
  useCardTheme,
  getThemeVars,
  ManaCostRow,
  SetSymbolIcon,
  Metadata,
  Copyright
} from './shared';

import {
  coloredBgRaw,
  nameFieldRaw,
  typelineFieldRaw,
  edgesBorderRaw,
  edgesShadowRaw,
  bgOuterRaw,
  bgInnerRaw,
  legendBorderMaskRaw,
  legendLeftRaw,
  legendRightRaw
} from './svgStrings';

const flavorBarSvg = require('../../assets/flavor-bar.svg');
const legendTopImg = require('../../assets/legendary-top.webp');

export interface StandardCardProps {
  frame?: string;
  cardName: string;
  manaCost: string[];
  cardArt?: string;
  typeLine: string;
  legendary?: boolean;
  rulesText?: string | ReactNode;
  flavorText?: string;
  power?: string;
  toughness?: string;
  landSymbol?: string;
  cardNumber?: string;
  totalCards?: string;
  rarity?: string;
  setCode?: string;
  setSymbolUrl?: string;
  language?: string;
  artist?: string;
  year?: string;
  width?: number; // Target width for scaling
}

const CARD_WIDTH = 672;
const CARD_HEIGHT = 936;

export default function StandardCard({
  frame,
  cardName,
  manaCost,
  cardArt,
  typeLine,
  legendary,
  rulesText,
  flavorText,
  power,
  toughness,
  landSymbol,
  cardNumber,
  totalCards,
  rarity,
  setCode,
  setSymbolUrl,
  language,
  artist,
  year,
  width,
}: StandardCardProps) {
  const hasPT = power !== undefined && toughness !== undefined;
  const isVehicle = frame === 'vehicle';
  const { theme, textureUrl } = useCardTheme(manaCost, frame);
  const { frameVars, fieldVars, borderVars, ptVars } = getThemeVars(theme);
  const vehicleFrameVars = { '--fill-0': '#C49A6C' };

  // If width is provided, scale the card. Otherwise, use full size.
  const scale = width ? width / CARD_WIDTH : 1;
  const wrapperStyle = width ? {
    width: CARD_WIDTH * scale,
    height: CARD_HEIGHT * scale,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    overflow: 'hidden' as const,
  } : {
    width: '100%',
    aspectRatio: CARD_WIDTH / CARD_HEIGHT,
    maxWidth: CARD_WIDTH,
    maxHeight: CARD_HEIGHT,
    alignSelf: 'center' as const,
  };

  return (
    <View style={wrapperStyle}>
      <View style={[styles.card, width ? { width: CARD_WIDTH, height: CARD_HEIGHT, transform: [{ scale }] } : {}]}>
        <View style={styles.borderBlack} />

        <View style={styles.textureBg}>
          <Image source={textureUrl} style={styles.textureImg} resizeMode="cover" />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.card, opacity: 0.6 }]} />
        </View>

        <ColoredSvg
          xml={coloredBgRaw}
          vars={isVehicle ? vehicleFrameVars : frameVars}
          style={styles.coloredBg}
        />

        <View style={styles.textBox}>
          <View style={[styles.textBoxBg, { backgroundColor: theme.text }]} />
        </View>

        <ColoredSvg xml={edgesBorderRaw} vars={borderVars} style={styles.edgesBorder} />
        <ColoredSvg xml={edgesShadowRaw} vars={borderVars} style={styles.edgesShadow} />

        {legendary && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <ColoredSvg xml={legendBorderMaskRaw} style={styles.legendBorderMask} />
            <ColoredSvg xml={legendLeftRaw} vars={borderVars} style={styles.legendLeft} />
            <ColoredSvg xml={legendRightRaw} vars={borderVars} style={styles.legendRight} />
            <View style={styles.legendTop}>
              <Image source={legendTopImg} style={styles.legendTopImg} />
            </View>
          </View>
        )}

        <View style={styles.nameField}>
          <ColoredSvg xml={nameFieldRaw} vars={fieldVars} style={styles.fieldBgWrap} />
        </View>

        <View style={styles.typelineField}>
          <ColoredSvg xml={typelineFieldRaw} vars={fieldVars} style={styles.fieldBgWrap} />
        </View>

        <View style={styles.artFrame}>
          {cardArt && <Image source={{ uri: cardArt }} style={styles.artImg} />}
        </View>

        <View style={styles.cardName}>
          <FuriganaText
            text={cardName}
            textStyle={styles.cardNameText}
            readingStyle={styles.cardNameReading}
            numberOfLines={1}
          />
        </View>

        <ManaCostRow manaCost={manaCost} style={styles.manaCost} />

        <View style={styles.typeLine}>
          <FuriganaText
            text={typeLine}
            textStyle={styles.typeLineText}
            readingStyle={styles.typeLineReading}
            numberOfLines={1}
          />
        </View>

        <SetSymbolIcon
          style={styles.setSymbol}
          setCode={setCode}
          rarity={rarity}
          setSymbolUrl={setSymbolUrl}
        />

        {landSymbol ? (
          <View style={styles.landSymbol}>
            <ManaSymbol symbol={landSymbol} size={178} />
          </View>
        ) : (
          <View style={styles.rulesArea}>
            {typeof rulesText === 'string' ? (
              <Text style={styles.rulesText}>{rulesText}</Text>
            ) : (
              rulesText
            )}
            {flavorText && (
              <View style={styles.flavorSection}>
                <Image source={flavorBarSvg} style={styles.flavorBar} resizeMode="stretch" />
                <Text style={styles.flavorText}>{flavorText}</Text>
              </View>
            )}
          </View>
        )}

        {hasPT && (
          <View style={styles.ptBox}>
            <ColoredSvg xml={bgOuterRaw} vars={isVehicle ? { '--fill-0': '#FFFFFF' } : ptVars} style={styles.ptOuter} />
            <ColoredSvg xml={bgInnerRaw} vars={isVehicle ? { '--fill-0': '#FFFFFF' } : ptVars} style={styles.ptInner} />
            <View style={styles.ptTextContainer}>
              <Text style={styles.ptText}>{power}/{toughness}</Text>
            </View>
          </View>
        )}

        <Metadata
          style={styles.metadata}
          cardNumber={cardNumber}
          totalCards={totalCards}
          rarity={rarity}
          setCode={setCode}
          language={language}
          artist={artist}
        />

        <Copyright style={styles.copyright} year={year} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    aspectRatio: 672 / 936,
    maxWidth: 672,
    maxHeight: 936,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 15,
    overflow: 'hidden',
  },
  borderBlack: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#17140f',
  },
  textureBg: {
    position: 'absolute',
    top: '2.56%', left: '3.57%', bottom: '6.94%', right: '3.57%',
    overflow: 'hidden',
    borderRadius: 8,
  },
  textureImg: {
    width: '100%',
    height: '100%',
  },
  coloredBg: {
    position: 'absolute',
    top: '2.56%', left: '3.57%', bottom: '6.94%', right: '3.57%',
    opacity: 0.8,
  },
  textBox: {
    position: 'absolute',
    top: '62.55%', right: '7.51%', bottom: '7.64%', left: '7.81%',
  },
  textBoxBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
  },
  edgesBorder: {
    position: 'absolute',
    top: '4.22%', right: '4.83%', bottom: '7.00%', left: '4.98%',
  },
  edgesShadow: {
    position: 'absolute',
    top: '3.53%', right: '3.57%', bottom: '6.01%', left: '3.57%',
  },
  dropShadow: {
    position: 'absolute',
    top: '3.53%', right: '84.30%', bottom: '7.15%', left: '3.57%',
  },
  legendBorderMask: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: '91.03%',
  },
  legendLeft: {
    position: 'absolute',
    top: '3.42%', right: '93.13%', bottom: '51.71%', left: '3.57%',
  },
  legendRight: {
    position: 'absolute',
    top: '3.42%', right: '3.57%', bottom: '51.71%', left: '93.13%',
  },
  legendTop: {
    position: 'absolute',
    top: '2.56%', right: '2.08%', bottom: '88.89%', left: '2.08%',
  },
  legendTopImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  nameField: {
    position: 'absolute',
    top: '5.02%', right: '5.8%', bottom: '89.42%', left: '5.95%',
  },
  typelineField: {
    position: 'absolute',
    top: '56.41%', right: '5.8%', bottom: '38.03%', left: '5.95%',
  },
  fieldBgWrap: {
    position: 'absolute',
    top: '-3.85%', right: '-0.34%', bottom: '-3.85%', left: '-0.34%',
  },
  artFrame: {
    position: 'absolute',
    top: '11.38%', right: '7.51%', bottom: '44.18%', left: '7.66%',
    overflow: 'hidden',
  },
  artImg: {
    width: '100%',
    height: '100%',
  },
  cardName: {
    position: 'absolute',
    top: '5%', left: '8.18%', right: '7.44%', height: '5.56%',
    justifyContent: 'center',
  },
  cardNameText: {
    fontFamily: 'NotoSansJP_700Bold',
    fontSize: 24,
    color: 'black',
  },
  cardNameReading: {
    color: 'rgba(0,0,0,0.4)',
  },
  manaCost: {
    position: 'absolute',
    right: '8%',
    top: '5%',
    height: '5.56%',
    alignItems: 'center',
  },
  typeLine: {
    position: 'absolute',
    top: '56.41%', left: '8.18%', right: '7.44%', height: '5.56%',
    justifyContent: 'center',
  },
  typeLineText: {
    fontFamily: 'NotoSansJP_700Bold',
    fontSize: 20,
    color: 'black',
  },
  typeLineReading: {
    color: 'rgba(0,0,0,0.4)',
  },
  setSymbol: {
    position: 'absolute',
    top: '56.94%', right: '7.74%', bottom: '38.78%',
    width: '6%',
  },
  rulesArea: {
    position: 'absolute',
    top: '63.46%', right: '7.44%', bottom: '8.55%', left: '9.38%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  rulesText: {
    fontFamily: 'NotoSansJP_400Regular',
    fontSize: 16,
    color: 'black',
    lineHeight: 22,
    textAlign: 'left',
    width: '100%',
  },
  flavorSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  flavorBar: {
    width: '80%',
    height: 2,
    marginBottom: 8,
  },
  flavorText: {
    fontFamily: 'NotoSansJP_400Regular',
    fontStyle: 'italic',
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    width: '100%',
  },
  landSymbol: {
    position: 'absolute',
    top: '66.99%', right: '33.78%', bottom: '11.85%', left: '39.73%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ptBox: {
    position: 'absolute',
    right: '5.35%',
    bottom: '5.34%',
    width: '16.5%',
    aspectRatio: 111 / 53,
  },
  ptOuter: {
    position: 'absolute',
    top: 0, right: 0, bottom: '-15.09%', left: '-7.21%',
  },
  ptInner: {
    position: 'absolute',
    top: '7.5%', right: '3.6%', bottom: '7.5%', left: '3.6%',
  },
  ptTextContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ptText: {
    fontFamily: 'NotoSansJP_700Bold',
    fontSize: 24,
    color: 'black',
  },
  metadata: {
    position: 'absolute',
    left: '6.4%',
    bottom: '2.5%',
    width: '56%',
  },
  copyright: {
    position: 'absolute',
    right: '5.8%',
    bottom: '3%',
  },
});
