// src/components/BackButton.tsx

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Ionicons name="arrow-back" size={28} color="#222" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    top: 32,
    left: 18,
    zIndex: 200,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 6,
    elevation: 2,
  }
});
