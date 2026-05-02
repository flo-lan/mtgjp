import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchScreen } from './src/screens/SearchScreen';
import { CardScreen } from './src/screens/CardScreen';

export type RootStackParamList = {
  Search: undefined;
  Card: { set: string; collectorNumber: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Search">
        <Stack.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ title: 'MTG Japanese Learner' }} 
        />
        <Stack.Screen 
          name="Card" 
          component={CardScreen} 
          options={{ title: 'Card Details' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
