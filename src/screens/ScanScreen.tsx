import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Platform,
  PermissionsAndroid,
  AppState,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { recognizeCardName } from '../utils/ocr';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Scan'>;

const { width: SCREEN_W } = Dimensions.get('window');
const GUIDE_W = SCREEN_W * 0.82;
const GUIDE_H = GUIDE_W * (7 / 5);

export function ScanScreen({ navigation }: { navigation: Nav }) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [processing, setProcessing] = useState(false);

  // When returning from system Settings, sync expo-camera's permission state
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') requestPermission();
    });
    return () => sub.remove();
  }, []);

  const handleAllow = async () => {
    if (Platform.OS === 'android') {
      // expo-camera's requestPermission can silently fail on some Android versions;
      // use PermissionsAndroid directly to surface the system dialog, then sync back
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      await requestPermission();
    } else {
      await requestPermission();
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current || processing) return;
    setProcessing(true);
    try {
      // skipProcessing keeps the raw sensor data; rotation is in EXIF which Vision respects.
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      // The card name occupies the top ~10% of the card, and the card is vertically
      // centred in the guide frame (~25–35% from the top of the photo). Cropping to
      // the top 40% of the image keeps the name strip and nothing below the type line.
      const nameStrip = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ crop: { originX: 0, originY: 0, width: photo.width, height: Math.floor(photo.height * 0.4) } }],
        { base64: true, compress: 0.9, format: ImageManipulator.SaveFormat.JPEG },
      );

      const name = await recognizeCardName(nameStrip.base64!);
      if (!name) {
        Alert.alert(
          'Not recognized',
          'Could not read the card name. Try better lighting or hold the camera steady.',
        );
        return;
      }
      navigation.navigate('Search', { scanResult: name });
    } catch {
      Alert.alert('Error', 'Something went wrong scanning the card.');
    } finally {
      setProcessing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera access is required to scan cards.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={handleAllow}>
          <Text style={styles.permissionBtnText}>Allow Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.permissionBtn, styles.settingsBtn]}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.permissionBtnText}>Open App Settings</Text>
        </TouchableOpacity>
        <Text style={styles.permissionHint}>
          If "Allow Camera" shows no dialog, tap "Open App Settings" and enable camera there.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.dimTop} />
        <View style={styles.guideRow}>
          <View style={styles.dimSide} />
          <View style={styles.guide} />
          <View style={styles.dimSide} />
        </View>
        <View style={styles.dimBottom} />
      </View>

      <Text style={styles.label} pointerEvents="none">
        Align card within the frame
      </Text>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.captureBtn, processing && styles.captureBtnBusy]}
          onPress={handleCapture}
          disabled={processing}
          activeOpacity={0.8}
        >
          {processing
            ? <ActivityIndicator color="#333" size="small" />
            : <View style={styles.captureBtnInner} />
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionBtn: {
    backgroundColor: '#2b5797',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  settingsBtn: {
    backgroundColor: '#444',
  },
  permissionBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  permissionHint: {
    marginTop: 16,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
  },
  dimTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  guideRow: {
    flexDirection: 'row',
    height: GUIDE_H,
  },
  dimSide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  guide: {
    width: GUIDE_W,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    borderRadius: 10,
  },
  dimBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  label: {
    position: 'absolute',
    bottom: 136,
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 44,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnBusy: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  captureBtnInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#333',
  },
});
