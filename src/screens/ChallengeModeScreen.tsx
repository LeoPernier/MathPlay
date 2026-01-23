// src/screens/ChallengeModeScreen.tsx

import React, { useState }                                              from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import HomeButton                                                       from '../components/HomeButton';
import Slider                                                           from '../components/Slider';
import LabelWithTooltip                                                 from '../components/LabelWithTooltip';
import SvgIcon from '../components/SvgIcon';
import type { IconName } from '../icons';
import { createLevelInstance }                                          from '../logic/GameEngine';
import { LevelSettings, ScoringRules }                                  from '../config/LevelSettings';
import { Operation }                                                    from '../config/GameTypes';
import { SvgProps }                                                     from 'react-native-svg';

const QUESTION_TYPES = [
  {key: 'addition',       label: 'Addition',       icon: 'plus',     operations: ['+'] as const },
  {key: 'subtraction',    label: 'Subtraction',    icon: 'minus',    operations: ['-'] as const },
  {key: 'multiplication', label: 'Multiplication', icon: 'multiply', operations: ['*'] as const },
  {key: 'division',       label: 'Division',       icon: 'divide',   operations: ['/'] as const },
  {key: 'modulo',         label: 'Modulo',         icon: 'modulo',   operations: ['%'] as const },
] as const satisfies ReadonlyArray<{
  key: string;
  label: string;
  icon: IconName;
  operations: readonly Operation[];
}>;

const DIFFICULTIES = [
  { key: 'easy',   label: 'Facile',    color: '#81c784' },
  { key: 'medium', label: 'Moyen',     color: '#ffb74d' },
  { key: 'hard',   label: 'Difficile', color: '#e57373' },
];

const LENGTHS = [
  { key: 'short',  label: 'Court', questions: 5 },
  { key: 'medium', label: 'Moyen', questions: 10 },
  { key: 'long',   label: 'Long',  questions: 20 },
];

const operandRanges: Record<Operation, Record<'easy' | 'medium' | 'hard', [number, number]>> = {
  '+': {easy: [1, 20], medium: [10, 99], hard:   [100, 999]},
  '-': {easy: [1, 20], medium: [10, 99], hard:   [100, 999]},
  '*': {easy: [1, 12], medium: [ 2, 24], hard:   [  2,  99]},
  '/': {easy: [1, 12], medium: [ 2, 24], hard:   [  2,  99]},
  '%': {easy: [1, 12], medium: [ 1, 24], hard:   [  1,  99]},
};

export default function ChallengeModeScreen({ navigation }: any) {
  const [selectedTypes,       setSelectedTypes]       = useState<string[]>([]);
  const [length,              setLength]              = useState<string | null>(null);
  const [timerEnabled,        setTimerEnabled]        = useState(false);
  const [timerValue,          setTimerValue]          = useState(30);
  const [difficulty,          setDifficulty]          = useState<string | null>(null);
  const [compositeEnabled,    setCompositeEnabled]    = useState(false);
  const [minTerms,            setMinTerms]            = useState(2);
  const [maxTerms,            setMaxTerms]            = useState(3);
  const [allowNegativesComp,  setAllowNegativesComp]  = useState(false);
  const [requirePositiveComp, setRequirePositiveComp] = useState(false);
  const [parenthesesComp,     setParenthesesComp]     = useState(false);
  const [decimalsComp,        setDecimalsComp]        = useState(false);

  const canStart =
    selectedTypes.length > 0 &&
    typeof length     === 'string' &&
    typeof difficulty === 'string' &&
    (timerEnabled ? typeof timerValue === 'number' && timerValue >= 5 && timerValue <= 60 : true);

  const selectedTypeObjects = QUESTION_TYPES.filter(t => selectedTypes.includes(t.key));
  const selectedDiff        = DIFFICULTIES.find(d => d.key === difficulty);

  const allOperations = Array.from(
    new Set(selectedTypeObjects.flatMap(t => t.operations))
  ) as Operation[];

  const typeMult = 1 + Math.max(0, selectedTypes.length - 1) * 0.1;
  const qMultMap: Record<string, number> = {
    short:  1,
    medium: 1.25,
    long:   1.5,
  };
  const qMult     = length ? qMultMap[length] : 1;
  let   timerMult = 1;
  if (timerEnabled) {
    if      (timerValue >= 60) timerMult = 1.0625;
    else if (timerValue == 45) timerMult = 1.125;
    else if (timerValue >= 30) timerMult = 1.25;
    else if (timerValue >= 15) timerMult = 1.5;
    else if (timerValue == 14) timerMult = 1.6;
    else if (timerValue == 13) timerMult = 1.7;
    else if (timerValue == 12) timerMult = 1.8;
    else if (timerValue == 11) timerMult = 1.9;
    else if (timerValue == 10) timerMult = 2;
    else if (timerValue == 9)  timerMult = 2.2;
    else if (timerValue == 8)  timerMult = 2.4;
    else if (timerValue == 7)  timerMult = 2.6;
    else if (timerValue == 6)  timerMult = 2.8;
    else                       timerMult = 3;
  }
  const diffMult = selectedDiff
    ? selectedDiff.key   === 'easy'   ? 1
      : selectedDiff.key === 'medium' ? 1.5
      : 2
    : 1;
  const totalMult       = typeMult * qMult * timerMult * diffMult;
  const timeBonusWeight = timerEnabled ? 0.5 : 0;

  const startChallenge = () => {
    if (!canStart) return;

    const basePoints = selectedDiff?.key === 'easy' ? 50
      : selectedDiff?.key === 'medium' ? 75
      : 100;

    const streakBonusPer = 0.10;

    const scoring: ScoringRules = {
      correct:     basePoints,
      incorrect:   0,
      streakBonus: streakBonusPer,
      timeBonus:   timeBonusWeight,
    };

    const settings: LevelSettings = {
      mode:                 'challenge',
      questionSource:       'generated',
      questionsPerLevel:    LENGTHS.find(l => l.key === length)?.questions || 10,
      timeLimitPerQuestion: timerEnabled ? timerValue : undefined,
      allowedOperations:    allOperations,
      allowSkip:            false,
      allowNavigate:        true,
      randomSeed:           Math.floor(Math.random() * 99999),
      difficulty:           selectedDiff?.key,
      scoring,
      theme: {
        backgroundColor:    '#fff3e0',
        primaryColor:       selectedDiff?.color,
        accentColor:        selectedDiff?.color,
      },
      minOperand:      1,
      maxOperand:      10,
      allowNegative:   selectedDiff!.key !== 'easy',
      allowDecimals:   selectedTypeObjects.some(t => t.key === 'division') && selectedDiff!.key === 'hard',
      allowDuplicates: true,
      perOpSettings: allOperations.reduce((map, op) => {
        const diffKey = selectedDiff!.key as 'easy' | 'medium' | 'hard';
        const [baseMin, baseMax] = operandRanges[op][diffKey];

        map[op] = {
          minOperand:    baseMin,
          maxOperand:    baseMax,
          allowDecimals: op === '/' ? decimalsComp : false,
          exactDivision: op === '/',
          weight:        1,
        };
        return map;
      }, {} as Partial<Record<Operation, import('../config/LevelSettings').PerOpSettings>>),
      compositeSettings: {
        enabled:               compositeEnabled,
        minOperands:           minTerms,
        maxOperands:           maxTerms,
        operatorMix:           allOperations,
        allowNegatives:        allowNegativesComp,
        requirePositiveResult: requirePositiveComp,
        parentheses:           parenthesesComp,
        allowDecimals:         decimalsComp,
      },
    };
    const instance = createLevelInstance(settings);
    navigation.navigate('Game', {
      levelInstance:   instance,
      totalMultiplier: totalMult,
    });
  };

  const handleTypeToggle = (key: string) => {
    setSelectedTypes(prev => {
      const newSelected = prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key];

      if (newSelected.length === 0) {
        setLength(null);
        setTimerEnabled(false);
        setTimerValue(30);
        setDifficulty(null);
      }

      if (newSelected.length < 2) {
        setCompositeEnabled(false);
        setMinTerms(2);
        setMaxTerms(3);
        setAllowNegativesComp(false);
        setRequirePositiveComp(false);
        setParenthesesComp(false);
        setDecimalsComp(false);
      }

      return newSelected;
    });
  };

  const handleLengthSelect = (key: string) => setLength(key);
  const handleSliderChange = (v: number) => {
    if (timerEnabled) setTimerValue(v);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mode Défi</Text>
      <Text style={styles.multiplierText}>
        Multiplicateur de point total : {totalMult.toFixed(1)}×
      </Text>

      <ScrollView
        style={styles.verticalScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.settingRow}>
          <LabelWithTooltip
            label="Type de questions (1 ou plus):"
            tooltip="Choisis un ou plusieurs types d’opérations. Modulo = le reste après la division !"
            style={styles.label}
          />
          <Text style={styles.settingStat}>
            x{typeMult.toFixed(1)}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeScrollContent}
          style={styles.typeScroll}
        >
          {QUESTION_TYPES.map(t => {
            const selected = selectedTypes.includes(t.key);
            const fillColor = selected ? '#ff9800' : '#bbb';

            return (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.typeCard,
                  selected && { backgroundColor: '#ffe0b2', borderColor: '#ff9800', borderWidth: 2 },
                ]}
                onPress={() => handleTypeToggle(t.key)}
                activeOpacity={0.8}
              >
                <SvgIcon name={t.icon} size={32} fill={fillColor} style={{ opacity: selected ? 1 : 0.6 }} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {selectedTypes.length >= 2 && (
          <View style={styles.settingBlock}>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Questions à plusieurs termes</Text>
              <Switch
                value={compositeEnabled}
                onValueChange={setCompositeEnabled}
              />
            </View>

            {compositeEnabled && (
              <>
                <View style={[styles.settingRow, styles.sliderRow]}>
                  <Text style={styles.settingText}>Opérandes par question :</Text>
                  <View style={styles.sliderContainer}>
                    <Slider
                      minimumValue={2}
                      maximumValue={5}
                      step={1}
                      value={maxTerms}
                      onValueChange={v => {
                        setMaxTerms(v);
                        if (v < minTerms) setMinTerms(v);
                      }}
                    />
                  </View>
                </View>

                <View style={styles.settingRow}>
                  <Text style={styles.settingText}>Autoriser les négatifs</Text>
                  <Switch
                    value={allowNegativesComp}
                    onValueChange={setAllowNegativesComp}
                  />
                </View>

                <View style={styles.settingRow}>
                  <Text style={styles.settingText}>Résultat positif uniquement</Text>
                  <Switch
                    value={requirePositiveComp}
                    onValueChange={setRequirePositiveComp}
                  />
                </View>

                <View style={styles.settingRow}>
                  <Text style={styles.settingText}>Parenthèses</Text>
                  <Switch
                    value={parenthesesComp}
                    onValueChange={setParenthesesComp}
                  />
                </View>

                <View style={styles.settingRow}>
                  <Text style={styles.settingText}>Autoriser les décimales</Text>
                  <Switch
                    value={decimalsComp}
                    onValueChange={setDecimalsComp}
                  />
                </View>
              </>
            )}
          </View>
        )}

        {selectedTypes.length > 0 && (
          <>
            <View style={styles.settingRow}>
              <LabelWithTooltip
                label="Nombre de questions:"
                tooltip="Combien de questions pour ce défi ? Plus tu en mets, plus t’es champion."
                style={styles.label}
              />
              <Text style={styles.settingStat}>
                ×{qMult.toFixed(2)}
              </Text>
            </View>
            <View style={styles.lengthRow}>
              {LENGTHS.map(l => (
                <TouchableOpacity
                  key={l.key}
                  style={[
                    styles.lengthCard,
                    length === l.key && { backgroundColor: '#ff9800', borderWidth: 2, borderColor: '#ff9800' },
                  ]}
                  onPress={() => handleLengthSelect(l.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.lengthLabel,
                    length === l.key && { color: '#fff', fontWeight: 'bold' }
                  ]}>
                    {l.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {selectedTypes.length > 0 && length && (
          <>
            <View style={styles.settingRow}>
              <LabelWithTooltip
                label="Timer:"
                tooltip="Active ou désactive le timer ici. À droite, règle la durée (5-60 s) !"
                style={styles.label}
              />
              <Text style={styles.settingStat}>
                ×{timerMult.toFixed(2)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingHorizontal: 20, marginBottom: 8, marginTop: 0 }}>
              <TouchableOpacity
                onPress={() => setTimerEnabled(v => !v)}
                style={{
                  marginRight: 12,
                  backgroundColor: timerEnabled ? '#ff9800' : '#eee',
                  borderRadius: 20,
                  padding: 8,
                  elevation: 2,
                }}
                accessibilityLabel={timerEnabled ? 'Désactiver le timer' : 'Activer le timer'}
              >
                <SvgIcon name={timerEnabled ? 'clockActive' : 'clock'} size={22} color={timerEnabled ? '#fff' : '#bbb'} />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                {timerEnabled ? (
                  <Slider
                    minimumValue={5}
                    maximumValue={60}
                    step={1}
                    value={timerValue}
                    onValueChange={handleSliderChange}
                    disabled={!timerEnabled}
                  />
                ) : (
                  <View
                    style={{
                      height: 40,
                      width: '100%',
                      backgroundColor: '#eee',
                      borderRadius: 20,
                      opacity: 0.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#bbb', fontWeight: 'bold' }}>Pas de timer</Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        {selectedTypes.length > 0 && length && (timerEnabled || timerEnabled === false) && (
          <>
            <View style={styles.settingRow}>
              <LabelWithTooltip
                label="Choisis la difficulté:"
                tooltip="Easy = tranquille. Difficile = pour les pros!"
                style={styles.label}
              />
              <Text style={styles.settingStat}>
                ×{diffMult.toFixed(1)}
              </Text>
            </View>
            <View style={styles.diffRow}>
              {DIFFICULTIES.map((d) => (
                <TouchableOpacity
                  key={d.key}
                  style={[
                    styles.diffCard,
                    difficulty === d.key && { backgroundColor: d.color, borderWidth: 2 },
                  ]}
                  onPress={() => setDifficulty(d.key)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.diffLabel}>{d.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.startBtn,
          canStart ? { backgroundColor: selectedDiff?.color } : { backgroundColor: '#ddd' },
        ]}
        disabled={!canStart}
        onPress={startChallenge}
        activeOpacity={canStart ? 0.8 : 1}
      >
        <SvgIcon name="rocket" size={22} color="#fff" style={{ margin: 8 }} />
        <Text style={styles.startText}>
          {canStart ? "Let's Go!" : 'Choisis tout!'}
        </Text>
      </TouchableOpacity>

      <HomeButton
        color="#ff9800"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3e0',
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 14,
    color: '#ff9800',
    textAlign: 'center',
  },
  stepLabel: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 14,
    marginBottom: 2,
    color: '#ff9800',
    textAlign: 'left',
    width: '100%',
    marginLeft: 8,
  },
  typeScroll: {
    width: '100%',
    marginBottom: 0,
  },
  typeScrollContent: {
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  typeCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 5,
    marginBottom: 0,
    width: 68,
    height: 68,
    elevation: 2,
    borderColor: '#eee',
    borderWidth: 1,
    overflow: 'hidden',
  },
  lengthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 4,
  },
  lengthCard: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginHorizontal: 4,
    elevation: 2,
    borderColor: '#aaa',
    borderWidth: 1,
  },
  lengthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 4,
  },
  timerCard: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginHorizontal: 4,
    elevation: 2,
    borderColor: '#aaa',
    borderWidth: 1,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  diffRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 8,
  },
  diffCard: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    marginHorizontal: 7,
    elevation: 2,
    borderColor: '#aaa',
    borderWidth: 1,
  },
  diffLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 22,
    marginTop: 24,
    marginBottom: 8,
    alignSelf: 'center',
    elevation: 3,
  },
  startText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  multiplierText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ff9800',
    marginBottom: 16,
  },
  settingRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  label: {
    flex: 1,
    marginRight: 8,
  },
  settingStat: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff9800',
    minWidth: 48,
    textAlign: 'right',
    alignSelf: 'center',
  },
  settingBlock: {
    width: '100%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  rangeText: {
    width: 40,
    textAlign: 'center',
    color: '#333',
  fontWeight: '600',
  },
  verticalScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
