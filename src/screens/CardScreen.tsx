import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getJapaneseCard, getEnglishCard, CardData } from '../utils/scryfall';
import { DictEntry, extractVocab, groupColor } from '../utils/dictionary';
import { CardRenderer } from '../components/CardRenderer';
import { InteractiveText } from '../components/InteractiveText';
import { WordPopup } from '../components/WordPopup';

type CardScreenRouteProp = RouteProp<RootStackParamList, 'Card'>;
type CardScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Card'>;

interface Props {
  route: CardScreenRouteProp;
  navigation: CardScreenNavProp;
}

const TOP_PAD = Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight ?? 0) + 16;

function SectionHeader({ label, right }: { label: string; right?: string }) {
  return (
    <View style={sh.row}>
      <Text style={sh.label}>{label}</Text>
      {right ? <Text style={sh.right}>{right}</Text> : null}
    </View>
  );
}
const sh = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(244,244,245,0.38)' },
  right: { fontSize: 11, color: '#E8B86B' },
});

function MiniToggle({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[mt.btn, active && mt.btnActive]}>
      <Text style={[mt.text, active && mt.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}
const mt = StyleSheet.create({
  btn:        { height: 28, minWidth: 34, paddingHorizontal: 9, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', alignItems: 'center', justifyContent: 'center' },
  btnActive:  { backgroundColor: 'rgba(232,184,107,0.14)', borderColor: 'rgba(232,184,107,0.35)' },
  text:       { fontSize: 12, fontWeight: '600', color: 'rgba(244,244,245,0.38)', fontFamily: 'NotoSansJP_700Bold' },
  textActive: { color: '#E8B86B' },
});

export function CardScreen({ route, navigation }: Props) {
  const { set, collectorNumber } = route.params;
  const [card, setCard] = useState<CardData | null>(null);
  const [enCard, setEnCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<DictEntry | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [showFurigana, setShowFurigana] = useState(false);
  const [showEn, setShowEn] = useState(false);

  useEffect(() => {
    async function fetchCards() {
      const jaData = await getJapaneseCard(set, collectorNumber);
      setCard(jaData);
      setLoading(false);
      if (jaData?.oracle_id) {
        const enData = await getEnglishCard(jaData.oracle_id, jaData.set);
        setEnCard(enData);
      }
    }
    fetchCards();
  }, [set, collectorNumber]);

  const rulesText = card ? (card.printed_text || card.oracle_text || '') : '';

  const vocabTerms = useMemo(
    () => extractVocab(rulesText),
    [rulesText],
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#E8B86B" />
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

  const typeC = groupColor('Card Types');

  return (
    <View style={styles.container}>
      {/* ── Top action bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarBtn}>
          <Text style={styles.topBarBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarCode}>{card.set.toUpperCase()} #{card.collector_number}</Text>
        <View style={styles.topBarRight}>
          <TouchableOpacity onPress={() => setIsFav(v => !v)} style={styles.topBarBtn}>
            <Text style={[styles.topBarBtnText, isFav && styles.favActive]}>
              {isFav ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBarBtn}>
            <Text style={styles.topBarBtnText}>···</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Card renderer ── */}
        <CardRenderer card={card} enCard={enCard} onWordSelect={setSelectedEntry} />

        {/* ── Identity block ── */}
        <View style={styles.section}>
          <Text style={styles.nameJp}>{card.printed_name || card.name}</Text>
          <Text style={styles.nameEn}>{card.name}</Text>

          <View style={styles.typeRow}>
            <View style={[styles.typeChip, { backgroundColor: typeC.darkBg, borderColor: typeC.border }]}>
              <Text style={[styles.typeChipText, { color: typeC.darkLabel }]}>
                {card.printed_type_line || card.type_line}
              </Text>
            </View>
            <View style={{ flex: 1 }} />
            {card.mana_cost ? (
              <Text style={styles.manaCost}>{card.mana_cost}</Text>
            ) : null}
          </View>
        </View>

        {/* ── Rules text study area ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <SectionHeader label="ルール · Rules" />
            <View style={styles.toggles}>
              <MiniToggle label="振" active={showFurigana} onPress={() => setShowFurigana(v => !v)} />
              <MiniToggle label="EN" active={showEn} onPress={() => setShowEn(v => !v)} />
            </View>
          </View>

          <View style={styles.rulesBox}>
            <InteractiveText
              text={rulesText}
              onWordSelect={setSelectedEntry}
              showFurigana={showFurigana}
              dark
            />
            {showEn && card.oracle_text ? (
              <View style={styles.enRules}>
                <Text style={styles.enRulesText}>{card.oracle_text}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.rulesHint}>↑ tap any colored term for definition</Text>
        </View>

        {/* ── Terms list ── */}
        {vocabTerms.length > 0 && (
          <View style={styles.section}>
            <SectionHeader label={`Terms · ${vocabTerms.length}`} />
            <View style={styles.termsList}>
              {vocabTerms.map(entry => {
                const c = groupColor(entry.group);
                return (
                  <TouchableOpacity
                    key={entry.word}
                    style={[styles.termRow, { borderColor: c.border }]}
                    onPress={() => setSelectedEntry(entry)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.termIcon, { backgroundColor: c.darkBg }]}>
                      <Text style={[styles.termIconText, { color: c.darkLabel }]}>
                        {entry.word.slice(0, 1)}
                      </Text>
                    </View>
                    <View style={styles.termInfo}>
                      <Text style={[styles.termJp, { color: c.darkLabel }]}>{entry.word}</Text>
                      <Text style={styles.termEn}>{entry.translation}</Text>
                    </View>
                    <Text style={styles.termArrow}>›</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      <WordPopup entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: 'rgba(244,244,245,0.62)',
    fontFamily: 'NotoSansJP_400Regular',
  },
  errorText: {
    color: '#F06060',
    fontSize: 16,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: TOP_PAD,
    paddingBottom: 10,
    paddingHorizontal: 14,
    backgroundColor: '#0B0E14',
  },
  topBarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarBtnText: {
    fontSize: 18,
    color: 'rgba(244,244,245,0.62)',
  },
  favActive: {
    color: '#F08C9C',
  },
  topBarCode: {
    fontSize: 10,
    letterSpacing: 1.4,
    color: 'rgba(244,244,245,0.38)',
    textTransform: 'uppercase',
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 6,
  },

  scroll: {
    paddingBottom: 40,
  },

  // Shared section wrapper
  section: {
    paddingHorizontal: 22,
    paddingTop: 26,
  },

  // Identity
  nameJp: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F4F4F5',
    fontFamily: 'NotoSansJP_700Bold',
    lineHeight: 38,
    letterSpacing: 0.5,
  },
  nameEn: {
    fontSize: 16,
    color: 'rgba(244,244,245,0.62)',
    marginTop: 6,
    fontFamily: 'NotoSansJP_400Regular',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  typeChip: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'NotoSansJP_400Regular',
  },
  manaCost: {
    fontSize: 12,
    color: 'rgba(244,244,245,0.38)',
    letterSpacing: 0.4,
  },

  // Rules text
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  toggles: {
    flexDirection: 'row',
    gap: 6,
  },
  rulesBox: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#141821',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  enRules: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  enRulesText: {
    fontSize: 13,
    color: 'rgba(244,244,245,0.55)',
    fontStyle: 'italic',
    lineHeight: 20,
    fontFamily: 'NotoSansJP_400Regular',
  },
  rulesHint: {
    fontSize: 11,
    color: 'rgba(244,244,245,0.25)',
    marginTop: 10,
    paddingLeft: 4,
    letterSpacing: 0.4,
  },

  // Terms list
  termsList: {
    gap: 8,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#141821',
    borderRadius: 13,
    borderWidth: 1,
    padding: 12,
  },
  termIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  termIconText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'NotoSansJP_700Bold',
  },
  termInfo: {
    flex: 1,
    minWidth: 0,
  },
  termJp: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'NotoSansJP_700Bold',
  },
  termEn: {
    fontSize: 12,
    color: 'rgba(244,244,245,0.55)',
    marginTop: 2,
    fontFamily: 'NotoSansJP_400Regular',
  },
  termArrow: {
    fontSize: 18,
    color: 'rgba(244,244,245,0.2)',
  },
});
