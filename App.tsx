// App.tsx

import React, { useEffect, useState }        from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';
import { StatusBar }                         from 'react-native';
import { NavigationContainer }               from '@react-navigation/native';
import * as NavigationBar                    from 'expo-navigation-bar';
import auth, { FirebaseAuthTypes }           from '@react-native-firebase/auth';
import AuthNavigator                         from './src/navigation/AuthNavigator';
import MainNavigator                         from './src/navigation/MainNavigator';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // On ecoute pour les changements d'authentification
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(u => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  useEffect(() => {
    // Pour Android: On cache la barre de navigation
    if (Platform.OS === 'android') {
      (async () => {
        // On cache la barre de navigation et la barre de status par defaut, on les revelent avec un swipe
        await NavigationBar.setBehaviorAsync('overlay-swipe');
        await NavigationBar.setVisibilityAsync('hidden');
      })();
    }
  }, []);

  if (initializing) {
    // On affiche un "spinner" lors de la decision d'authentification
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar hidden />

      <NavigationContainer>
        {user
          ? <MainNavigator />  // Deja connecte, on va directement a l'accueil
          : <AuthNavigator />  // Premiere fois/Non connecte, on va a la page titre
        }
      </NavigationContainer>
    </>
  );
}
