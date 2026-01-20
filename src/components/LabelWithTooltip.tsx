// src/components/LabelWithTooltip.tsx

import React                      from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TooltipIcon                from './TooltipIcon';

interface Props {
  label:       string;
  tooltip:     string;
  size?:       number;
  style?:      any;
  labelStyle?: any;
}

const LabelWithTooltip: React.FC<Props> = ({ label, tooltip, size = 22, style, labelStyle }) => (
  <View style={[styles.row, style]}>
    <Text style={[styles.label, labelStyle]}>{label}</Text>
    <TooltipIcon text={tooltip} size={size} />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ff9800',
    textAlign: 'left',
    marginRight: 5,
  },
});

export default LabelWithTooltip;
