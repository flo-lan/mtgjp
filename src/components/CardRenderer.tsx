import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { CardData } from '../utils/scryfall';
import { InteractiveText } from './InteractiveText';
import StandardCard from './native-mtg-card/StandardCard';

interface Props {
  card: CardData;
}

const CARD_MAX_WIDTH = 380; // Reasonable max width for a card

export function CardRenderer({ card }: Props) {
  // Extract mana cost as array of symbols: "{1}{R}{R}" -> ["1", "R", "R"]
  const manaCostRaw = card.mana_cost || '';
  const manaCost = manaCostRaw.match(/\{([^}]+)\}/g)?.map((s: string) => s.replace(/[{}]/g, '')) || [];
  
  // Calculate dynamic width, leaving 20px padding on each side
  const windowWidth = Dimensions.get('window').width;
  const cardWidth = Math.min(windowWidth - 40, CARD_MAX_WIDTH);

  return (
    <View style={styles.container}>
      <StandardCard
        width={cardWidth}
        cardName={card.printed_name || card.name}
        manaCost={manaCost}
        cardArt={card.image_uris?.art_crop}
        typeLine={card.printed_type_line || card.type_line}
        legendary={card.type_line.includes('Legendary')}
        rulesText={<InteractiveText text={card.printed_text || card.oracle_text || ''} />}
        flavorText={card.flavor_text}
        power={card.power}
        toughness={card.toughness}
        cardNumber={card.collector_number}
        setCode={card.set}
        rarity={card.rarity}
        artist={card.artist}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
});
