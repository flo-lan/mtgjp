import React from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { JA_DICT, SORTED_DICT_KEYS, DictEntry, WordCategory, groupColor } from '../utils/dictionary';
import ManaSymbol from './native-mtg-card/ManaSymbol';
import { Ruby } from './Ruby';

interface Props {
  text: string;
  onWordSelect: (entry: DictEntry) => void;
  showFurigana?: boolean;
  fontSize?: number;
  dark?: boolean;
  style?: any;
}

const TOKEN_REGEX = new RegExp(
  `(${SORTED_DICT_KEYS.join('|')}|\\{[A-Za-z0-9/]+\\})`,
);

const INTERACTIVE_CATEGORIES = new Set<WordCategory>(['keyword', 'action', 'noun']);

export function InteractiveText({ text, onWordSelect, showFurigana = false, fontSize = 16, dark = false, style }: Props) {
  if (!text) return null;

  const lineHeight = Math.round(fontSize * 1.55);
  const baseColor = dark ? '#F4F4F5' : 'black';

  return (
    <View>
      {text.split('\n').map((line, lineIdx) => (
        <View key={lineIdx} style={styles.line}>
          {line.split(TOKEN_REGEX).map((part, i) => {
            if (!part) return null;

            if (part.startsWith('{') && part.endsWith('}')) {
              return (
                <View key={i} style={[styles.symbolWrapper, { height: lineHeight }]}>
                  <ManaSymbol symbol={part.slice(1, -1)} size={fontSize} margin={0} />
                </View>
              );
            }

            const entry = JA_DICT[part];
            if (entry && INTERACTIVE_CATEGORIES.has(entry.category)) {
              const gc = groupColor(entry.group);
              const bg = dark ? gc.darkBg : gc.lightBg;
              const fg = dark ? gc.darkLabel : gc.lightText;
              return (
                <Pressable
                  key={i}
                  style={{
                    backgroundColor: bg,
                    borderWidth: 1,
                    borderColor: gc.border,
                    borderRadius: 3,
                    paddingHorizontal: 3,
                    marginHorizontal: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => onWordSelect(entry)}
                >
                  <Ruby
                    text={part}
                    reading={showFurigana ? entry.reading : undefined}
                    textStyle={[{ fontFamily: 'NotoSansJP_400Regular', fontSize, lineHeight, color: fg }, style]}
                    readingStyle={{ color: fg, opacity: 0.55 }}
                  />
                </Pressable>
              );
            }

            return (
              <Text key={i} style={[{ fontFamily: 'NotoSansJP_400Regular', fontSize, lineHeight, color: baseColor }, style]}>
                {part}
              </Text>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    marginBottom: 1,
  },
  symbolWrapper: {
    alignSelf: 'flex-end',
    marginHorizontal: 1,
    justifyContent: 'flex-end',
  },
});
