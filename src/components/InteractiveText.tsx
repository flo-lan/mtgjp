import React from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { JA_DICT, SORTED_DICT_KEYS, DictEntry, WordCategory } from '../utils/dictionary';
import ManaSymbol from './native-mtg-card/ManaSymbol';

interface Props {
  text: string;
  onWordSelect: (entry: DictEntry) => void;
  style?: any;
}

const TOKEN_REGEX = new RegExp(
  `(${SORTED_DICT_KEYS.join('|')}|\\{[A-Za-z0-9/]+\\})`,
);

// Grammar particles are not visually marked — they appear too frequently
// and clutter the text. They remain accessible via the VocabPanel.
const INTERACTIVE_CATEGORIES = new Set<WordCategory>(['keyword', 'action', 'noun']);

const chipStyle: Record<'keyword' | 'action' | 'noun', any> = {
  keyword: {
    backgroundColor: 'rgba(175,128,18,0.17)',
    borderWidth: 1,
    borderColor: '#8B6018',
    borderRadius: 3,
    paddingHorizontal: 3,
    marginHorizontal: 1,
    justifyContent: 'center',
  },
  action: {
    backgroundColor: 'rgba(0,0,0,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.28)',
    borderRadius: 2,
    paddingHorizontal: 2,
    marginHorizontal: 1,
    justifyContent: 'center',
  },
  noun: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.16)',
    borderRadius: 2,
    paddingHorizontal: 2,
    marginHorizontal: 1,
    justifyContent: 'center',
  },
};

export function InteractiveText({ text, onWordSelect, style }: Props) {
  if (!text) return null;

  return (
    <View>
      {text.split('\n').map((line, lineIdx) => (
        <View key={lineIdx} style={styles.line}>
          {line.split(TOKEN_REGEX).map((part, i) => {
            if (!part) return null;

            if (part.startsWith('{') && part.endsWith('}')) {
              return (
                <View key={i} style={styles.symbolWrapper}>
                  <ManaSymbol symbol={part.slice(1, -1)} size={16} margin={0} />
                </View>
              );
            }

            const entry = JA_DICT[part];
            if (entry && INTERACTIVE_CATEGORIES.has(entry.category)) {
              const isKeyword = entry.category === 'keyword';
              return (
                <Pressable
                  key={i}
                  style={chipStyle[entry.category as 'keyword' | 'action' | 'noun']}
                  onPress={() => onWordSelect(entry)}
                >
                  <Text style={[styles.baseText, isKeyword && styles.keywordText, style]}>
                    {part}
                  </Text>
                </Pressable>
              );
            }

            return <Text key={i} style={[styles.baseText, style]}>{part}</Text>;
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
    alignItems: 'center',
    marginBottom: 1,
  },
  symbolWrapper: {
    alignSelf: 'center',
    marginHorizontal: 1,
  },
  baseText: {
    fontFamily: 'NotoSansJP_400Regular',
    fontSize: 16,
    color: 'black',
    lineHeight: 22,
  },
  keywordText: {
    fontFamily: 'NotoSansJP_700Bold',
    color: '#4A2800',
  },
});
