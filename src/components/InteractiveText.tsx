import React, { useState } from 'react';
import { Text, StyleSheet, View, Modal, TouchableOpacity, Pressable } from 'react-native';
import { JA_DICT, SORTED_DICT_KEYS } from '../utils/dictionary';
import ManaSymbol from './native-mtg-card/ManaSymbol';

interface Props {
  text: string;
  style?: any;
}

export function InteractiveText({ text, style }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState({ word: '', translation: '' });

  if (!text) return null;

  const regexPattern = SORTED_DICT_KEYS.join('|');
  const regex = new RegExp(`(${regexPattern}|\\{[A-Za-z0-9/]+\\})`, 'g');

  const parts = text.split(regex);

  const handlePress = (word: string, translation: string) => {
    setSelectedWord({ word, translation });
    setModalVisible(true);
  };

  return (
    <View>
      <Text style={[styles.baseText, style]}>
        {parts.map((part, index) => {
          if (!part) return null;
          
          if (part.startsWith('{') && part.endsWith('}')) {
             return <ManaSymbol key={index} symbol={part.slice(1, -1)} size={16} margin={0} />;
          }

          if (JA_DICT[part]) {
            return (
              <Text 
                key={index} 
                style={styles.highlightedText} 
                onPress={() => handlePress(part, JA_DICT[part])}
              >
                {part}
              </Text>
            );
          }
          return <Text key={index}>{part}</Text>;
        })}
      </Text>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalWord}>{selectedWord.word}</Text>
            <Text style={styles.modalTranslation}>{selectedWord.translation}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  baseText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  highlightedText: {
    color: '#0066cc',
    fontWeight: 'bold',
    backgroundColor: '#e6f2ff', // subtle highlight background
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 200,
  },
  modalWord: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalTranslation: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2b5797',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
