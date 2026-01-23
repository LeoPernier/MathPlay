// src/screens/SettingsScreen.tsx

import React, { useState }                                 from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firebaseAuth }                                    from '../firebase/FirebaseConfig';
import SvgIcon from '../components/SvgIcon';
import HomeButton                                          from '../components/HomeButton';

export default function SettingsScreen({ navigation }: any) {
  // TODO Ajoutez des parametres
  const signOut = async () => {
    try {
      await firebaseAuth.signOut();
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible de se déconnecter');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Paramètres</Text>
      <View style={styles.content}>
        

        {/* TODO Ajoutez des parametres */}

        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <SvgIcon name="signOut" size={20} color="#fff" />
          <Text style={styles.signOutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      <HomeButton
        color="#607d8b"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eceff1',
    justifyContent: 'space-between',  // TODO Lorsque du contenu sera ajouter, cette ligne devra probablement etre enlevee
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
    color: '#607d8b',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 18,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    padding: 14,
    borderRadius: 8,
    marginTop: 32,
    justifyContent: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
