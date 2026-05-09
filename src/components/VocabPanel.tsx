import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { extractVocab, DictEntry, WordCategory, groupColor } from "../utils/dictionary";
import { Ruby } from "./Ruby";

interface Props {
  text: string;
  onWordSelect: (entry: DictEntry) => void;
}

const CATEGORY_ORDER: WordCategory[] = ["keyword", "action", "noun"];

const SECTION_LABEL: Record<WordCategory, string> = {
  keyword: "Keywords",
  action: "Actions",
  noun: "Game Terms",
};

export function VocabPanel({ text, onWordSelect }: Props) {
  const vocab = extractVocab(text);
  if (vocab.length === 0) return null;

  const grouped = CATEGORY_ORDER.reduce<
    Partial<Record<WordCategory, DictEntry[]>>
  >((acc, cat) => {
    const entries = vocab.filter((e) => e.category === cat);
    if (entries.length > 0) acc[cat] = entries;
    return acc;
  }, {});

  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>VOCABULARY</Text>

      {(Object.entries(grouped) as [WordCategory, DictEntry[]][]).map(
        ([cat, entries]) => (
          <View key={cat} style={styles.section}>
            <Text style={[styles.sectionLabel, { color: 'rgba(255,255,255,0.35)' }]}>
              {SECTION_LABEL[cat]}
            </Text>

            <View style={styles.chips}>
              {entries.map((entry) => {
                const gc = groupColor(entry.group);
                return (
                  <Pressable
                    key={entry.word}
                    style={[styles.chip, { borderColor: gc.border, backgroundColor: gc.darkBg }]}
                    onPress={() => onWordSelect(entry)}
                  >
                    <Ruby
                      text={entry.word}
                      reading={entry.reading}
                      textStyle={[styles.chipJa, { color: gc.darkLabel }]}
                      readingStyle={{ color: gc.darkLabel, opacity: 0.55 }}
                    />
                    <Text style={styles.chipEn}>{entry.translation}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#141821",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  panelTitle: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 10,
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 2,
    marginBottom: 14,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  sectionLabel: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  toggle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 9,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  chipJa: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 14,
  },
  chipEn: {
    fontFamily: "NotoSansJP_400Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.45)",
  },
});
