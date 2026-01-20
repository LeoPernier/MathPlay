// src/components/TooltipIcon.tsx

import React, { useState }                   from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons }                          from '@expo/vector-icons';

interface TooltipIconProps {
  text:        string;
  size?:       number;
  bubbleSide?: 'right' | 'left';
}

const TooltipIcon: React.FC<TooltipIconProps> = ({
  text,
  size       = 22,
  bubbleSide = 'right',
}) => {
  const [show, setShow] = useState(false);

  const handlePress = () => setShow((v) => !v);

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.icon,
          {
            width: size + 6,
            height: size + 6,
            borderRadius: (size + 6) / 2,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
        accessibilityLabel="Show tooltip"
      >
        <Ionicons
          name="help-circle-outline"
          size={size}
          color="#fff"
          style={{ alignSelf: 'center' }}
        />
      </Pressable>
      {show && (
        <View
          style={[
            styles.bubbleContainer,
            bubbleSide === 'right'
              ? { left: size + 12, flexDirection: 'row' }
              : { right: size + 12, flexDirection: 'row-reverse' },
          ]}
        >
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{text}</Text>
            <View
              style={[
                styles.arrow,
                bubbleSide === 'right'
                  ? {
                      left: -10,
                      borderRightColor: '#333',
                      borderLeftColor: 'transparent',
                    }
                  : {
                      right: -10,
                      borderLeftColor: '#333',
                      borderRightColor: 'transparent',
                    },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    backgroundColor: '#ff9800',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    elevation: 2,
    shadowColor: '#ff9800',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 2,
  },
  bubbleContainer: {
    position: 'absolute',
    top: '50%',
    zIndex: 9999,
    transform: [{ translateY: -24 }],
  },
  bubble: {
    backgroundColor: '#333',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 18,
    minWidth: 120,
    maxWidth: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 7,
  },
  bubbleText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 21,
  },
  arrow: {
    position: 'absolute',
    top: 17,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftWidth: 10,
    borderRightWidth: 10,
  },
});

export default TooltipIcon;
