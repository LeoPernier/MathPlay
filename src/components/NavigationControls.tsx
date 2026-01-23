// src/components/NavigationControls.tsx

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import SvgIcon from './SvgIcon'

interface NavigationControlsProps {
  onPrev:      () => void;
  onNext:      () => void;
  canPrev:     boolean;
  canNext:     boolean;
  accentColor: string;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({onPrev, onNext, canPrev, canNext, accentColor}) => (
  <View style={styles.container}>
    <TouchableOpacity
      onPress={onPrev}
      disabled={!canPrev}
      style={[
        styles.btn,
        { backgroundColor: canPrev ? accentColor : '#eee' },
        !canPrev && styles.disabled,
      ]}
      activeOpacity={canPrev ? 0.8 : 1}
    >
      <View style={styles.btnContent}>
        <SvgIcon name="chevronLeft" size={24} color={canPrev ? '#fff' : '#bbb'} style={styles.icon} />
        <Text style={[styles.btnText, { color: canPrev ? '#fff' : '#bbb' }]}>
          Prev
        </Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={onNext}
      disabled={!canNext}
      style={[
        styles.btn,
        { backgroundColor: canNext ? accentColor : '#eee' },
        !canNext && styles.disabled,
      ]}
      activeOpacity={canNext ? 0.8 : 1}
    >
      <View style={styles.btnContent}>
        <Text style={[styles.btnText, { color: canNext ? '#fff' : '#bbb' }]}>
          Next
        </Text>
        <SvgIcon name="chevronRight" size={24} color={canNext ? '#fff' : '#bbb'} style={styles.icon} />
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '75%',
    marginBottom: 36,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  btn: {
    flex:           1,
    marginHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 4,
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  disabled: {
    borderColor: '#ddd',
  },
});
