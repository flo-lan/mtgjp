import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { JA_DICT, DictEntry, groupColor } from '../utils/dictionary';
import { Ruby } from '../components/Ruby';
import { WordPopup } from '../components/WordPopup';

type StudySetRouteProp = RouteProp<RootStackParamList, 'StudySet'>;
type StudySetNavProp = NativeStackNavigationProp<RootStackParamList, 'StudySet'>;

interface Props {
  route: StudySetRouteProp;
  navigation: StudySetNavProp;
}

const TOP_PAD = Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight ?? 0) + 16;

export function StudySetScreen({ route, navigation }: Props) {
  const { group } = route.params;
  const [selectedEntry, setSelectedEntry] = useState<DictEntry | null>(null);

  const entries = useMemo(
    () => Object.values(JA_DICT).filter(e => e.group === group),
    [group],
  );

  const c = groupColor(group);

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarGroup}>{group}</Text>
          <Text style={styles.topBarCount}>{entries.length} terms</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {entries.map(entry => (
            <TouchableOpacity
              key={entry.word}
              style={[styles.chip, { borderColor: c.border, backgroundColor: c.darkBg }]}
              onPress={() => setSelectedEntry(entry)}
              activeOpacity={0.75}
            >
              <Ruby
                text={entry.word}
                reading={entry.reading}
                textStyle={[styles.chipJa, { color: c.darkLabel }]}
                readingStyle={{ color: c.darkLabel, opacity: 0.6, fontSize: 10 }}
              />
              <Text style={styles.chipEn}>{entry.translation}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 40 }} />
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: TOP_PAD,
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
  backBtnText: {
    fontSize: 18,
    color: 'rgba(244,244,245,0.62)',
  },
  topBarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topBarGroup: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F4F4F5',
    fontFamily: 'NotoSansJP_700Bold',
  },
  topBarCount: {
    fontSize: 11,
    color: 'rgba(244,244,245,0.38)',
    marginTop: 2,
    letterSpacing: 0.4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  chipJa: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'NotoSansJP_700Bold',
  },
  chipEn: {
    fontSize: 11,
    color: 'rgba(244,244,245,0.45)',
    fontFamily: 'NotoSansJP_400Regular',
    marginTop: 3,
  },
});
