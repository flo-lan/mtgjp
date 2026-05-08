import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
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
});
