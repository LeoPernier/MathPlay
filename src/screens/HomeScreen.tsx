// src/screens/HomeScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>MathPlay</Text>

      <TouchableOpacity
        style={[styles.card, styles.learning]}
        onPress={() => navigation.navigate('Apprentissage')}
      >
        <Ionicons name="book" size={28} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Apprentissage</Text>
          <Text style={styles.cardSubtitle}>Progression & Feedback</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.challenge]}
        onPress={() => navigation.navigate('Challenge')}
      >
        <Ionicons name="trophy" size={28} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Défi</Text>
          <Text style={styles.cardSubtitle}>Points & Compétition</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.stats]}
        onPress={() => navigation.navigate('Stats')}
      >
        <Ionicons name="stats-chart" size={28} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Statistiques</Text>
          <Text style={styles.cardSubtitle}>Vos progrès</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.settings]}
        onPress={() => navigation.navigate('Settings')}
      >
        <Ionicons name="settings-outline" size={28} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Paramètres</Text>
          <Text style={styles.cardSubtitle}>Réglages</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 3,
  },
  icon: {
    marginRight: 16,
    color: '#ffffff',
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 4,
  },
  exploration: {
    backgroundColor: '#4caf50',
  },
  challenge: {
    backgroundColor: '#ff9800',
  },
  learning: {
    backgroundColor: '#2196f3',
  },
  stats: {
    backgroundColor: '#9c27b0',
  },
  settings: {
    backgroundColor: '#607d8b',
  },
});
