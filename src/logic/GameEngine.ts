// src/logic/GameEngine.ts

import { LevelSettings }        from '../config/LevelSettings';
import { Question }             from '../config/GameTypes';
import { getQuestionsForLevel } from './QuestionFactory';

export interface LevelInstance {
  settings:  LevelSettings;
  questions: Question[];
}

export function createLevelInstance(settings: LevelSettings): LevelInstance {
  const questions = getQuestionsForLevel(settings);
  return { settings, questions };
}
