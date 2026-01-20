// src/components/HomeButton.tsx

import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface Props {
  color: string
  onPress: () => void
}

export default function HomeButton({ color, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="home" size={24} color={color} style={styles.icon} />
      <Text style={[styles.text, { color }]}>{'Retour à l’accueil'}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 16,
    minHeight: 56,
    borderRadius: 24,
    elevation: 2,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
})
