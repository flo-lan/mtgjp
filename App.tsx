import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { SearchScreen } from './src/screens/SearchScreen';
import { CardScreen } from './src/screens/CardScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { StudySetScreen } from './src/screens/StudySetScreen';

export type RootStackParamList = {
  Search: { scanResult?: string } | undefined;
  Card: { set: string; collectorNumber: string };
  Scan: undefined;
  StudySet: { group: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({ NotoSansJP_400Regular, NotoSansJP_700Bold });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}
