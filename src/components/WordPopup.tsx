import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { DictEntry, WordCategory } from "../utils/dictionary";

interface Props {
  entry: DictEntry | null;
  onClose: () => void;
}

const CATEGORY_LABEL: Record<WordCategory, string> = {
  keyword: "Keyword",
  action: "Action",
  noun: "Game Term",
};

const CATEGORY_COLOR: Record<WordCategory, string> = {
  keyword: "#C69320",
  action: "#C44028",
  noun: "#2B6CB0",
};

export function WordPopup({ entry, onClose }: Props) {
  if (!entry) return null;

  const color = CATEGORY_COLOR[entry.category];

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      {/* Inner pressable stops taps on the panel from closing it */}
      <Pressable style={styles.panel} onPress={() => {}}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>
              {CATEGORY_LABEL[entry.category]}
            </Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={16}>
            <Text style={styles.closeBtnText}>✕</Text>
          </Pressable>
        </View>

        <Text style={styles.word}>{entry.word}</Text>
        <Text style={styles.translation}>{entry.translation}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  panel: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 36,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 11,
    color: "#fff",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },
  word: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 36,
    color: "#fff",
    marginBottom: 6,
  },
  translation: {
    fontFamily: "NotoSansJP_400Regular",
    fontSize: 19,
    color: "rgba(255,255,255,0.55)",
  },
});
