// src/components/TutorialCard.tsx

import React                                        from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons }                                 from '@expo/vector-icons';

export default function TutorialCard({title, onPress}: {
  title:   string;
  onPress: () => void;
}) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons name="book-outline" size={24} color="#2196f3" />
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  card: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
  },
});
