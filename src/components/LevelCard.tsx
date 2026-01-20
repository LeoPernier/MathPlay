// src/components/LevelCard.tsx

import React, { useEffect, useState }               from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Ionicons                                     from '@expo/vector-icons/Ionicons';
import { firebaseAuth, firebaseDb }                 from '../firebase/FirebaseConfig';

interface Props {
  sectionTitle:   string;
  levelNumber:    number;
  totalQuestions: number;
  category:       string;
  onPress:        () => void;
}

export default function LevelCard({
  sectionTitle,
  levelNumber,
  totalQuestions,
  category,
  onPress,
}: Props) {
  const [states, setStates] = useState<(boolean | null)[]>(
    Array(totalQuestions).fill(null)
  );

  useEffect(() => {
    const user = firebaseAuth.currentUser;
    if (!user) return;

    const qRef = firebaseDb
      .collection('users')
      .doc(user.uid)
      .collection('learnProgress')
      .doc(sectionTitle)
      .collection('levels')
      .doc(String(levelNumber))
      .collection('questions');

    const unsubscribe = qRef.onSnapshot(snapshot => {
      const arr: (boolean | null)[] = Array(totalQuestions).fill(null);
      snapshot.forEach(doc => {
        const data = doc.data();
        const qId  = data.questionId;
        const idx  = parseInt(qId, 10) - 1;
        if (idx >= 0 && idx < totalQuestions) {
          arr[idx] = data.correct;
        }
      });
      setStates(arr);
    });

    return () => unsubscribe();
  }, [sectionTitle, levelNumber, totalQuestions]);

  const answeredCount = states.filter(v => v !== null).length;
  const pct           = Math.round((answeredCount / totalQuestions) * 100);
  const allCorrect    = answeredCount === totalQuestions && states.every(v => v === true);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.progressFill, { width: `${pct}%` }]} />

      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.level}>Level {levelNumber}</Text>
        <Text style={styles.category}>{category}</Text>

        <View style={styles.dotsContainer}>
          {states.map((v, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                v === true
                  ? styles.correct
                  : v === false
                  ? styles.wrong
                  : styles.inactive,
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>

      {allCorrect && (
        <Ionicons
          name="star"
          size={24}
          color="#FFD700"
          style={styles.star}
        />
      )}
    </View>
  );
}

const DOT_SIZE = 8;
const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(76,175,80,0.3)',
  },
  card: {
    padding: 16,
    alignItems: 'center',
  },
  level: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 8,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    margin: 2,
  },
  correct: {
    backgroundColor: '#4caf50',
  },
  wrong: {
    backgroundColor: '#f44336',
  },
  inactive: {
    backgroundColor: '#bdbdbd',
  },
  star: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
