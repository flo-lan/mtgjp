import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Alert } from 'react-native';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { recognizeCardName } from '../utils/ocr';

// react-native-document-scanner-plugin is native-only.
// Lazy-require so missing native binary (Expo Go / web) degrades gracefully.
let DocumentScanner: any = null;
let ResponseType: { ImageFilePath: string } = { ImageFilePath: 'imageFilePath' };
try {
  const mod = require('react-native-document-scanner-plugin');
  DocumentScanner = mod.default;
  ResponseType = mod.ResponseType;
} catch {
  // Native build required
}

type Nav = NativeStackNavigationProp<RootStackParamList, 'Scan'>;

export function ScanScreen({ navigation }: { navigation: Nav }) {
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!DocumentScanner) {
      Alert.alert(
        'Native build required',
        'Card scanning needs a development build.\nRun: npx expo run:ios  or  npx expo run:android',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const { scannedImages, status } = await DocumentScanner.scanDocument({
          maxNumDocuments: 1,
          croppedImageQuality: 90,
          responseType: ResponseType.ImageFilePath,
        });

        if (cancelled) return;

        if (status === 'cancel' || !scannedImages?.length) {
          navigation.goBack();
          return;
        }

        setProcessing(true);

        const cardUri = scannedImages[0];

        const cardRef = await ImageManipulator.manipulate(cardUri).renderAsync();

        // The name strip is the top ~12% of the perspective-corrected card.
        const strippedRef = await ImageManipulator.manipulate(cardRef)
          .crop({ originX: 0, originY: 0, width: cardRef.width, height: Math.floor(cardRef.height * 0.12) })
          .resize({ width: cardRef.width * 2 })
          .renderAsync();
        const { uri } = await strippedRef.saveAsync({ format: SaveFormat.PNG });

        const name = await recognizeCardName(uri);
        if (!name) {
          Alert.alert('Not recognized', 'Could not read the card name. Try scanning again with better lighting.');
          navigation.goBack();
          return;
        }

        navigation.navigate('Search', { scanResult: name });
      } catch {
        if (!cancelled) {
          Alert.alert('Error', 'Something went wrong while scanning.');
          navigation.goBack();
        }
      } finally {
        if (!cancelled) setProcessing(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E8B86B" />
      {processing && <Text style={styles.label}>Reading card…</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    marginTop: 16,
  },
});
