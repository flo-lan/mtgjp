import * as React from 'react';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { Platform, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SearchScreen } from './src/screens/SearchScreen';
import { CardScreen } from './src/screens/CardScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { StudySetScreen } from './src/screens/StudySetScreen';
import { StudyScreen } from './src/screens/StudyScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { StudyProvider, useStudy } from './src/context/StudyContext';

export type RootStackParamList = {
  Search: { scanResult?: string; searchQuery?: string } | undefined;
  Card: { set: string; collectorNumber: string };
  Scan: undefined;
  StudySet: { group: string };
};

export type FavoritesStackParamList = {
  FavoritesHome: undefined;
  Card: { set: string; collectorNumber: string };
};

type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Study: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const FavStack = createNativeStackNavigator<FavoritesStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function HomeNavigator() {
  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Card"
        component={CardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Scan"
        component={ScanScreen}
        options={{ title: 'Scan Card', headerTransparent: true, headerTintColor: '#fff' }}
      />
      <Stack.Screen
        name="StudySet"
        component={StudySetScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function FavoritesNavigator() {
  return (
    <FavStack.Navigator>
      <FavStack.Screen name="FavoritesHome" component={FavoritesScreen} options={{ headerShown: false }} />
      <FavStack.Screen name="Card" component={CardScreen} options={{ headerShown: false }} />
    </FavStack.Navigator>
  );
}

function AppTabs() {
  const { dueCards } = useStudy();
  const dueCount = dueCards.length;

  useEffect(() => {
    if (Platform.OS === 'web') return;
    import('expo-notifications')
      .then(n => n.setBadgeCountAsync(dueCount))
      .catch(() => {});
  }, [dueCount]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0B0E14',
          borderTopColor: 'rgba(255,255,255,0.07)',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#E8B630',
        tabBarInactiveTintColor: 'rgba(244,244,245,0.38)',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>⌕</Text>,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesNavigator}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>♥</Text>,
        }}
      />
      <Tab.Screen
        name="Study"
        component={StudyScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>⬡</Text>,
          tabBarBadge: dueCount > 0 ? dueCount : undefined,
          tabBarBadgeStyle: { minWidth: 16, height: 16, borderRadius: 8, fontSize: 9, lineHeight: 16 },
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ NotoSansJP_400Regular, NotoSansJP_700Bold });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StudyProvider>
        <NavigationContainer>
          <AppTabs />
        </NavigationContainer>
      </StudyProvider>
    </SafeAreaProvider>
  );
}
