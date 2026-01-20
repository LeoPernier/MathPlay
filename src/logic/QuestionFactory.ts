// src/logic/QuestionFactory.ts

import { LevelSettings }       from '../config/LevelSettings';
import { Question, Operation } from '../config/GameTypes';

// How it works: https://en.wikipedia.org/wiki/Lehmer_random_number_generator
function seededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function randInt(min: number, max: number, rand: () => number): number {
  let r = Math.floor(rand() * (max - min + 1)) + min;
  if (r < min) r = min;
  if (r > max) r = max;
  return r;
}

function evaluateExpression(expr: string): number {
  return eval(expr);
}

function decimalPlaces(n: number): number {
  const s = n.toString();
  return s.includes('.') ? s.split('.')[1].length : 0;
}

function simpleGen(count: number, settings: LevelSettings, rand: () => number): Question[] {
  const { perOpSettings = {}, allowedOperations } = settings;
  const qs: Question[] = [];

  for (let i = 0; i < count; i++) {
    const op: Operation = allowedOperations[Math.floor(rand() * allowedOperations.length)];
    const cfg = perOpSettings[op] ?? {
      minOperand:    1,
      maxOperand:    20,
      allowDecimals: false,
      exactDivision: true,
    };
    let a: number, b: number;
    if (op === '/' && cfg.exactDivision) {
      do {
        b = randInt(cfg.minOperand!, cfg.maxOperand!, rand);
        b = b === 0 ? 1 : b;
        a = b * randInt(cfg.minOperand!, cfg.maxOperand!, rand);
      } while (a === b);
    } else {
      a = randInt(cfg.minOperand!, cfg.maxOperand!, rand);
      b = randInt(cfg.minOperand!, cfg.maxOperand!, rand);
    }

    const expr = `${a} ${op} ${b}`;
    let answer: string;
    switch (op) {
      case '+':
        answer = (a + b).toString();
        break;
      case '-':
        answer = (a - b).toString();
        break;
      case '*':
        answer = (a * b).toString();
        break;
      case '/':
        const raw = a / (b === 0 ? 1 : b);
        answer    = cfg.allowDecimals ? raw.toFixed(2) : Math.floor(raw).toString();
        break;
      case '%':
        answer = (a % (b === 0 ? 1 : b)).toString();
        break
      default: answer = '?';
    }
    qs.push({ id: `simple-${Date.now()}-${i}`, questionText: `${expr} = ?`, answer, type: 'input' });
  }
  return qs;
}

function compositeGen(count: number, settings: LevelSettings, rand: () => number): Question[] {
  const cfg = settings.compositeSettings!;
  const { perOpSettings = {} } = settings;
  const qs: Question[] = [];

  for (let i = 0; i < count; i++) {
    let expr: string, result: number;

    do {
      const terms: number[] = [];
      const ops:   Operation[] = [];
      const nTerms = randInt(cfg.minOperands, cfg.maxOperands, rand);

      for (let t = 0; t < nTerms; t++) {
        if (t > 0) ops.push( cfg.operatorMix![Math.floor(rand() * cfg.operatorMix!.length)] );
        const useOp = t === 0 ? cfg.operatorMix![0] : ops[t - 1];
        const pCfg  = perOpSettings[useOp] ?? { minOperand:1, maxOperand:10, allowDecimals:false };

        let val = randInt(pCfg.minOperand!, pCfg.maxOperand!, rand);
        if (cfg.allowNegatives && rand() < 0.3) val = -val;
        terms.push(val);
      }

      expr = `${terms[0]}`;
      ops.forEach((o,j) => expr += ` ${o} ${terms[j+1]}`);

      if (cfg.parentheses && nTerms >= 3 && rand() < 0.5) {
        const end = randInt(1, nTerms-1, rand);
        const sub = terms.slice(0, end+1).reduce((e,v,idx)=> idx===0?`${v}`:`${e} ${ops[idx-1]} ${v}`,'');
        expr      = `(${sub})` + expr.slice(sub.length);
      }
      result = evaluateExpression(expr);
    } while (
      // Toutes les exceptions de formules a rejeter
      (cfg.requirePositiveResult && result < 0)         ||
      (!cfg.allowDecimals && !Number.isInteger(result)) ||
      (cfg.allowDecimals  && decimalPlaces(result) > 2)  ||
      (cfg.allowDecimals  && Math.abs(result) < 0.01)    ||
      /\b(\d+)\s*\/\s*\1\b/.test(expr)
    );

    const answer = cfg.allowDecimals
      ? result.toFixed(2)
      : result.toString();

    qs.push({
      id:           `comp-${Date.now()}-${i}`,
      questionText: `${expr} = ?`,
      answer,
      type:         'input',
    });
  }

  return qs;
}

export function generateQuestions(settings: LevelSettings): Question[] {
  const { questionsPerLevel, questionSource, compositeSettings, randomSeed } = settings;
  let rand = Math.random;
  if (randomSeed !== undefined) rand = seededRandom(randomSeed);

  if (questionSource === 'manual') {
    if (!settings.manualQuestions)
      throw new Error('Erreur: "manualQuestions" est necessaire pour le mode manuel!');
    return settings.manualQuestions.slice(0, questionsPerLevel);
  }

  return compositeSettings?.enabled
    ? compositeGen(questionsPerLevel, settings, rand)
    : simpleGen(questionsPerLevel,    settings, rand);
}

export function getQuestionsForLevel(settings: LevelSettings): Question[] {
  return generateQuestions(settings);
}
