import React from "react";
import { View, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import { DictEntry, groupColor } from "../utils/dictionary";
import { Ruby } from "./Ruby";

interface Props {
  entry: DictEntry | null;
  onClose: () => void;
}

export function WordPopup({ entry, onClose }: Props) {
  if (!entry) return null;

  const c = groupColor(entry.group);

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Pressable style={[styles.sheet, { borderTopColor: c.border }]} onPress={() => {}}>
        {/* Grabber */}
        <View style={styles.grabber} />

        {/* Category tag + close */}
        <View style={styles.header}>
          <View style={[styles.categoryTag, { backgroundColor: c.darkBg, borderColor: c.border }]}>
            <Text style={[styles.categoryTagText, { color: c.darkLabel }]}>
              {entry.group.toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* JP word — large */}
        <View style={styles.wordRow}>
          <Ruby
            text={entry.word}
            reading={entry.reading}
            textStyle={[styles.wordText, { color: c.darkLabel }]}
            readingStyle={styles.wordReading}
          />
        </View>

        {/* Reading in mono */}
        {entry.reading ? (
          <Text style={styles.kana}>{entry.reading}</Text>
        ) : null}

        {/* EN translation */}
        <Text style={styles.translation}>{entry.translation}</Text>

        {/* Action row */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtnOutline}>
            <Text style={styles.actionBtnOutlineText}>Save term</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtnFill, { backgroundColor: c.darkLabel }]}>
            <Text style={styles.actionBtnFillText}>See cards using →</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#0B0E14",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 38,
    borderTopWidth: 1,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignSelf: "center",
    marginBottom: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
    gap: 6,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: "rgba(244,244,245,0.62)",
    fontSize: 13,
  },
  wordRow: {
    marginBottom: 4,
  },
  wordText: {
    fontFamily: "NotoSansJP_700Bold",
    fontSize: 38,
    lineHeight: 46,
  },
  wordReading: {
    fontSize: 14,
    color: "rgba(244,244,245,0.38)",
  },
  kana: {
    fontSize: 13,
    color: "rgba(244,244,245,0.38)",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  translation: {
    fontSize: 17,
    color: "#F4F4F5",
    fontWeight: "500",
    fontFamily: "NotoSansJP_400Regular",
    marginBottom: 22,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtnOutline: {
    flex: 1,
    height: 46,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnOutlineText: {
    color: "#F4F4F5",
    fontSize: 14,
    fontWeight: "500",
  },
  actionBtnFill: {
    flex: 1,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnFillText: {
    color: "#0B0E14",
    fontSize: 14,
    fontWeight: "600",
  },
});
