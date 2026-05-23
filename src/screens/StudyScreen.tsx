import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  Pressable,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { useStudy } from '../context/StudyContext';
import { JA_DICT, groupColor } from '../utils/dictionary';
import { Ruby } from '../components/Ruby';
import { SrsCard, isDue, reviewCard } from '../utils/srs';
import { getExampleCard, CardData } from '../utils/scryfall';

const TOP_PAD = Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight ?? 0) + 16;
const DAY_MS = 24 * 60 * 60 * 1000;

function cardStatusLabel(card: SrsCard): string {
  if (card.reps === 0) return 'New';
  if (isDue(card)) return 'Due';
  const daysLeft = Math.ceil((card.nextReview - Date.now()) / DAY_MS);
  if (daysLeft <= 1) return 'Tomorrow';
  return `${daysLeft}d`;
}

function isMastered(card: SrsCard): boolean {
  return card.interval >= 21;
}

export function StudyScreen() {
  const { cards, dueCards, reviewWord, removeWord } = useStudy();
  const [queue, setQueue] = useState<string[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showReading, setShowReading] = useState(false);
  const [exampleCard, setExampleCard] = useState<CardData | null>(null);
  const [cardExpanded, setCardExpanded] = useState(false);

  const currentWord = queue[0] ?? null;
  const entry = currentWord ? JA_DICT[currentWord] : null;
  const currentSrsCard = cards.find(c => c.word === currentWord);

  useEffect(() => {
    if (!currentWord) { setExampleCard(null); return; }
    const currentEntry = JA_DICT[currentWord];
    if (!currentEntry) { setExampleCard(null); return; }
    let cancelled = false;
    setExampleCard(null);
    setCardExpanded(false);
    getExampleCard(currentEntry.translation).then(card => { if (!cancelled) setExampleCard(card); });
    return () => { cancelled = true; };
  }, [currentWord]);

  const startSession = useCallback(() => {
    setQueue(dueCards.map(c => c.word));
    setReviewing(true);
    setRevealed(false);
  }, [dueCards]);

  const handleReveal = () => { setRevealed(true); setShowReading(true); };

  const handleRate = useCallback(
    (rating: 'again' | 'good') => {
      if (!currentWord) return;
      reviewWord(currentWord, rating);
      const [, ...rest] = queue;
      if (rating === 'again') {
        setQueue([...rest, currentWord]);
      } else {
        setQueue(rest);
      }
      setRevealed(false);
    },
    [currentWord, queue, reviewWord],
  );

  const handleEndSession = () => {
    setReviewing(false);
    setQueue([]);
    setRevealed(false);
  };

  // ── Review mode ───────────────────────────────────────────────────────────
  if (reviewing && queue.length > 0 && entry) {
    const c = groupColor(entry.group);
    const goodInterval = currentSrsCard ? reviewCard(currentSrsCard, 'good').interval : 1;
    const goodLabel = goodInterval === 1 ? '1 day' : `${goodInterval} days`;

    return (
      <View style={styles.container}>
        <View style={[styles.topBar, { paddingTop: TOP_PAD }]}>
          <TouchableOpacity onPress={handleEndSession} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.queueCount}>{queue.length} remaining</Text>
          <TouchableOpacity
            onPress={() => setShowReading(r => !r)}
            style={[styles.readingToggle, showReading && styles.readingToggleOn]}
          >
            <Text style={[styles.readingToggleText, showReading && styles.readingToggleTextOn]}>
              あ
            </Text>
          </TouchableOpacity>
        </View>

        {!revealed ? (
          <Pressable style={styles.cardArea} onPress={handleReveal}>
            <View style={[styles.groupTag, { backgroundColor: c.darkBg, borderColor: c.border }]}>
              <Text style={[styles.groupTagText, { color: c.darkLabel }]}>
                {entry.group.toUpperCase()}
              </Text>
            </View>
            <View style={styles.wordContainer}>
              <Ruby
                text={entry.word}
                reading={showReading ? entry.reading : undefined}
                textStyle={[styles.wordText, { color: c.darkLabel }]}
                readingStyle={styles.readingText}
              />
            </View>
            <View style={styles.tapHint}>
              <Text style={styles.tapHintText}>Tap to reveal</Text>
            </View>
          </Pressable>
        ) : (
          <ScrollView
            style={styles.cardAreaScroll}
            contentContainerStyle={styles.cardAreaScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.groupTag, { backgroundColor: c.darkBg, borderColor: c.border }]}>
              <Text style={[styles.groupTagText, { color: c.darkLabel }]}>
                {entry.group.toUpperCase()}
              </Text>
            </View>
            <View style={styles.wordContainer}>
              <Ruby
                text={entry.word}
                reading={entry.reading}
                textStyle={[styles.wordText, { color: c.darkLabel }]}
                readingStyle={styles.readingText}
              />
            </View>
            <View style={styles.revealContainer}>
              <View style={[styles.divider, { backgroundColor: c.border }]} />
              <Text style={styles.translationText}>{entry.translation}</Text>
              {exampleCard?.image_uris && (
                <TouchableOpacity
                  style={styles.exampleCard}
                  onPress={() => setCardExpanded(true)}
                  activeOpacity={0.85}
                >
                  <Image
                    source={{ uri: exampleCard.image_uris.normal }}
                    style={styles.exampleCardImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.exampleCardHint}>Tap to enlarge</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        )}

        {revealed && (
          <View style={styles.ratingRow}>
            <TouchableOpacity
              style={[styles.ratingBtn, styles.againBtn]}
              onPress={() => handleRate('again')}
            >
              <Text style={styles.againBtnText}>Again</Text>
              <Text style={styles.ratingBtnSub}>1 day</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ratingBtn, styles.goodBtn]}
              onPress={() => handleRate('good')}
            >
              <Text style={styles.goodBtnText}>Good</Text>
              <Text style={styles.ratingBtnSub}>{goodLabel}</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={cardExpanded}
          transparent
          animationType="fade"
          onRequestClose={() => setCardExpanded(false)}
        >
          <Pressable style={styles.cardModal} onPress={() => setCardExpanded(false)}>
            <Image
              source={{ uri: exampleCard?.image_uris?.large ?? exampleCard?.image_uris?.normal }}
              style={styles.cardModalImage}
              resizeMode="contain"
            />
          </Pressable>
        </Modal>
      </View>
    );
  }

  // ── Session complete ──────────────────────────────────────────────────────
  if (reviewing && queue.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.doneIcon}>✓</Text>
        <Text style={styles.doneTitle}>All caught up!</Text>
        <Text style={styles.doneSubtitle}>Check back later for more reviews</Text>
        <TouchableOpacity style={styles.doneBtn} onPress={handleEndSession}>
          <Text style={styles.doneBtnText}>Back to list</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Overview ──────────────────────────────────────────────────────────────
  const dueCount = dueCards.length;
  const masteredCount = cards.filter(isMastered).length;

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: TOP_PAD }]}>
        <Text style={styles.screenTitle}>Study</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.overviewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, dueCount > 0 && styles.statValueDue]}>
              {dueCount}
            </Text>
            <Text style={styles.statLabel}>Due</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{cards.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{masteredCount}</Text>
            <Text style={styles.statLabel}>Mastered</Text>
          </View>
        </View>

        {dueCount > 0 && (
          <TouchableOpacity style={styles.startBtn} onPress={startSession}>
            <Text style={styles.startBtnText}>
              Start Review ({dueCount} {dueCount === 1 ? 'card' : 'cards'})
            </Text>
          </TouchableOpacity>
        )}

        {cards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No words yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap any word in the app and press "Add to Study" to build your deck
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionHeader}>YOUR WORDS</Text>
            {cards.map(card => {
              const dictEntry = JA_DICT[card.word];
              if (!dictEntry) return null;
              const c = groupColor(dictEntry.group);
              const status = cardStatusLabel(card);
              const cardIsDue = isDue(card) && card.reps > 0;
              const mastered = isMastered(card);
              return (
                <View key={card.word} style={styles.cardRow}>
                  <View style={styles.cardRowLeft}>
                    <View style={[styles.groupDot, { backgroundColor: c.border }]} />
                    <View>
                      <Text style={styles.cardRowWord}>{dictEntry.word}</Text>
                      <Text style={styles.cardRowEn}>{dictEntry.translation}</Text>
                    </View>
                  </View>
                  <View style={styles.cardRowRight}>
                    <View
                      style={[
                        styles.statusChip,
                        cardIsDue && styles.statusDue,
                        mastered && styles.statusMastered,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          cardIsDue && styles.statusTextDue,
                          mastered && styles.statusTextMastered,
                        ]}
                      >
                        {status}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert('Remove word', `Remove "${dictEntry.word}" from your study list?`, [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Remove', style: 'destructive', onPress: () => removeWord(card.word) },
                        ])
                      }
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.removeBtn}
                    >
                      <Text style={styles.removeBtnText}>×</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0E14' },
  centered: { alignItems: 'center', justifyContent: 'center' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { fontSize: 18, color: 'rgba(244,244,245,0.62)' },
  queueCount: {
    flex: 1,
    textAlign: 'center',
    color: 'rgba(244,244,245,0.45)',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F4F4F5',
    fontFamily: 'NotoSansJP_700Bold',
  },

  // ── Flashcard ──────────────────────────────────────────────────────────
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  cardAreaScroll: {
    flex: 1,
  },
  cardAreaScrollContent: {
    alignItems: 'center',
    padding: 32,
    paddingBottom: 16,
  },
  groupTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
    marginBottom: 28,
  },
  groupTagText: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4 },
  wordContainer: { alignItems: 'center', marginBottom: 16 },
  wordText: {
    fontFamily: 'NotoSansJP_700Bold',
    fontSize: 56,
    textAlign: 'center',
  },
  readingText: {
    fontSize: 16,
    color: 'rgba(244,244,245,0.38)',
    textAlign: 'center',
  },
  revealContainer: { alignItems: 'center', marginTop: 8 },
  divider: { width: 40, height: 1, marginBottom: 16, opacity: 0.4 },
  translationText: {
    fontSize: 24,
    color: '#F4F4F5',
    fontWeight: '500',
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
  },
  tapHint: { marginTop: 24 },
  tapHintText: {
    fontSize: 13,
    color: 'rgba(244,244,245,0.28)',
    letterSpacing: 0.4,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 48,
    paddingTop: 16,
  },
  ratingBtn: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  againBtn: {
    backgroundColor: 'rgba(192,48,32,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(192,48,32,0.35)',
  },
  goodBtn: {
    backgroundColor: 'rgba(42,158,92,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(42,158,92,0.35)',
  },
  againBtnText: { fontSize: 16, fontWeight: '600', color: '#E05540' },
  goodBtnText: { fontSize: 16, fontWeight: '600', color: '#44C87A' },
  ratingBtnSub: { fontSize: 11, color: 'rgba(244,244,245,0.35)', marginTop: 3 },

  // ── Reading toggle ─────────────────────────────────────────────────────
  readingToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readingToggleOn: {
    backgroundColor: 'rgba(232,182,48,0.15)',
    borderColor: 'rgba(232,182,48,0.45)',
  },
  readingToggleText: {
    fontSize: 18,
    color: 'rgba(244,244,245,0.38)',
    fontFamily: 'NotoSansJP_400Regular',
  },
  readingToggleTextOn: { color: '#E8B630' },

  // ── Example card reference ─────────────────────────────────────────────
  exampleCard: {
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  exampleCardImage: {
    width: 110,
    aspectRatio: 488 / 680,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  exampleCardHint: {
    fontSize: 11,
    color: 'rgba(244,244,245,0.28)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  cardModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardModalImage: {
    width: '90%',
    aspectRatio: 488 / 680,
  },

  // ── Done screen ────────────────────────────────────────────────────────
  doneIcon: { fontSize: 48, color: '#44C87A', marginBottom: 16 },
  doneTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F4F4F5',
    marginBottom: 8,
    fontFamily: 'NotoSansJP_700Bold',
  },
  doneSubtitle: {
    fontSize: 14,
    color: 'rgba(244,244,245,0.45)',
    marginBottom: 32,
  },
  doneBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  doneBtnText: { fontSize: 15, color: '#F4F4F5', fontWeight: '500' },

  // ── Overview ───────────────────────────────────────────────────────────
  overviewContent: { paddingHorizontal: 20, paddingTop: 8 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F4F4F5',
    fontFamily: 'NotoSansJP_700Bold',
  },
  statValueDue: { color: '#E8B630' },
  statLabel: {
    fontSize: 11,
    color: 'rgba(244,244,245,0.38)',
    marginTop: 3,
    letterSpacing: 0.4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  startBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#E8B630',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  startBtnText: { fontSize: 15, fontWeight: '700', color: '#0B0E14' },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(244,244,245,0.45)',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(244,244,245,0.3)',
    textAlign: 'center',
    lineHeight: 21,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(244,244,245,0.35)',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  cardRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  groupDot: { width: 8, height: 8, borderRadius: 4 },
  cardRowWord: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F4F4F5',
    fontFamily: 'NotoSansJP_700Bold',
  },
  cardRowEn: { fontSize: 12, color: 'rgba(244,244,245,0.38)', marginTop: 1 },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  statusDue: { backgroundColor: 'rgba(232,182,48,0.15)' },
  statusMastered: { backgroundColor: 'rgba(42,158,92,0.15)' },
  statusText: { fontSize: 11, color: 'rgba(244,244,245,0.45)' },
  statusTextDue: { color: '#E8B630' },
  statusTextMastered: { color: '#44C87A' },
  cardRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    fontSize: 18,
    color: 'rgba(244,244,245,0.25)',
    lineHeight: 22,
  },
});
