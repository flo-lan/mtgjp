import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JA_DICT, SORTED_DICT_KEYS } from '../utils/dictionary';
import { Ruby } from './Ruby';

interface Props {
  text: string;
  textStyle?: any;
  readingStyle?: any;
  numberOfLines?: number;
}

const SPLIT_REGEX = new RegExp(`(${SORTED_DICT_KEYS.join('|')})`);

export function FuriganaText({ text, textStyle, readingStyle, numberOfLines }: Props) {
  if (!text) return null;

  const parts = text.split(SPLIT_REGEX).filter(Boolean);

  return (
    <View style={styles.row}>
      {parts.map((part, i) => {
        const entry = JA_DICT[part];
        if (entry?.reading) {
          return (
            <Ruby
              key={i}
              text={part}
              reading={entry.reading}
              textStyle={textStyle}
              readingStyle={readingStyle}
            />
          );
        }
        return (
          <Text key={i} style={textStyle} numberOfLines={i === 0 ? numberOfLines : undefined}>
            {part}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
});
