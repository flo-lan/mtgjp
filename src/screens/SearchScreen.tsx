import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Image
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { searchCards, CardData } from '../utils/scryfall';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

export function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    // Add lang:ja if user searches in Japanese or if we want to ensure JA support,
    // actually just search by name normally. We'll fetch the JA version on the next screen.
    const cards = await searchCards(query);
    setResults(cards);
    setLoading(false);
  };

  const renderItem = ({ item }: { item: CardData }) => {
    return (
      <TouchableOpacity 
        style={styles.cardItem} 
        onPress={() => navigation.navigate('Card', { 
          set: item.set, 
          collectorNumber: item.collector_number 
        })}
      >
        {item.image_uris?.art_crop && (
          <Image source={{ uri: item.image_uris.art_crop }} style={styles.thumbnail} />
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.printed_name || item.name}</Text>
          <Text style={styles.cardType}>{item.printed_type_line || item.type_line}</Text>
          <Text style={styles.cardSet}>{item.set.toUpperCase()} #{item.collector_number}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search card name (English or Japanese)..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            !loading && query ? (
              <Text style={styles.emptyText}>No results found or search not executed yet.</Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: '#fafafa',
  },
  searchButton: {
    backgroundColor: '#2b5797',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loader: {
    marginTop: 32,
  },
  list: {
    padding: 16,
  },
  cardItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  thumbnail: {
    width: 80,
    height: 80,
    backgroundColor: '#ddd',
  },
  cardInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardSet: {
    fontSize: 10,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
  }
});
