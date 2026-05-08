import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { getJapaneseCard, CardData } from '../utils/scryfall';
import { DictEntry } from '../utils/dictionary';
import { CardRenderer } from '../components/CardRenderer';
import { WordPopup } from '../components/WordPopup';

type CardScreenRouteProp = RouteProp<RootStackParamList, 'Card'>;

interface Props {
  route: CardScreenRouteProp;
}

export function CardScreen({ route }: Props) {
  const { set, collectorNumber } = route.params;
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<DictEntry | null>(null);

  useEffect(() => {
    async function fetchCard() {
      const data = await getJapaneseCard(set, collectorNumber);
      setCard(data);
      setLoading(false);
    }
    fetchCard();
  }, [set, collectorNumber]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Fetching Japanese Localization...</Text>
      </View>
    );
  }

  if (!card) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Could not load card data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CardRenderer card={card} onWordSelect={setSelectedEntry} />
      </ScrollView>

      <WordPopup
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#fff',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
});
