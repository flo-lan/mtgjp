import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  text: string;
  reading?: string;
  textStyle?: any;
  readingStyle?: any;
}

export function Ruby({ text, reading, textStyle, readingStyle }: Props) {
  if (!reading) return <Text style={textStyle}>{text}</Text>;

  return (
    <View style={styles.container}>
      <Text style={[styles.reading, readingStyle]} numberOfLines={1}>
        {reading}
      </Text>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  reading: {
    fontFamily: 'NotoSansJP_400Regular',
    fontSize: 11,
    color: 'rgba(0,0,0,0.45)',
  },
});
