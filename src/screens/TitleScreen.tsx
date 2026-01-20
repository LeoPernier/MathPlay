// src/screens/TitleScreen.tsx

import React                                        from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons }                                 from '@expo/vector-icons';

export default function TitleScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur MathPlay!</Text>

      <TouchableOpacity
        style={[styles.button, styles.signIn]}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Ionicons name="log-in-outline" size={24} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.signUp]}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Ionicons name="person-add-outline" size={24} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffbf0',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    width: '70%',
    paddingVertical: 14,
    borderRadius: 24,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  signIn: {
    backgroundColor: '#2196f3',
  },
  signUp: {
    backgroundColor: '#4caf50',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
});
