import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { extractVocab, DictEntry, WordCategory } from "../utils/dictionary";
import { Ruby } from "./Ruby";

interface Props {
  text: string;
  onWordSelect: (entry: DictEntry) => void;
}

const CATEGORY_ORDER: WordCategory[] = ["keyword", "action", "noun", "grammar"];

const SECTION_LABEL: Record<WordCategory, string> = {
  keyword: "Keywords",
  action: "Actions",
  noun: "Game Terms",
  grammar: "Grammar",
};

const CHIP_STYLE: Record<
  WordCategory,
  { border: string; bg: string; label: string }
> = {
  keyword: { border: "#C69320", bg: "rgba(198,147,32,0.13)", label: "#E8B630" },
  action: { border: "#B83A28", bg: "rgba(184,58,40,0.1)", label: "#E05540" },
  noun: { border: "#2460A0", bg: "rgba(36,96,160,0.1)", label: "#4B8ED4" },
  grammar: { border: "#4A5562", bg: "rgba(74,85,98,0.1)", label: "#8090A0" },
};

export function VocabPanel({ text, onWordSelect }: Props) {
  const [grammarOpen, setGrammarOpen] = useState(false);

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
        ([cat, entries]) => {
          const s = CHIP_STYLE[cat];

          return (
            <View key={cat} style={styles.section}>
              <Text style={[styles.sectionLabel, { color: s.label }]}>
                {SECTION_LABEL[cat]}
              </Text>

              <View style={styles.chips}>
                {entries.map((entry) => (
                  <Pressable
                    key={entry.word}
                    style={[
                      styles.chip,
                      { borderColor: s.border, backgroundColor: s.bg },
                    ]}
                    onPress={() => onWordSelect(entry)}
                  >
                    <Ruby
                      text={entry.word}
                      reading={entry.reading}
                      textStyle={[styles.chipJa, { color: s.label }]}
                      readingStyle={{ color: s.label, opacity: 0.55 }}
                    />
                    <Text style={styles.chipEn}>{entry.translation}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          );
        },
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
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
