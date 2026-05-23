import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FavoritesStackParamList } from '../../App';
import { loadFavorites, FavCard } from '../utils/favorites';

const TOP_PAD = Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight ?? 0) + 16;

type Props = {
  navigation: NativeStackNavigationProp<FavoritesStackParamList, 'FavoritesHome'>;
};

export function FavoritesScreen({ navigation }: Props) {
  const [favorites, setFavorites] = useState<FavCard[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites().then(setFavorites);
    }, []),
  );

  const openCard = (fav: FavCard) => {
    navigation.navigate('Card', { set: fav.set, collectorNumber: fav.collectorNumber });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: TOP_PAD }]}>
        <Text style={styles.title}>Favorites</Text>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={f => `${f.set}-${f.collectorNumber}`}
        contentContainerStyle={favorites.length === 0 ? styles.emptyContainer : styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => openCard(item)} activeOpacity={0.75}>
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.thumb} />
            ) : (
              <View style={[styles.thumb, styles.thumbPlaceholder]} />
            )}
            <View style={styles.info}>
              <Text style={styles.nameJp}>{item.printedName ?? item.name}</Text>
              <Text style={styles.nameEn}>{item.printedName ? item.name : ''}</Text>
              <Text style={styles.set}>{item.set.toUpperCase()} #{item.collectorNumber}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySub}>Tap ♡ on any card to save it here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0E14' },
  topBar: {
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F4F4F5',
    fontFamily: 'NotoSansJP_700Bold',
  },
  list: { padding: 16 },
  emptyContainer: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141821',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  thumb: { width: 80, height: 56 },
  thumbPlaceholder: { backgroundColor: 'rgba(255,255,255,0.06)' },
  info: { flex: 1, padding: 10, justifyContent: 'center' },
  nameJp: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F4F4F5',
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 2,
  },
  nameEn: {
    fontSize: 12,
    color: 'rgba(244,244,245,0.55)',
    fontFamily: 'NotoSansJP_400Regular',
    marginBottom: 2,
  },
  set: { fontSize: 11, color: 'rgba(244,244,245,0.38)' },
  arrow: { fontSize: 20, color: 'rgba(244,244,245,0.2)', paddingRight: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(244,244,245,0.45)',
    marginBottom: 10,
  },
  emptySub: {
    fontSize: 14,
    color: 'rgba(244,244,245,0.3)',
    textAlign: 'center',
  },
});
