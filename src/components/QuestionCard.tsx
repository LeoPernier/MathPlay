// src/components/QuestionCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Question {
  a:            number;
  b:            number;
  userAnswer?:  string;
  correct?:     boolean;
  type:         'input' | 'multiple';
}

interface Props {
  question: Question;
}

export default function QuestionCard({ question }: Props) {
  const prompt = `${question.a} + ${question.b} = ?`;

  return (
    <View
      style={[
        styles.container,
        question.correct === true   && styles.correct,
        question.correct === false  && styles.incorrect,
      ]}
    >
      <Text style={styles.text}>{prompt}</Text>
      {question.userAnswer !== undefined && (
        <Text style={styles.feedback}>
          Your answer: {question.userAnswer} {question.correct ? '✅' : '❌'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    width: '90%',
  },
  text: {
    fontSize: 26,
    fontWeight: '500',
    textAlign: 'center',
  },
  feedback: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 8,
  },
  correct: {
    borderColor: '#4caf50',
    borderWidth: 2,
  },
  incorrect: {
    borderColor: '#f44336',
    borderWidth: 2,
  },
});
