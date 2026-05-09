import React, { useState, useCallback, useMemo } from "react";
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
  Platform,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { searchCards, CardData } from "../utils/scryfall";
import { recognizeCardName } from "../utils/ocr";
import { JA_DICT, DictEntry, groupColor } from "../utils/dictionary";
import { Ruby } from "../components/Ruby";
import { WordPopup } from "../components/WordPopup";

type Nav = NativeStackNavigationProp<RootStackParamList, "Search">;

const GROUP_META: Record<string, { tag: string; desc: string }> = {
  Evergreen: { tag: "常在", desc: "Core keyword abilities" },
  Classic: { tag: "旧式", desc: "Legacy keyword abilities" },
  "Ability Words": { tag: "能力語", desc: "Named ability words" },
  Actions: { tag: "動作", desc: "Game actions & verbs" },
  "Card Types": { tag: "種別", desc: "Card types & subtypes" },
  Zones: { tag: "領域", desc: "Game zones" },
  "Turn Structure": { tag: "フェイズ", desc: "Turn phases & steps" },
  Properties: { tag: "特性", desc: "Card properties" },
  "Ability Types": { tag: "能力型", desc: "Ability classifications" },
  Colors: { tag: "色", desc: "Mana colors" },
  "Game Terms": { tag: "用語", desc: "General game terms" },
};

const TOP_PAD =
  Platform.OS === "ios" ? 54 : (StatusBar.currentHeight ?? 0) + 16;

export function SearchScreen({ navigation }: { navigation: Nav }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DictEntry | null>(null);

  const wotd = useMemo<DictEntry>(() => {
    const entries = Object.values(JA_DICT).filter((e) => e.reading);
    return entries[Math.floor(Date.now() / 86400000) % entries.length];
  }, []);

  // Term counts per group
  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const entry of Object.values(JA_DICT)) {
      counts[entry.group] = (counts[entry.group] ?? 0) + 1;
    }
    return counts;
  }, []);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    const cards = await searchCards(q);
    setResults(cards);
    setLoading(false);
  }, []);

  const handleScan = async () => {
    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 1,
    });
    if (result.canceled || !result.assets?.[0]?.base64) return;
    setScanning(true);
    try {
      const name = await recognizeCardName(result.assets[0].base64);
      if (name) {
        setQuery(name);
        await handleSearch(name);
      } else {
        Alert.alert(
          "Not recognized",
          "Could not read card name. Try better lighting.",
        );
      }
    } finally {
      setScanning(false);
    }
  };

  const isSearchActive = query.trim().length > 0;
  const wotdC = groupColor(wotd.group);

  const renderResult = ({ item }: { item: CardData }) => (
    <TouchableOpacity
      style={styles.resultItem}
      activeOpacity={0.75}
      onPress={() =>
        navigation.navigate("Card", {
          set: item.set,
          collectorNumber: item.collector_number,
        })
      }
    >
      {item.image_uris?.art_crop ? (
        <Image
          source={{ uri: item.image_uris.art_crop }}
          style={styles.resultThumb}
        />
      ) : (
        <View style={[styles.resultThumb, styles.resultThumbPlaceholder]} />
      )}
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.printed_name || item.name}</Text>
        <Text style={styles.resultType}>
          {item.printed_type_line || item.type_line}
        </Text>
        <Text style={styles.resultSet}>
          {item.set.toUpperCase()} #{item.collector_number}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ── Fixed search bar ── */}
      <View style={styles.searchBarWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIconText}>⌕</Text>
          <TextInput
            style={styles.input}
            placeholder="Lightning Bolt / 稲妻 / inazuma…"
            placeholderTextColor="rgba(244,244,245,0.3)"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch(query)}
            returnKeyType="search"
            autoCapitalize="none"
            underlineColorAndroid="transparent"
          />
          {isSearchActive ? (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => {
                setQuery("");
                setResults([]);
              }}
            >
              <Text style={styles.iconBtnText}>✕</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.iconBtn} onPress={handleScan}>
              <Text style={styles.iconBtnText}>📷</Text>
            </TouchableOpacity>
          )}
        </View>
        {!isSearchActive && (
          <Text style={styles.searchTip}>Tip: use roman, kana, or kanji.</Text>
        )}
      </View>

      {/* ── Content area ── */}
      {isSearchActive ? (
        loading ? (
          <ActivityIndicator
            size="large"
            color="#E8B86B"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderResult}
            contentContainerStyle={styles.resultList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No results found.</Text>
            }
          />
        )
      ) : (
        <ScrollView
          contentContainerStyle={styles.dashboard}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          {/* Hero header */}
          <View style={styles.heroHeader}>
            <Text style={styles.heroLabel}>mtg · jp study</Text>
            <Text style={styles.heroTitle}>{"カードで\n日本語を学ぶ"}</Text>
            <Text style={styles.heroSub}>
              Search any Magic card. Read the Japanese rules text with tappable
              glossary.
            </Text>
          </View>

          {/* Word of the Day */}
          <Text style={styles.sectionLabel}>WORD OF THE DAY</Text>
          <TouchableOpacity
            style={[styles.wotdCard, { borderColor: wotdC.border }]}
            onPress={() => setSelectedEntry(wotd)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.wotdBadge,
                { backgroundColor: wotdC.darkBg, borderColor: wotdC.border },
              ]}
            >
              <Text style={[styles.wotdBadgeText, { color: wotdC.darkLabel }]}>
                {wotd.group.toUpperCase()}
              </Text>
            </View>
            <Ruby
              text={wotd.word}
              reading={wotd.reading}
              textStyle={[styles.wotdWord, { color: wotdC.darkLabel }]}
              readingStyle={{
                color: wotdC.darkLabel,
                opacity: 0.6,
                fontSize: 13,
              }}
            />
            <Text style={styles.wotdTranslation}>{wotd.translation}</Text>
          </TouchableOpacity>

          {/* Study sets */}
          <Text style={[styles.sectionLabel, { marginTop: 28 }]}>
            STUDY SETS
          </Text>
          <View style={styles.studySets}>
            {Object.entries(GROUP_META).map(([group, meta]) => {
              const c = groupColor(group);
              const count = groupCounts[group] ?? 0;
              return (
                <TouchableOpacity
                  key={group}
                  style={styles.studySetCard}
                  onPress={() => navigation.navigate("StudySet", { group })}
                  activeOpacity={0.75}
                >
                  <View
                    style={[
                      styles.studySetIcon,
                      { backgroundColor: c.darkBg, borderColor: c.border },
                    ]}
                  >
                    <Text style={[styles.studySetTag, { color: c.darkLabel }]}>
                      {meta.tag}
                    </Text>
                  </View>
                  <View style={styles.studySetInfo}>
                    <Text style={styles.studySetName}>{group}</Text>
                    <Text style={styles.studySetDesc}>{meta.desc}</Text>
                  </View>
                  <View style={styles.studySetRight}>
                    <Text style={styles.studySetCount}>{count}</Text>
                    <Text style={styles.studySetArrow}>›</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Scan overlay */}
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
    backgroundColor: "#0B0E14",
  },

  // Search bar
  searchBarWrap: {
    paddingTop: TOP_PAD,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#0B0E14",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.07)",
  },
  searchBar: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#1B2030",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 50,
  },
  searchIconText: {
    fontSize: 18,
    color: "rgba(244,244,245,0.38)",
    marginRight: 8,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: "#F4F4F5",
    fontFamily: "NotoSansJP_400Regular",
    padding: 0,
    minWidth: 0,
  },
  iconBtn: {
    position: "absolute",
    right: 7,
    top: 7,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnText: {
    fontSize: 16,
    color: "rgba(244,244,245,0.62)",
  },
  searchTip: {
    fontSize: 11,
    color: "rgba(244,244,245,0.38)",
    marginTop: 8,
    paddingLeft: 4,
    letterSpacing: 0.3,
  },

  loader: {
    marginTop: 48,
  },

  // Search results
  resultList: {
    padding: 16,
  },
  resultItem: {
    flexDirection: "row",
    backgroundColor: "#141821",
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  resultThumb: {
    width: 80,
    height: 56,
  },
  resultThumbPlaceholder: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  resultInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  resultName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
    color: "#F4F4F5",
    fontFamily: "NotoSansJP_700Bold",
  },
  resultType: {
    fontSize: 12,
    color: "rgba(244,244,245,0.62)",
    marginBottom: 2,
    fontFamily: "NotoSansJP_400Regular",
  },
  resultSet: {
    fontSize: 11,
    color: "rgba(244,244,245,0.38)",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 48,
    color: "rgba(244,244,245,0.38)",
    fontSize: 15,
  },

  // Dashboard
  dashboard: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroHeader: {
    paddingTop: 20,
    paddingBottom: 28,
  },
  heroLabel: {
    fontSize: 11,
    color: "rgba(244,244,245,0.38)",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#F4F4F5",
    fontFamily: "NotoSansJP_700Bold",
    lineHeight: 40,
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 14,
    color: "rgba(244,244,245,0.62)",
    lineHeight: 22,
    fontFamily: "NotoSansJP_400Regular",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "rgba(244,244,245,0.38)",
    marginBottom: 10,
  },

  // Word of the Day
  wotdCard: {
    backgroundColor: "#141821",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
  },
  wotdBadge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    marginBottom: 12,
  },
  wotdBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  wotdWord: {
    fontSize: 38,
    fontWeight: "700",
    fontFamily: "NotoSansJP_700Bold",
    marginBottom: 4,
  },
  wotdTranslation: {
    fontSize: 18,
    color: "rgba(244,244,245,0.62)",
    marginTop: 6,
    fontFamily: "NotoSansJP_400Regular",
  },

  // Study sets
  studySets: {},
  studySetCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141821",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    padding: 14,
    marginBottom: 8,
  },
  studySetIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginRight: 14,
  },
  studySetTag: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "NotoSansJP_700Bold",
    textAlign: "center",
  },
  studySetInfo: {
    flex: 1,
    minWidth: 0,
  },
  studySetName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F4F4F5",
    fontFamily: "NotoSansJP_400Regular",
  },
  studySetDesc: {
    fontSize: 11,
    color: "rgba(244,244,245,0.38)",
    marginTop: 2,
    letterSpacing: 0.3,
  },
  studySetRight: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  studySetCount: {
    fontSize: 13,
    color: "rgba(244,244,245,0.38)",
    fontWeight: "600",
    marginBottom: 2,
  },
  studySetArrow: {
    fontSize: 18,
    color: "rgba(244,244,245,0.25)",
  },

  // Scan overlay
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanOverlayText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 12,
  },
});
