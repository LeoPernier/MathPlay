// src/config/GameTypes.ts

export type Operation = '+' | '-' | '*' | '/' | '%';

export interface Question {
  id: string;
  questionText: string;
  answer: string;
  type: 'input' | 'multiple';
  options?: string[];
}
