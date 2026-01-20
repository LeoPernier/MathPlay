// src/components/Slider.tsx

import React, { useState }                                         from 'react';
import { View, PanResponder, StyleSheet, Text, LayoutChangeEvent } from 'react-native';

interface SliderProps {
  value:         number;
  onValueChange: (v: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?:         number;
  disabled?:     boolean;
}

const THUMB_SIZE = 32;

const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step         = 1,
  disabled     = false,
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);

  const getXForValue = (v: number) => {
    if (maximumValue === minimumValue) return 0;
    return ((v - minimumValue) / (maximumValue - minimumValue)) * (sliderWidth - THUMB_SIZE);
  };

  const getValueForX = (x: number) => {
    if (sliderWidth - THUMB_SIZE === 0) return minimumValue;
    let ratio   = Math.max(0, Math.min(1, x / (sliderWidth - THUMB_SIZE)));
    let raw     = minimumValue + ratio * (maximumValue - minimumValue);
    let stepped = Math.round(raw / step) * step;
    return Math.max(minimumValue, Math.min(maximumValue, stepped));
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    setSliderWidth(e.nativeEvent.layout.width);
  };

  const thumbX = getXForValue(value);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onMoveShouldSetPanResponder:  () => !disabled,
    onPanResponderMove: (evt, gestureState) => {
      let x = thumbX + gestureState.dx;
      onValueChange(getValueForX(x));
    },
    onPanResponderRelease:            () => {},
    onPanResponderTerminationRequest: () => false,
  });

  return (
    <View
      style={[styles.container, disabled && { opacity: 0.5 }]}
      onLayout={handleLayout}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      <View style={styles.track} />
      <View style={[styles.filled, { width: thumbX + THUMB_SIZE / 2 }]} />
      <View
        style={[styles.thumbHit, { left: thumbX }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.thumb}>
          <Text style={styles.valueText}>{value}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: THUMB_SIZE + 16,
    justifyContent: 'center',
    marginVertical: 12,
  },
  track: {
    position: 'absolute',
    left: THUMB_SIZE / 2,
    right: THUMB_SIZE / 2,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  filled: {
    position: 'absolute',
    left: THUMB_SIZE / 2,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff9800',
  },
  thumbHit: {
    position: 'absolute',
    top: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE + 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#ff9800',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  valueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default Slider;
