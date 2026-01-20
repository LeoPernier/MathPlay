// src/navigation/AuthNavigator.tsx

import React                          from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TitleScreen                    from '../screens/TitleScreen';
import SignInScreen                   from '../screens/SignInScreen';
import SignUpScreen                   from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name = "Title"  component = {TitleScreen}  />
      <Stack.Screen name = "SignIn" component = {SignInScreen} />
      <Stack.Screen name = "SignUp" component = {SignUpScreen} />
    </Stack.Navigator>
  );
}
