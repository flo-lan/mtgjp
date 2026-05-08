import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { searchCards, CardData } from '../utils/scryfall';
import { recognizeCardName } from '../utils/ocr';
import { JA_DICT, DictEntry, WordCategory } from '../utils/dictionary';
import { Ruby } from '../components/Ruby';
import { WordPopup } from '../components/WordPopup';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Search'>;
type CategoryFilter = WordCategory | 'all';

const CAT_COLOR: Record<WordCategory, { border: string; bg: string; label: string }> = {
  keyword: { border: '#C69320', bg: 'rgba(198,147,32,0.1)',  label: '#A87820' },
  action:  { border: '#B83A28', bg: 'rgba(184,58,40,0.08)', label: '#963020' },
  noun:    { border: '#2460A0', bg: 'rgba(36,96,160,0.08)', label: '#1A4880' },
};

const CAT_LABEL: Record<CategoryFilter, string> = {
  all: 'All', keyword: 'Keywords', action: 'Actions', noun: 'Game Terms',
};

const FILTERS: CategoryFilter[] = ['all', 'keyword', 'action', 'noun'];

export function SearchScreen({ navigation }: { navigation: Nav }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedEntry, setSelectedEntry] = useState<DictEntry | null>(null);

  const wotd = useMemo<DictEntry>(() => {
    const entries = Object.values(JA_DICT).filter(e => e.reading);
    return entries[Math.floor(Date.now() / 86400000) % entries.length];
  }, []);

  const vocabEntries = useMemo(() => {
    const all = Object.values(JA_DICT);
    return activeCategory === 'all' ? all : all.filter(e => e.category === activeCategory);
  }, [activeCategory]);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    const cards = await searchCards(q);
    setResults(cards);
    setLoading(false);
  }, []);

  const handleScan = async () => {
    const result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.6 });
    if (result.canceled || !result.assets?.[0]?.base64) return;
    setScanning(true);
    try {
      const name = await recognizeCardName(result.assets[0].base64);
      if (name) {
        setQuery(name);
        await handleSearch(name);
      } else {
        Alert.alert('Not recognized', 'Could not read card name. Try better lighting.');
      }
    } finally {
      setScanning(false);
    }
  };

  const isSearchActive = query.trim().length > 0;

  const wotdColor = CAT_COLOR[wotd.category];

  const renderResult = ({ item }: { item: CardData }) => (
    <TouchableOpacity
      style={styles.resultItem}
      activeOpacity={0.75}
      onPress={() => navigation.navigate('Card', { set: item.set, collectorNumber: item.collector_number })}
    >
      {item.image_uris?.art_crop && (
        <Image source={{ uri: item.image_uris.art_crop }} style={styles.resultThumb} />
      )}
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.printed_name || item.name}</Text>
        <Text style={styles.resultType}>{item.printed_type_line || item.type_line}</Text>
        <Text style={styles.resultSet}>{item.set.toUpperCase()} #{item.collector_number}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ── Search bar ── */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="English or Japanese kanji (稲妻)…"
          placeholderTextColor="rgba(0,0,0,0.3)"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch(query)}
          returnKeyType="search"
          autoCapitalize="none"
        />
        {isSearchActive && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => { setQuery(''); setResults([]); }}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.scanBtn} onPress={handleScan}>
          <Text style={styles.scanBtnText}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* ── Content ── */}
      {isSearchActive ? (
        loading ? (
          <ActivityIndicator size="large" color="#888" style={styles.loader} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            renderItem={renderResult}
            contentContainerStyle={styles.resultList}
            ListEmptyComponent={<Text style={styles.emptyText}>No results found.</Text>}
          />
        )
      ) : (
        <ScrollView contentContainerStyle={styles.dashboard} showsVerticalScrollIndicator={false}>

          {/* Word of the Day */}
          <Text style={styles.sectionLabel}>WORD OF THE DAY</Text>
          <TouchableOpacity
            style={[styles.wotdCard, { borderLeftColor: wotdColor.border }]}
            onPress={() => setSelectedEntry(wotd)}
            activeOpacity={0.8}
          >
            <View style={[styles.wotdBadge, { backgroundColor: wotdColor.border }]}>
              <Text style={styles.wotdBadgeText}>{wotd.category.toUpperCase()}</Text>
            </View>
            <Ruby
              text={wotd.word}
              reading={wotd.reading}
              textStyle={[styles.wotdWord, { color: wotdColor.label }]}
              readingStyle={[styles.wotdReading, { color: wotdColor.label }]}
            />
            <Text style={styles.wotdTranslation}>{wotd.translation}</Text>
          </TouchableOpacity>

          {/* Vocabulary browser */}
          <Text style={[styles.sectionLabel, { marginTop: 28 }]}>VOCABULARY</Text>
          <View style={styles.filterRow}>
            {FILTERS.map(cat => {
              const active = activeCategory === cat;
              const color = cat !== 'all' ? CAT_COLOR[cat as WordCategory] : null;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filterChip,
                    active && styles.filterChipActive,
                    active && color && { backgroundColor: color.border, borderColor: color.border },
                  ]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {CAT_LABEL[cat]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.wordGrid}>
            {vocabEntries.map(entry => {
              const c = CAT_COLOR[entry.category];
              return (
                <TouchableOpacity
                  key={entry.word}
                  style={[styles.wordChip, { borderColor: c.border, backgroundColor: c.bg }]}
                  onPress={() => setSelectedEntry(entry)}
                  activeOpacity={0.7}
                >
                  <Ruby
                    text={entry.word}
                    reading={entry.reading}
                    textStyle={[styles.wordChipJa, { color: c.label }]}
                    readingStyle={{ color: c.label, opacity: 0.65 }}
                  />
                  <Text style={styles.wordChipEn}>{entry.translation}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </ScrollView>
      )}

      {/* Scan OCR overlay */}
      {scanning && (
        <View style={styles.scanOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.scanOverlayText}>Reading card…</Text>
        </View>
      )}

      <WordPopup entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },

  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 38,
    backgroundColor: '#f2f2f7',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#000',
  },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    fontSize: 11,
    color: '#666',
  },
  scanBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f2f2f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBtnText: {
    fontSize: 20,
  },

  loader: {
    marginTop: 48,
  },

  // Search results
  resultList: {
    padding: 16,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  resultThumb: {
    width: 80,
    height: 56,
    backgroundColor: '#ddd',
  },
  resultInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  resultName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
    color: '#111',
  },
  resultType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  resultSet: {
    fontSize: 11,
    color: '#aaa',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 48,
    color: '#999',
    fontSize: 15,
  },

  // Dashboard
  dashboard: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: 'rgba(0,0,0,0.35)',
    marginBottom: 10,
  },

  // Word of the Day
  wotdCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  wotdBadge: {
    alignSelf: 'flex-start',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 12,
  },
  wotdBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  wotdWord: {
    fontSize: 38,
    fontWeight: '700',
    marginBottom: 4,
  },
  wotdReading: {
    fontSize: 14,
    opacity: 0.6,
  },
  wotdTranslation: {
    fontSize: 18,
    color: 'rgba(0,0,0,0.4)',
    marginTop: 6,
  },

  // Category filter
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#e8e8ed',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  filterChipText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  // Word grid
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  wordChipJa: {
    fontSize: 15,
    fontWeight: '700',
  },
  wordChipEn: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.4)',
    marginBottom: 1,
  },

  // Scan overlay
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  scanOverlayText: {
    color: '#fff',
    fontSize: 16,
  },
});
