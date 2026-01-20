// src/navigation/MainNavigator.tsx

import React                          from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen                     from '../screens/HomeScreen';
import StatsScreen                    from '../screens/StatsScreen';
import GameScreen                     from '../screens/GameScreen';
import ChallengeModeScreen            from '../screens/ChallengeModeScreen';
import LearnModeScreen                from '../screens/LearnModeScreen';
import SettingsScreen                 from '../screens/SettingsScreen';
import TutorialScreen                 from '../screens/TutorialScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name = "Home"          component = {HomeScreen}            />
      <Stack.Screen name = "Stats"         component = {StatsScreen}           />
      <Stack.Screen name = "Game"          component = {GameScreen}            />
      <Stack.Screen name = "Challenge"     component = {ChallengeModeScreen}   />
      <Stack.Screen name = "Apprentissage" component = {LearnModeScreen}       />
      <Stack.Screen name = "Settings"      component = {SettingsScreen}        />
      <Stack.Screen name = "Tutorial"      component = {TutorialScreen}        />
    </Stack.Navigator>
  );
}
