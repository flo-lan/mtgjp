import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { CardData } from '../utils/scryfall';
import { DictEntry } from '../utils/dictionary';
import { InteractiveText } from './InteractiveText';
import { VocabPanel } from './VocabPanel';
import StandardCard from './native-mtg-card/StandardCard';

interface Props {
  card: CardData;
  onWordSelect: (entry: DictEntry) => void;
}

const CARD_MAX_WIDTH = 380;

export function CardRenderer({ card, onWordSelect }: Props) {
  const [showFurigana, setShowFurigana] = useState(false);

  const manaCost = (card.mana_cost || '').match(/\{([^}]+)\}/g)?.map(s => s.replace(/[{}]/g, '')) || [];
  const cardWidth = Math.min(Dimensions.get('window').width - 40, CARD_MAX_WIDTH);
  const rulesText = card.printed_text || card.oracle_text || '';

  return (
    <View style={styles.container}>
      <StandardCard
        width={cardWidth}
        cardName={card.printed_name || card.name}
        manaCost={manaCost}
        cardArt={card.image_uris?.art_crop}
        typeLine={card.printed_type_line || card.type_line}
        legendary={card.type_line.includes('Legendary')}
        rulesText={
          <InteractiveText
            text={rulesText}
            onWordSelect={onWordSelect}
            showFurigana={showFurigana}
          />
        }
        flavorText={card.flavor_text}
        power={card.power}
        toughness={card.toughness}
        cardNumber={card.collector_number}
        setCode={card.set}
        rarity={card.rarity}
        artist={card.artist}
      />

      <Pressable
        style={[styles.furiganaToggle, showFurigana && styles.furiganaToggleActive]}
        onPress={() => setShowFurigana((v: boolean) => !v)}
      >
        <Text style={[styles.furiganaToggleText, showFurigana && styles.furiganaToggleTextActive]}>
          ふりがな
        </Text>
      </Pressable>

      <VocabPanel text={rulesText} onWordSelect={onWordSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  furiganaToggle: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: -4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  furiganaToggleActive: {
    borderColor: 'rgba(198,147,32,0.5)',
    backgroundColor: 'rgba(198,147,32,0.12)',
  },
  furiganaToggleText: {
    fontFamily: 'NotoSansJP_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
  furiganaToggleTextActive: {
    color: '#E8B630',
  },
});
