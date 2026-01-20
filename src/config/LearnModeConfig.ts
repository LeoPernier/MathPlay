// src/config/LearnModeConfig.ts

import { Operation, Question } from './GameTypes';

export interface LearnLevel {
  level:      number;
  title:      string;
  questions:  Question[];
  operations: Operation[];
}

export interface LearnSection {
  title:     string;
  levels:    LearnLevel[];
  tutorial?: {
    id:      string;
    title:   string;
    content: string[];
  };
}

export const learnSections: LearnSection[] = [
  {
    title: 'Addition',
    tutorial: {
      id:      'addition-tutoriel',
      title:   'Pourquoi apprendre l’addition ?',
      content: [
        'L’addition, c’est la base des maths ! On additionne pour savoir combien on a en tout, quand on réunit des objets ou des nombres.',
        'Par exemple, si tu as 2 bonbons et que tu en trouves 3 de plus, tu en as 2 + 3 = 5.',
        'Essaie d’imaginer des objets, des fruits ou tes jouets, et additionne-les pour t’entraîner !'
      ]
    },
    levels: [
      {
        level: 1,
        title: 'Additionne jusqu’à 5',
        operations: ['+'],
        questions: [
          { id: '1', questionText: '2 + 2 = ?', answer: '4', type: 'input' },
          { id: '2', questionText: '1 + 3 = ?', answer: '4', type: 'multiple', options: ['3', '4', '5', '2'] },
          { id: '3', questionText: '0 + 5 = ?', answer: '5', type: 'input' },
        ],
      },
      {
        level: 2,
        title: 'Additionne jusqu’à 10',
        operations: ['+'],
        questions: [
          { id: '1', questionText: '6 + 3 = ?', answer: '9',  type: 'multiple', options: ['7', '8', '9', '10'] },
          { id: '2', questionText: '4 + 5 = ?', answer: '9',  type: 'input' },
          { id: '3', questionText: '2 + 6 = ?', answer: '8',  type: 'multiple', options: ['6', '7', '8', '9'] },
          { id: '4', questionText: '5 + 2 = ?', answer: '7',  type: 'input' },
        ],
      },
      {
        level: 3,
        title: 'Des nombres un peu plus grands',
        operations: ['+'],
        questions: [
          { id: '1', questionText: '8 + 7 = ?',  answer: '15', type: 'input' },
          { id: '2', questionText: '12 + 3 = ?', answer: '15', type: 'multiple', options: ['14', '16', '15', '13'] },
          { id: '3', questionText: '11 + 4 = ?', answer: '15', type: 'input' },
          { id: '4', questionText: '9 + 6 = ?',  answer: '15', type: 'multiple', options: ['14', '15', '16', '13'] },
          { id: '5', questionText: '10 + 5 = ?', answer: '15', type: 'input' },
        ],
      },
      {
        level: 4,
        title: 'Problèmes d’addition (mise en situation)',
        operations: ['+'],
        questions: [
          { id: '1', questionText: 'Tu as 2 pommes. On t’en donne 4 de plus. Combien as-tu de pommes ?',      answer: '6',  type: 'input' },
          { id: '2', questionText: 'Sarah a 3 petites voitures et en reçoit 2 autres. Combien en a-t-elle ?', answer: '5',  type: 'multiple', options: ['4', '5', '6', '3'] },
          { id: '3', questionText: 'Il y a 5 ballons rouges et 3 bleus. Combien de ballons en tout ?',        answer: '8',  type: 'input' },
          { id: '4', questionText: 'Tu lis 7 pages lundi et 5 mardi. Combien de pages en tout ?',             answer: '12', type: 'multiple', options: ['11', '12', '13', '10'] },
        ],
      },
      {
        level: 5,
        title: 'Addition et nombres à deux chiffres',
        operations: ['+'],
        questions: [
          { id: '1', questionText: '18 + 7 = ?',  answer: '25', type: 'input' },
          { id: '2', questionText: '23 + 6 = ?',  answer: '29', type: 'multiple', options: ['28', '29', '27', '30'] },
          { id: '3', questionText: '15 + 15 = ?', answer: '30', type: 'input' },
          { id: '4', questionText: '17 + 12 = ?', answer: '29', type: 'multiple', options: ['28', '29', '27', '30'] },
          { id: '5', questionText: '20 + 8 = ?',  answer: '28', type: 'input' },
          { id: '6', questionText: '11 + 19 = ?', answer: '30', type: 'multiple', options: ['30', '28', '31', '29'] },
        ],
      },
      {
        level: 6,
        title: 'Addition de trois nombres',
        operations: ['+'],
        questions: [
          { id: '1', questionText: '3 + 2 + 4 = ?', answer: '9',  type: 'input' },
          { id: '2', questionText: '1 + 5 + 2 = ?', answer: '8',  type: 'input' },
          { id: '3', questionText: '2 + 3 + 6 = ?', answer: '11', type: 'multiple', options: ['9', '10', '11', '12'] },
          { id: '4', questionText: '5 + 5 + 5 = ?', answer: '15', type: 'input' },
          { id: '5', questionText: '6 + 7 + 1 = ?', answer: '14', type: 'multiple', options: ['12', '13', '14', '15'] },
        ],
      },
      {
        level: 7,
        title: 'Mélange d’opérateurs simples',
        operations: ['+', '-'],
        questions: [
          { id: '1', questionText: '10 + 3 - 7 = ?', answer: '6',  type: 'input' },
          { id: '2', questionText: '9 - 4 + 2 = ?',  answer: '7',  type: 'multiple', options: ['5', '6', '7', '8'] },
          { id: '3', questionText: '7 + 5 - 3 = ?',  answer: '9',  type: 'input' },
          { id: '4', questionText: '6 + 2 - 4 = ?',  answer: '4',  type: 'multiple', options: ['2', '4', '6', '8'] },
          { id: '5', questionText: '8 - 3 + 5 = ?',  answer: '10', type: 'input' },
          { id: '6', questionText: '5 + 4 - 6 = ?',  answer: '3',  type: 'input' },
        ],
      },
      {
        level: 8,
        title: 'Challenge : additions longues et pièges',
        operations: ['+', '-'],
        questions: [
          { id: '1', questionText: '12 + 7 + 5 - 6 = ?',  answer: '18', type: 'input' },
          { id: '2', questionText: '18 - 8 + 10 = ?',     answer: '20', type: 'multiple', options: ['18', '20', '22', '24'] },
          { id: '3', questionText: '15 + 15 - 12 = ?',    answer: '18', type: 'input' },
          { id: '4', questionText: '21 + 3 - 7 + 2 = ?',  answer: '19', type: 'multiple', options: ['19', '20', '21', '22'] },
          { id: '5', questionText: '8 + 9 + 4 - 10 = ?',  answer: '11', type: 'input' },
          { id: '6', questionText: '20 + 1 + 2 - 9 = ?',  answer: '14', type: 'input' },
          { id: '7', questionText: '7 + 8 + 6 - 10 = ?',  answer: '11', type: 'multiple', options: ['10', '11', '12', '13'] },
          { id: '8', questionText: '5 + 7 + 2 - 4 = ?',   answer: '10', type: 'input' },
          { id: '9', questionText: '9 + 4 - 6 + 8 = ?',   answer: '15', type: 'multiple', options: ['13', '14', '15', '16'] },
          { id: '10', questionText: '17 + 7 - 8 + 6 = ?', answer: '22', type: 'input' },
        ],
      },
    ],
  },
  {
    title: 'Soustraction',
    tutorial: {
      id:      'soustraction-tutoriel',
      title:   'Pourquoi apprendre la soustraction ?',
      content: [
        'La soustraction sert à savoir combien il reste quand on enlève quelque chose.',
        'Par exemple, si tu as 5 bonbons et que tu en manges 2, il t’en reste 5 - 2 = 3.',
        'On utilise la soustraction tous les jours : faire la différence, rendre la monnaie, etc.'
      ]
    },
    levels: [
      {
        level: 1,
        title: 'Soustrais jusqu’à 5',
        operations: ['-'],
        questions: [
          { id: '1', questionText: '3 - 1 = ?', answer: '2', type: 'input' },
          { id: '2', questionText: '4 - 2 = ?', answer: '2', type: 'multiple', options: ['1', '2', '3', '0'] },
          { id: '3', questionText: '5 - 0 = ?', answer: '5', type: 'input' },
        ],
      },
      {
        level: 2,
        title: 'Soustrais jusqu’à 10',
        operations: ['-'],
        questions: [
          { id: '1', questionText: '9 - 4 = ?',  answer: '5', type: 'input' },
          { id: '2', questionText: '8 - 3 = ?',  answer: '5', type: 'multiple', options: ['6', '4', '5', '3'] },
          { id: '3', questionText: '10 - 2 = ?', answer: '8', type: 'multiple', options: ['7', '8', '9', '6'] },
          { id: '4', questionText: '7 - 3 = ?',  answer: '4', type: 'input' },
        ],
      },
      {
        level: 3,
        title: 'Des nombres plus grands',
        operations: ['-'],
        questions: [
          { id: '1', questionText: '15 - 7 = ?',  answer: '8', type: 'input' },
          { id: '2', questionText: '13 - 5 = ?',  answer: '8', type: 'multiple', options: ['9', '8', '7', '6'] },
          { id: '3', questionText: '14 - 9 = ?',  answer: '5', type: 'input' },
          { id: '4', questionText: '12 - 4 = ?',  answer: '8', type: 'input' },
          { id: '5', questionText: '18 - 10 = ?', answer: '8', type: 'multiple', options: ['10', '8', '9', '6'] },
        ],
      },
      {
        level: 4,
        title: 'Problèmes de la vie (soustraction)',
        operations: ['-'],
        questions: [
          { id: '1', questionText: 'Tu as 6 biscuits et tu en manges 2. Combien te reste-t-il ?',    answer: '4', type: 'input' },
          { id: '2', questionText: 'Il y a 10 oiseaux. 3 s’envolent. Combien restent ?',             answer: '7', type: 'multiple', options: ['6', '7', '8', '5'] },
          { id: '3', questionText: 'Sara avait 7 pommes, elle en donne 4. Combien lui reste-t-il ?', answer: '3', type: 'input' },
          { id: '4', questionText: 'Tu as 8 bonbons et tu en offres 5. Il t’en reste ?',             answer: '3', type: 'multiple', options: ['2', '3', '4', '1'] },
        ],
      },
      {
        level: 5,
        title: 'Soustraction à deux chiffres',
        operations: ['-'],
        questions: [
          { id: '1', questionText: '21 - 8 = ?',  answer: '13', type: 'input' },
          { id: '2', questionText: '18 - 5 = ?',  answer: '13', type: 'multiple', options: ['13', '14', '12', '15'] },
          { id: '3', questionText: '17 - 7 = ?',  answer: '10', type: 'input' },
          { id: '4', questionText: '14 - 6 = ?',  answer: '8',  type: 'input' },
          { id: '5', questionText: '20 - 11 = ?', answer: '9',  type: 'multiple', options: ['10', '9', '8', '7'] },
          { id: '6', questionText: '12 - 8 = ?',  answer: '4',  type: 'input' },
        ],
      },
      {
        level: 6,
        title: 'Soustraction à trois nombres',
        operations: ['-'],
        questions: [
          { id: '1', questionText: '10 - 3 - 2 = ?', answer: '5',  type: 'input' },
          { id: '2', questionText: '15 - 5 - 3 = ?', answer: '7',  type: 'input' },
          { id: '3', questionText: '20 - 4 - 6 = ?', answer: '10', type: 'multiple', options: ['12', '10', '14', '11'] },
          { id: '4', questionText: '12 - 5 - 2 = ?', answer: '5',  type: 'input' },
          { id: '5', questionText: '13 - 2 - 8 = ?', answer: '3',  type: 'multiple', options: ['4', '2', '3', '5'] },
        ],
      },
      {
        level: 7,
        title: 'Mélange d’opérateurs',
        operations: ['-', '+'],
        questions: [
          { id: '1', questionText: '15 - 4 + 3 = ?', answer: '14', type: 'input' },
          { id: '2', questionText: '20 - 8 + 2 = ?', answer: '14', type: 'multiple', options: ['12', '13', '14', '15'] },
          { id: '3', questionText: '10 - 5 + 7 = ?', answer: '12', type: 'input' },
          { id: '4', questionText: '13 - 6 + 1 = ?', answer: '8',  type: 'multiple', options: ['8', '7', '9', '6'] },
          { id: '5', questionText: '9 + 4 - 2 = ?',  answer: '11', type: 'input' },
          { id: '6', questionText: '7 - 2 + 6 = ?',  answer: '11', type: 'input' },
        ],
      },
      {
        level: 8,
        title: 'Challenge soustraction et pièges',
        operations: ['-', '+'],
        questions: [
          { id: '1', questionText: '18 - 5 + 6 - 4 = ?', answer: '15', type: 'input' },
          { id: '2', questionText: '20 - 7 + 9 = ?',     answer: '22', type: 'multiple', options: ['22', '21', '24', '23'] },
          { id: '3', questionText: '25 - 10 - 2 = ?',    answer: '13', type: 'input' },
          { id: '4', questionText: '14 - 4 + 7 - 3 = ?', answer: '14', type: 'multiple', options: ['13', '14', '15', '16'] },
          { id: '5', questionText: '10 - 2 + 9 - 6 = ?', answer: '11', type: 'input' },
          { id: '6', questionText: '11 - 4 - 2 = ?',     answer: '5',  type: 'input' },
          { id: '7', questionText: '19 - 8 + 4 = ?',     answer: '15', type: 'multiple', options: ['14', '15', '16', '17'] },
          { id: '8', questionText: '9 + 6 - 10 = ?',     answer: '5',  type: 'input' },
        ],
      },
    ],
  },
  {
    title: 'Multiplication',
    tutorial: {
      id:      'multiplication-tutoriel',
      title:   'Pourquoi apprendre la multiplication ?',
      content: [
        'La multiplication, c’est faire plusieurs fois la même addition. Exemple : 3 x 2 = 2 + 2 + 2 = 6.',
        'On s’en sert pour compter plus vite, pour les tables, et dans la vie de tous les jours (partager, calculer des lots, etc.)',
        'Pour t’entraîner, utilise tes doigts, dessine des groupes, ou pense à des objets par paquets.'
      ]
    },
    levels: [
      {
        level: 1,
        title: 'Table de 2',
        operations: ['*'],
        questions: [
          { id: '1', questionText: '2 x 1 = ?', answer: '2', type: 'input' },
          { id: '2', questionText: '2 x 3 = ?', answer: '6', type: 'multiple', options: ['5', '6', '7', '8'] },
          { id: '3', questionText: '2 x 4 = ?', answer: '8', type: 'input' },
        ],
      },
      {
        level: 2,
        title: 'Table de 3',
        operations: ['*'],
        questions: [
          { id: '1', questionText: '3 x 2 = ?', answer: '6',  type: 'input' },
          { id: '2', questionText: '3 x 3 = ?', answer: '9',  type: 'multiple', options: ['6', '7', '8', '9'] },
          { id: '3', questionText: '3 x 4 = ?', answer: '12', type: 'input' },
          { id: '4', questionText: '3 x 5 = ?', answer: '15', type: 'multiple', options: ['15', '12', '9', '18'] },
        ],
      },
      {
        level: 3,
        title: 'Mélange de tables',
        operations: ['*'],
        questions: [
          { id: '1', questionText: '2 x 6 = ?', answer: '12', type: 'input' },
          { id: '2', questionText: '3 x 7 = ?', answer: '21', type: 'multiple', options: ['18', '20', '21', '24'] },
          { id: '3', questionText: '2 x 8 = ?', answer: '16', type: 'input' },
          { id: '4', questionText: '3 x 9 = ?', answer: '27', type: 'multiple', options: ['27', '26', '28', '24'] },
          { id: '5', questionText: '2 x 9 = ?', answer: '18', type: 'input' },
          { id: '6', questionText: '3 x 6 = ?', answer: '18', type: 'multiple', options: ['12', '15', '18', '20'] },
        ],
      },
      {
        level: 4,
        title: 'Problèmes de multiplication',
        operations: ['*'],
        questions: [
          { id: '1', questionText: 'Tu as 2 paquets de 5 bonbons. Combien de bonbons ?', answer: '10', type: 'input' },
          { id: '2', questionText: 'Sarah a 3 boîtes de 4 billes. Total de billes ?',    answer: '12', type: 'multiple', options: ['10', '12', '14', '16'] },
          { id: '3', questionText: '4 sacs avec 2 pommes chacun. Combien de pommes ?',   answer: '8',  type: 'input' },
          { id: '4', questionText: '3 chiens ont chacun 3 os. Combien d’os ?',           answer: '9',  type: 'multiple', options: ['6', '8', '9', '12'] },
        ],
      },
      {
        level: 5,
        title: 'Multiplication à deux chiffres',
        operations: ['*'],
        questions: [
          { id: '1', questionText: '4 x 7 = ?', answer: '28', type: 'input' },
          { id: '2', questionText: '6 x 3 = ?', answer: '18', type: 'multiple', options: ['16', '18', '20', '21'] },
          { id: '3', questionText: '5 x 9 = ?', answer: '45', type: 'input' },
          { id: '4', questionText: '8 x 2 = ?', answer: '16', type: 'input' },
          { id: '5', questionText: '9 x 4 = ?', answer: '36', type: 'input' },
          { id: '6', questionText: '3 x 8 = ?', answer: '24', type: 'multiple', options: ['24', '18', '21', '27'] },
        ],
      },
      {
        level: 6,
        title: 'Multiplications croisées',
        operations: ['*'],
        questions: [
          { id: '1', questionText: '2 x 3 x 4 = ?', answer: '24', type: 'input' },
          { id: '2', questionText: '3 x 5 x 2 = ?', answer: '30', type: 'multiple', options: ['30', '32', '28', '24'] },
          { id: '3', questionText: '2 x 2 x 5 = ?', answer: '20', type: 'input' },
          { id: '4', questionText: '4 x 3 x 1 = ?', answer: '12', type: 'input' },
          { id: '5', questionText: '2 x 2 x 2 = ?', answer: '8',  type: 'multiple', options: ['6', '8', '10', '12'] },
        ],
      },
      {
        level: 7,
        title: 'Mélange opérateurs × et +',
        operations: ['*', '+'],
        questions: [
          { id: '1', questionText: '2 x 3 + 4 = ?', answer: '10', type: 'input' },
          { id: '2', questionText: '5 + 3 x 2 = ?', answer: '11', type: 'multiple', options: ['11', '16', '10', '12'] },
          { id: '3', questionText: '4 x 2 + 1 = ?', answer: '9',  type: 'input' },
          { id: '4', questionText: '1 + 6 x 2 = ?', answer: '13', type: 'multiple', options: ['12', '13', '14', '15'] },
          { id: '5', questionText: '3 x 3 + 3 = ?', answer: '12', type: 'input' },
        ],
      },
      {
        level: 8,
        title: 'Challenge multiplication (expressions longues)',
        operations: ['*', '+'],
        questions: [
          { id: '1', questionText: '(2 + 3) x 4 = ?',       answer: '20', type: 'input' },
          { id: '2', questionText: '2 x (4 + 5) = ?',       answer: '18', type: 'multiple', options: ['16', '18', '14', '20'] },
          { id: '3', questionText: '3 x 3 + 7 = ?',         answer: '16', type: 'input' },
          { id: '4', questionText: '(6 + 2) x 2 = ?',       answer: '16', type: 'multiple', options: ['14', '16', '18', '12'] },
          { id: '5', questionText: '1 + 2 x 6 + 3 = ?',     answer: '16', type: 'input' },
          { id: '6', questionText: '2 x 4 + 2 x 3 = ?',     answer: '14', type: 'input' },
          { id: '7', questionText: '3 x (2 + 4) = ?',       answer: '18', type: 'multiple', options: ['12', '18', '15', '16'] },
          { id: '8', questionText: '5 + 3 x 4 = ?',         answer: '17', type: 'input' },
          { id: '9', questionText: '(2 x 3) + (4 x 2) = ?', answer: '14', type: 'input' },
        ],
      },
    ],
  },
  {
    title: 'Division',
    tutorial: {
      id:      'division-tutoriel',
      title:   'Pourquoi apprendre la division ?',
      content: [
        'La division sert à partager équitablement.',
        'Exemple : 8 ÷ 2 = 4, car 8 partagés en 2 groupes font 4 par groupe.',
        'On s’en sert pour partager des bonbons, des objets, ou résoudre des problèmes de partage.'
      ]
    },
    levels: [
      {
        level: 1,
        title: 'Divise par 2',
        operations: ['/'],
        questions: [
          { id: '1', questionText: '2 ÷ 2 = ?', answer: '1', type: 'input' },
          { id: '2', questionText: '4 ÷ 2 = ?', answer: '2', type: 'multiple', options: ['1', '2', '3', '4'] },
          { id: '3', questionText: '6 ÷ 2 = ?', answer: '3', type: 'input' },
        ],
      },
      {
        level: 2,
        title: 'Divise par 3',
        operations: ['/'],
        questions: [
          { id: '1', questionText: '3 ÷ 3 = ?',  answer: '1', type: 'input' },
          { id: '2', questionText: '6 ÷ 3 = ?',  answer: '2', type: 'multiple', options: ['1', '2', '3', '6'] },
          { id: '3', questionText: '9 ÷ 3 = ?',  answer: '3', type: 'input' },
          { id: '4', questionText: '12 ÷ 3 = ?', answer: '4', type: 'multiple', options: ['3', '4', '5', '6'] },
        ],
      },
      {
        level: 3,
        title: 'Divisions variées',
        operations: ['/'],
        questions: [
          { id: '1', questionText: '8 ÷ 2 = ?',  answer: '4',  type: 'input' },
          { id: '2', questionText: '12 ÷ 4 = ?', answer: '3',  type: 'multiple', options: ['2', '3', '4', '6'] },
          { id: '3', questionText: '18 ÷ 3 = ?', answer: '6',  type: 'input' },
          { id: '4', questionText: '15 ÷ 5 = ?', answer: '3',  type: 'input' },
          { id: '5', questionText: '20 ÷ 2 = ?', answer: '10', type: 'input' },
        ],
      },
      {
        level: 4,
        title: 'Problèmes de partage',
        operations: ['/'],
        questions: [
          { id: '1', questionText: 'Tu as 8 bonbons pour 4 amis. Combien chacun ?',           answer: '2', type: 'input' },
          { id: '2', questionText: '12 cookies pour 3 enfants. Combien chacun ?',             answer: '4', type: 'multiple', options: ['3', '4', '5', '6'] },
          { id: '3', questionText: '10 billes à répartir dans 2 pots. Combien par pot ?',     answer: '5', type: 'input' },
          { id: '4', questionText: '16 ballons à partager entre 4 enfants. Combien chacun ?', answer: '4', type: 'multiple', options: ['3', '4', '5', '6'] },
        ],
      },
      {
        level: 5,
        title: 'Divisions avec des grands nombres',
        operations: ['/'],
        questions: [
          { id: '1', questionText: '24 ÷ 6 = ?',  answer: '4',  type: 'input' },
          { id: '2', questionText: '21 ÷ 7 = ?',  answer: '3',  type: 'multiple', options: ['2', '3', '4', '5'] },
          { id: '3', questionText: '36 ÷ 9 = ?',  answer: '4',  type: 'input' },
          { id: '4', questionText: '45 ÷ 5 = ?',  answer: '9',  type: 'input' },
          { id: '5', questionText: '30 ÷ 3 = ?',  answer: '10', type: 'input' },
          { id: '6', questionText: '50 ÷ 10 = ?', answer: '5',  type: 'multiple', options: ['4', '5', '6', '7'] },
        ],
      },
      {
        level: 6,
        title: 'Mélange opérateurs ÷ et x',
        operations: ['/', '*'],
        questions: [
          { id: '1', questionText: '2 x 4 ÷ 2 = ?',  answer: '4',  type: 'input' },
          { id: '2', questionText: '3 x 3 ÷ 3 = ?',  answer: '3',  type: 'multiple', options: ['2', '3', '4', '5'] },
          { id: '3', questionText: '8 ÷ 2 x 3 = ?',  answer: '12', type: 'input' },
          { id: '4', questionText: '6 x 2 ÷ 3 = ?',  answer: '4',  type: 'multiple', options: ['3', '4', '6', '2'] },
          { id: '5', questionText: '12 ÷ 2 x 2 = ?', answer: '12', type: 'input' },
        ],
      },
      {
        level: 7,
        title: 'Divisions longues et pièges',
        operations: ['/'],
        questions: [
          { id: '1', questionText: '30 ÷ 5 ÷ 2 = ?', answer: '3', type: 'input' },
          { id: '2', questionText: '24 ÷ 4 ÷ 2 = ?', answer: '3', type: 'input' },
          { id: '3', questionText: '18 ÷ 3 ÷ 3 = ?', answer: '2', type: 'input' },
          { id: '4', questionText: '36 ÷ 2 ÷ 3 = ?', answer: '6', type: 'multiple', options: ['5', '6', '7', '8'] },
          { id: '5', questionText: '48 ÷ 4 ÷ 2 = ?', answer: '6', type: 'input' },
          { id: '6', questionText: '21 ÷ 7 ÷ 1 = ?', answer: '3', type: 'multiple', options: ['2', '3', '1', '4'] },
        ],
      },
    ],
  },
  {
    title: 'Suites et motifs',
    tutorial: {
      id:      'motifs-tutoriel',
      title:   'Pourquoi apprendre les suites et motifs ?',
      content: [
        'Comprendre les suites, c’est comme trouver la logique cachée derrière une série de nombres.',
        'Ça développe ton cerveau pour repérer des règles, prévoir ce qui vient ensuite et résoudre des énigmes.',
        'Observe toujours les différences ou les multiplications entre les nombres pour trouver le motif.'
      ]
    },
    levels: [
      {
        level: 1,
        title: 'Complète la suite (facile)',
        operations: [],
        questions: [
          { id: '1', questionText: '1, 2, 3, 4, ?',    answer: '5',  type: 'input' },
          { id: '2', questionText: '5, 10, 15, 20, ?', answer: '25', type: 'input' },
          { id: '3', questionText: '2, 4, 6, 8, ?',    answer: '10', type: 'multiple', options: ['6', '8', '10', '12'] },
        ],
      },
      {
        level: 2,
        title: 'Que vient-il après ?',
        operations: [],
        questions: [
          { id: '1', questionText: '2, 4, 8, 16, ?',   answer: '32', type: 'input' },
          { id: '2', questionText: '1, 3, 6, 10, ?',   answer: '15', type: 'multiple', options: ['10', '12', '15', '18'] },
          { id: '3', questionText: '10, 8, 6, 4, ?',   answer: '2',  type: 'input' },
          { id: '4', questionText: '9, 12, 15, 18, ?', answer: '21', type: 'input' },
        ],
      },
      {
        level: 3,
        title: 'Devine le motif !',
        operations: [],
        questions: [
          { id: '1', questionText: '6, 12, 18, 24, ?',  answer: '30',  type: 'input' },
          { id: '2', questionText: '20, 17, 14, 11, ?', answer: '8',   type: 'multiple', options: ['8', '7', '10', '11'] },
          { id: '3', questionText: '8, 16, 32, 64, ?',  answer: '128', type: 'input' },
          { id: '4', questionText: '3, 9, 27, ?',       answer: '81',  type: 'input' },
        ],
      },
      {
        level: 4,
        title: 'Motifs piégeux',
        operations: [],
        questions: [
          { id: '1', questionText: '1, 4, 9, 16, ?',     answer: '25', type: 'input' },
          { id: '2', questionText: '100, 90, 80, 70, ?', answer: '60', type: 'multiple', options: ['50', '60', '70', '80'] },
          { id: '3', questionText: '3, 6, 12, 24, ?',    answer: '48', type: 'input' },
        ],
      },
      {
        level: 5,
        title: 'Super défi motif',
        operations: [],
        questions: [
          { id: '1', questionText: '11, 22, 44, 88, ?',      answer: '176', type: 'input' },
          { id: '2', questionText: '1, 2, 4, 7, 11, ?',      answer: '16',  type: 'multiple', options: ['14', '16', '18', '20'] },
          { id: '3', questionText: '5, 15, 45, ?',           answer: '135', type: 'input' },
          { id: '4', questionText: '10, 20, 40, 80, 160, ?', answer: '320', type: 'multiple', options: ['320', '300', '350', '400'] },
          { id: '5', questionText: '7, 9, 12, 16, 21, ?',    answer: '27',  type: 'input' },
        ],
      },
      {
        level: 6,
        title: 'Enigmes longues',
        operations: [],
        questions: [
          { id: '1', questionText: '2, 5, 10, 17, ?',    answer: '26', type: 'input' },
          { id: '2', questionText: '30, 27, 24, 21, ?',  answer: '18', type: 'multiple', options: ['15', '18', '21', '24'] },
          { id: '3', questionText: '2, 4, 8, 16, 32, ?', answer: '64', type: 'input' },
          { id: '4', questionText: '12, 17, 22, 27, ?',  answer: '32', type: 'input' },
          { id: '5', questionText: '100, 80, 60, 40, ?', answer: '20', type: 'multiple', options: ['0', '20', '30', '40'] },
          { id: '6', questionText: '4, 9, 16, 25, ?',    answer: '36', type: 'input' },
        ],
      },
      {
        level: 7,
        title: 'Master motif !',
        operations: [],
        questions: [
          { id: '1', questionText: '1, 3, 6, 10, 15, 21, ?', answer: '28',  type: 'input' },
          { id: '2', questionText: '9, 18, 36, 72, ?',       answer: '144', type: 'multiple', options: ['108', '144', '180', '216'] },
          { id: '3', questionText: '13, 26, 52, 104, ?',     answer: '208', type: 'input' },
          { id: '4', questionText: '7, 10, 14, 19, 25, ?',   answer: '32',  type: 'input' },
          { id: '5', questionText: '21, 18, 15, 12, ?',      answer: '9',   type: 'multiple', options: ['6', '7', '9', '12'] },
          { id: '6', questionText: '1, 4, 10, 20, ?',        answer: '35',  type: 'input' },
          { id: '7', questionText: '2, 6, 12, 20, ?',        answer: '30',  type: 'input' },
        ],
      },
    ],
  },
  {
    title: 'Modulo et restes',
    tutorial: {
      id:      'modulo-tutoriel',
      title:   'C’est quoi le modulo ?',
      content: [
        'Le modulo sert à savoir ce qu’il reste quand on partage un nombre.',
        'Exemple : 5 % 2 = 1, car 5 divisé par 2 fait 2 fois 2 (=4), et il reste 1.',
        'C’est très utile pour voir si un nombre est pair ou impair, ou combien il reste après un partage.'
      ]
    },
    levels: [
      {
        level: 1,
        title: 'Reste de la division par 2',
        operations: ['%'],
        questions: [
          { id: '1', questionText: '5 % 2 = ?', answer: '1', type: 'input' },
          { id: '2', questionText: '4 % 2 = ?', answer: '0', type: 'multiple', options: ['1', '2', '0', '4'] },
          { id: '3', questionText: '7 % 2 = ?', answer: '1', type: 'input' },
        ],
      },
      {
        level: 2,
        title: 'Reste de la division par 3',
        operations: ['%'],
        questions: [
          { id: '1', questionText: '7 % 3 = ?',  answer: '1', type: 'input' },
          { id: '2', questionText: '9 % 3 = ?',  answer: '0', type: 'multiple', options: ['3', '0', '2', '1'] },
          { id: '3', questionText: '10 % 3 = ?', answer: '1', type: 'input' },
          { id: '4', questionText: '5 % 3 = ?',  answer: '2', type: 'input' },
        ],
      },
      {
        level: 3,
        title: 'Restes variés',
        operations: ['%'],
        questions: [
          { id: '1', questionText: '11 % 4 = ?', answer: '3', type: 'input' },
          { id: '2', questionText: '13 % 5 = ?', answer: '3', type: 'multiple', options: ['3', '2', '1', '0'] },
          { id: '3', questionText: '14 % 5 = ?', answer: '4', type: 'input' },
          { id: '4', questionText: '10 % 4 = ?', answer: '2', type: 'input' },
          { id: '5', questionText: '17 % 6 = ?', answer: '5', type: 'multiple', options: ['5', '6', '7', '8'] },
        ],
      },
      {
        level: 4,
        title: 'Pair ou impair ?',
        operations: ['%'],
        questions: [
          { id: '1', questionText: 'Est-ce que 8 est pair ? (8 % 2)',     answer: '0', type: 'input' },
          { id: '2', questionText: 'Est-ce que 13 est impair ? (13 % 2)', answer: '1', type: 'multiple', options: ['1', '0', '2', '13'] },
          { id: '3', questionText: 'Est-ce que 10 est pair ? (10 % 2)',   answer: '0', type: 'input' },
          { id: '4', questionText: 'Est-ce que 21 est impair ? (21 % 2)', answer: '1', type: 'input' },
        ],
      },
      {
        level: 5,
        title: 'Défi modulo',
        operations: ['%'],
        questions: [
          { id: '1', questionText: '23 % 7 = ?',  answer: '2', type: 'input' },
          { id: '2', questionText: '17 % 5 = ?',  answer: '2', type: 'multiple', options: ['2', '1', '3', '4'] },
          { id: '3', questionText: '28 % 4 = ?',  answer: '0', type: 'input' },
          { id: '4', questionText: '31 % 6 = ?',  answer: '1', type: 'multiple', options: ['1', '3', '5', '0'] },
          { id: '5', questionText: '12 % 8 = ?',  answer: '4', type: 'input' },
          { id: '6', questionText: '21 % 4 = ?',  answer: '1', type: 'input' },
          { id: '7', questionText: '33 % 10 = ?', answer: '3', type: 'multiple', options: ['2', '3', '4', '1'] },
        ],
      },
    ],
  },
  {
    title: 'Valeur des chiffres',
    tutorial: {
      id:      'valeur-tutoriel',
      title:   'Pourquoi comprendre la valeur des chiffres ?',
      content: [
        'Chaque chiffre d’un nombre a une valeur différente selon sa place (unités, dizaines, centaines…).',
        'Exemple : dans 43, le 3 vaut 3 unités, le 4 vaut 4 dizaines (donc 40).',
        'C’est la base pour bien lire et écrire les nombres, et pour poser les opérations plus tard.'
      ]
    },
    levels: [
      {
        level: 1,
        title: 'Unités et dizaines',
        operations: [],
        questions: [
          { id: '1', questionText: 'Quel est le chiffre des unités dans 47 ?',   answer: '7', type: 'input' },
          { id: '2', questionText: 'Quel est le chiffre des dizaines dans 53 ?', answer: '5', type: 'multiple', options: ['5', '3', '0', '7'] },
          { id: '3', questionText: 'Quel est le chiffre des unités dans 16 ?',   answer: '6', type: 'input' },
        ],
      },
      {
        level: 2,
        title: 'Centaines',
        operations: [],
        questions: [
          { id: '1', questionText: 'Quel est le chiffre des centaines dans 235 ?', answer: '2', type: 'input' },
          { id: '2', questionText: 'Quel est le chiffre des dizaines dans 482 ?',  answer: '8', type: 'multiple', options: ['2', '8', '4', '0'] },
          { id: '3', questionText: 'Quel est le chiffre des unités dans 671 ?',    answer: '1', type: 'input' },
          { id: '4', questionText: 'Quel est le chiffre des centaines dans 408 ?', answer: '4', type: 'multiple', options: ['8', '0', '4', '1'] },
        ],
      },
      {
        level: 3,
        title: 'Construis le nombre',
        operations: [],
        questions: [
          { id: '1', questionText: 'Quel nombre a 3 centaines, 5 dizaines et 2 unités ?', answer: '352', type: 'input' },
          { id: '2', questionText: 'Quel nombre a 6 centaines, 4 dizaines et 7 unités ?', answer: '647', type: 'multiple', options: ['647', '467', '674', '746'] },
          { id: '3', questionText: 'Quel nombre a 2 centaines, 8 dizaines et 5 unités ?', answer: '285', type: 'input' },
        ],
      },
      {
        level: 4,
        title: 'Défi valeur des chiffres',
        operations: [],
        questions: [
          { id: '1', questionText: 'Dans 574, quel est le chiffre des dizaines ?',    answer: '7', type: 'input' },
          { id: '2', questionText: 'Dans 803, quel est le chiffre des centaines ?',   answer: '8', type: 'multiple', options: ['8', '0', '3', '1'] },
          { id: '3', questionText: 'Dans 762, quel est le chiffre des unités ?',      answer: '2', type: 'input' },
          { id: '4', questionText: 'Dans 456, quel est le chiffre des centaines ?',   answer: '4', type: 'input' },
          { id: '5', questionText: 'Dans 3 720, quel est le chiffre des centaines ?', answer: '7', type: 'input' },
        ],
      },
    ],
  },
  {
    title: 'Les maths dans la vie',
    tutorial: {
      id:      'vie-tutoriel',
      title:   'Les maths, ça sert à quoi dans la vraie vie ?',
      content: [
        'Les maths sont partout ! Faire les courses, partager une pizza, compter ses économies…',
        'Savoir calculer vite, c’est super utile pour ne pas se faire avoir et pour mieux comprendre le monde autour de toi.',
        'Essaie d’imaginer à quoi servent les opérations dans la vie de tous les jours.'
      ]
    },
    levels: [
      {
        level: 1,
        title: 'Aventures au magasin',
        operations: [],
        questions: [
          { id: '1', questionText: 'Si un jouet coûte 4€ et tu as 6€, combien te reste-t-il après l’achat ?', answer: '2', type: 'input' },
          { id: '2', questionText: 'Un paquet de bonbons coûte 2€. Tu en achètes 3. Combien ça coûte ?',      answer: '6', type: 'input' },
          { id: '3', questionText: 'Un autocollant coûte 1€. Tu en veux 4. Combien pour tous ?',              answer: '4', type: 'multiple', options: ['2', '4', '6', '8'] },
        ],
      },
      {
        level: 2,
        title: 'Fête de la pizza',
        operations: [],
        questions: [
          { id: '1', questionText: 'Tu as 8 parts de pizza à partager entre 4 amis. Combien chacun ?', answer: '2', type: 'input' },
          { id: '2', questionText: 'Il y a 6 cupcakes pour 3 enfants. Combien chacun ?',               answer: '2', type: 'multiple', options: ['1', '2', '3', '6'] },
          { id: '3', questionText: '12 bonbons pour 6 amis. Combien chacun ?',                         answer: '2', type: 'input' },
          { id: '4', questionText: 'Tu as 15 cookies. Tu en donnes 5 à chaque ami. Combien d’amis ?',  answer: '3', type: 'multiple', options: ['2', '3', '5', '10'] },
        ],
      },
      {
        level: 3,
        title: 'Arrêt de bus',
        operations: [],
        questions: [
          { id: '1', questionText: 'Il y a 7 enfants dans le bus. 3 montent encore. Combien maintenant ?', answer: '10', type: 'input' },
          { id: '2', questionText: '10 enfants dans le bus. 2 descendent. Combien reste-t-il ?',           answer: '8',  type: 'input' },
          { id: '3', questionText: 'Le bus commence avec 5 enfants. 5 montent encore. Combien ?',          answer: '10', type: 'input' },
          { id: '4', questionText: '15 enfants dans le bus, 4 descendent. Combien ?',                      answer: '11', type: 'multiple', options: ['10', '11', '12', '13'] },
          { id: '5', questionText: '8 enfants dans le bus, 8 autres montent. Total ?',                     answer: '16', type: 'input' },
        ],
      },
      {
        level: 4,
        title: 'Anniversaire',
        operations: [],
        questions: [
          { id: '1', questionText: 'Tu invites 10 amis. Chacun apporte 2 cadeaux. Total de cadeaux ?', answer: '20', type: 'input' },
          { id: '2', questionText: '3 gâteaux, 8 parts chacun. Total de parts ?',                      answer: '24', type: 'multiple', options: ['24', '16', '8', '32'] },
          { id: '3', questionText: '12 ballons, 4 éclatent. Combien restent ?',                        answer: '8',  type: 'input' },
          { id: '4', questionText: 'Chaque ami amène 3 cookies. Tu as 4 amis. Combien de cookies ?',   answer: '12', type: 'input' },
        ],
      },
      {
        level: 5,
        title: 'Défi : la vraie vie !',
        operations: [],
        questions: [
          { id: '1', questionText: 'Tu as 20€. Tu achètes un jouet à 13€. Combien reste-t-il ?',            answer: '7',  type: 'input' },
          { id: '2', questionText: 'Un livre coûte 7€. Tu paies avec 10€. Quelle monnaie ?',                answer: '3',  type: 'input' },
          { id: '3', questionText: 'Tu as 18 autocollants. Tu les partages entre 3 amis. Combien chacun ?', answer: '6',  type: 'multiple', options: ['4', '5', '6', '7'] },
          { id: '4', questionText: 'Il y a 16 pommes. Chaque sac en contient 4. Combien de sacs ?',         answer: '4',  type: 'input' },
          { id: '5', questionText: 'Tu achètes 2 bonbons à 3€ chacun. Total ?',                             answer: '6',  type: 'input' },
          { id: '6', questionText: 'Tu veux acheter 3 jeux à 7€ chacun. Combien ça coûte ?',                answer: '21', type: 'input' },
        ],
      },
    ],
  },
  {
    title: 'Comparer les nombres',
    tutorial: {
      id:      'comparer-tutoriel',
      title:   'Pourquoi comparer les nombres ?',
      content: [
        'Comparer, c’est savoir quel nombre est plus grand, plus petit, ou égal à un autre.',
        'On utilise ça pour faire des choix, trier, et résoudre plein de problèmes.',
        'Utilise les signes >, < et = pour t’aider à visualiser !'
      ]
    },
    levels: [
      {
        level: 1,
        title: 'Plus grand ou plus petit ?',
        operations: [],
        questions: [
          { id: '1', questionText: 'Quel est le plus grand : 5 ou 8 ?',   answer: '8',  type: 'input' },
          { id: '2', questionText: 'Quel est le plus petit : 2 ou 7 ?',   answer: '2',  type: 'multiple', options: ['2', '7', '5', '3'] },
          { id: '3', questionText: 'Quel est le plus grand : 12 ou 10 ?', answer: '12', type: 'input' },
        ],
      },
      {
        level: 2,
        title: 'Plus grand, plus petit, ou égal ?',
        operations: [],
        questions: [
          { id: '1', questionText: 'Est-ce que 6 > 4 ?', answer: 'oui', type: 'input' },
          { id: '2', questionText: 'Est-ce que 7 < 3 ?', answer: 'non', type: 'multiple', options: ['oui', 'non'] },
          { id: '3', questionText: 'Est-ce que 5 = 5 ?', answer: 'oui', type: 'input' },
          { id: '4', questionText: 'Est-ce que 8 > 9 ?', answer: 'non', type: 'input' },
        ],
      },
      {
        level: 3,
        title: 'Compare les sommes',
        operations: [],
        questions: [
          { id: '1', questionText: 'Quel est le plus grand : 5 + 2 ou 3 + 8 ?',  answer: '11', type: 'input' },
          { id: '2', questionText: 'Quel est le plus petit : 6 + 3 ou 4 + 1 ?',  answer: '5',  type: 'multiple', options: ['5', '9', '7', '8'] },
          { id: '3', questionText: 'Quel est le plus grand : 9 + 5 ou 10 + 2 ?', answer: '14', type: 'input' },
          { id: '4', questionText: 'Quel est le plus petit : 3 + 3 ou 2 + 5 ?',  answer: '6',  type: 'input' },
        ],
      },
      {
        level: 4,
        title: 'Comparaisons piégeuses',
        operations: [],
        questions: [
          { id: '1', questionText: 'Quel est le plus grand : 12 x 2 ou 20 + 5 ?', answer: '24',  type: 'input' },
          { id: '2', questionText: 'Quel est le plus petit : 16 ÷ 2 ou 5 x 2 ?',  answer: '8',   type: 'multiple', options: ['10', '8', '12', '15'] },
          { id: '3', questionText: 'Est-ce que 12 + 3 = 15 ?',                    answer: 'oui', type: 'input' },
          { id: '4', questionText: 'Est-ce que 20 - 6 > 10 ?',                    answer: 'oui', type: 'input' },
          { id: '5', questionText: 'Est-ce que 6 x 2 < 12 ?',                     answer: 'oui', type: 'input' },
        ],
      },
      {
        level: 5,
        title: 'Défi de comparaison',
        operations: [],
        questions: [
          { id: '1', questionText: 'Quel est le plus grand : 17 + 8 ou 20 + 2 ?', answer: '25',  type: 'input' },
          { id: '2', questionText: 'Quel est le plus petit : 40 ÷ 5 ou 6 x 1 ?',  answer: '6',   type: 'multiple', options: ['8', '6', '9', '10'] },
          { id: '3', questionText: 'Est-ce que 21 = 21 ?',                        answer: 'oui', type: 'input' },
          { id: '4', questionText: 'Est-ce que 10 x 2 > 19 ?',                    answer: 'oui', type: 'input' },
          { id: '5', questionText: 'Quel est le plus grand : 5 x 5 ou 6 x 4 ?',   answer: '24',  type: 'input' },
          { id: '6', questionText: 'Est-ce que 15 < 18 ?',                        answer: 'oui', type: 'input' },
          { id: '7', questionText: 'Quel est le plus petit : 2 + 3 ou 7 - 2 ?',   answer: '5',   type: 'input' },
        ],
      },
    ],
  },
  // TODO Add more sections if necessary
];
