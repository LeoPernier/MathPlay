// src/config/LevelSettings.ts

import { Question, Operation } from './GameTypes';

export type GameMode           = 'learn'  | 'challenge' | 'exploration' | string;
export type QuestionSourceType = 'manual' | 'generated';

export interface CompositeSettings {
  enabled:                boolean;
  minOperands:            number;
  maxOperands:            number;
  allowNegatives?:        boolean;
  requirePositiveResult?: boolean;
  operatorMix?:           Operation[];
  parentheses?:           boolean;
  allowDecimals?:         boolean;
}

export interface PerOpSettings {
  minOperand?:     number;
  maxOperand?:     number;
  allowDecimals?:  boolean;
  exactDivision?:  boolean;
  weight?:         number;
}

export interface ScoringRules {
  correct:      number;
  incorrect:    number;
  streakBonus?: number;
  timeBonus?:   number;
}

export interface LevelSettings {
  mode:                  GameMode;
  questionSource:        QuestionSourceType;
  questionsPerLevel:     number;
  allowedOperations:     Operation[];
  allowSkip:             boolean;
  allowNavigate:         boolean;
  timeLimitPerQuestion?: number;
  randomSeed?:           number;
  difficulty?:           'easy' | 'medium' | 'hard' | string;
  scoring?:              ScoringRules;
  theme?: {
    backgroundColor?:    string;
    primaryColor?:       string;
    accentColor?:        string;
  };
  minOperand?:           number;
  maxOperand?:           number;
  allowNegative?:        boolean;
  allowDecimals?:        boolean;
  allowDuplicates?:      boolean;
  customTitle?:          string;
  manualQuestions?:      Question[];
  perOpSettings?:        Partial<Record<Operation, PerOpSettings>>;
  compositeSettings?:    CompositeSettings;

  sectionTitle?:         string;
  levelNumber?:          number;
}
