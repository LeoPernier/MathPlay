// src/screens/GameScreen.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SvgIcon from '../components/SvgIcon';
import        firestore                  from '@react-native-firebase/firestore';
import        BackButton                 from '../components/BackButton';
import      { NavigationControls }       from '../components/NavigationControls';
import      { firebaseAuth, firebaseDb } from '../firebase/FirebaseConfig';
import type { LevelSettings }            from '../config/LevelSettings';
import type { Question }                 from '../config/GameTypes';
import type { LevelInstance }            from '../logic/GameEngine';

interface GameScreenProps {
   route: { params: { levelInstance: LevelInstance; totalMultiplier: number } };
   navigation: any;
 }

export default function GameScreen({ route, navigation }: any) {
  const { levelInstance, totalMultiplier } = route.params as {
    levelInstance:   LevelInstance;
    totalMultiplier: number;
  };
  const { questions, settings } = levelInstance as LevelInstance & {
    questions: Question[];
    settings:  LevelSettings;
  };
  const theme        = settings.theme!;
  const accentColor  = theme.accentColor!;
  const primaryColor = theme.primaryColor!;
  const scoring      = settings.scoring!;

  const { sectionTitle, levelNumber } = settings as any;
  const levelId = `${sectionTitle}-${levelNumber}`;

  const { width }                               = Dimensions.get('window');
  const [currentIndex,     setCurrentIndex]     = useState(0);
  const [inputValue,       setInputValue]       = useState('');
  const [userAnswers,      setUserAnswers]      = useState<string[]>(Array(questions.length).fill(''));
  const [answeredStates,   setAnsweredStates]   = useState<(boolean | null)[]>(Array(questions.length).fill(null));
  const [answeredTimeLeft, setAnsweredTimeLeft] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [timers,           setTimers]           = useState<(number | null)[]>(Array(questions.length).fill(settings.timeLimitPerQuestion ?? null));
  const [timer,            setTimer]            = useState<number | null>(settings.timeLimitPerQuestion ?? null);
  const [timerActive,      setTimerActive]      = useState(false);
  const flatListRef                             = useRef<FlatList<any>>(null);
  const [score,            setScore]            = useState(0);
  const [combo,            setCombo]            = useState(0);
  const [isReviewMode,     setIsReviewMode]     = useState(false);
  const [showResults,      setShowResults]      = useState(false);
  const [resultsShown,     setResultsShown]     = useState(false);

  const colors = {
    correct:  '#4caf50',
    wrong:    '#f44336',
    inactive: '#bdbdbd'
  };
  const total = questions.length;

  useEffect(() => {
    if (settings.mode === 'challenge' && resultsShown) {
      recordChallengeResult();
    }
  }, [settings.mode, resultsShown]);

  async function recordChallengeResult() {
    const user = firebaseAuth.currentUser;
    if (!user) return;

    const correctCount    = answeredStates.filter(v => v === true).length;
    const accuracy        = correctCount / questions.length;
    const diffMap         = { easy: 1, medium: 2, hard: 3 } as Record<string, number>;
    const difficultyScore = (diffMap[settings.difficulty!] || 1) * totalMultiplier;

    const gameData = {
      timestamp:         firestore.FieldValue.serverTimestamp(),
      points:            score,
      accuracy,
      difficultyScore,
      settings: {
        difficulty:           settings.difficulty,
        questions:            questions.length,
        timeLimitPerQuestion: settings.timeLimitPerQuestion ?? null,
        operations:           settings.allowedOperations,
        composite:            settings.compositeSettings,
        totalMultiplier,
      }
    };

    const progressDocRef = firebaseDb
      .collection('users').doc(user.uid)
      .collection('challengeProgress').doc('stats');
    const gamesRef = progressDocRef.collection('games');
    await gamesRef.add(gameData);
    await firebaseDb.runTransaction(async tx => {
      const snap = await tx.get(progressDocRef);
      const data = snap.exists() ? snap.data()! : {};

      const newLifetime = (data.lifetimePoints || 0) + score;

      const byDifficulty = {
        easy:   (data.byDifficulty?.easy   || 0) + (settings.difficulty === 'easy'   ? score : 0),
        medium: (data.byDifficulty?.medium || 0) + (settings.difficulty === 'medium' ? score : 0),
        hard:   (data.byDifficulty?.hard   || 0) + (settings.difficulty === 'hard'   ? score : 0),
      };

      const newTimed = settings.timeLimitPerQuestion != null
        ? (data.lifetimeTimedPoints || 0) + score
        : (data.lifetimeTimedPoints || 0);

      const ops   = settings.allowedOperations;
      const perOp = score / ops.length;
      const byOp: Record<string, number> = { ...(data.byOperation || {}) };
      ops.forEach(op => {
        const key = ({ '+':'addition','-':'subtraction','*':'multiplication','/':'division','%':'modulo' } as any)[op];
        byOp[key] = (byOp[key] || 0) + perOp;
      });

      const hardestUpdate = (accuracy === 1 &&
        (!data.hardestGame || difficultyScore > data.hardestGame.difficultyScore))
        ? {
            hardestGame: {
              points:           score,
              accuracy,
              difficultyScore,
              timestamp:        firestore.FieldValue.serverTimestamp(),
              settings:         gameData.settings
            }
          }
        : {};

      const existingBest = data.bestGame;
      const bestUpdate   = !existingBest || score > existingBest.points
          ? gameData
          : existingBest;

      tx.set(progressDocRef, {
        lifetimePoints:      newLifetime,
        byDifficulty,
        lifetimeTimedPoints: newTimed,
        byOperation:         byOp,
        bestGame:            bestUpdate,
        ...hardestUpdate
      }, { merge: true });

    });
  }

  useEffect(() => {
  if (settings.mode === 'learn') {
    const user    = firebaseAuth.currentUser;
    const section = (settings as any).sectionTitle;
    const lvlNum  = (settings as any).levelNumber;
    if (!user) return;

    firebaseDb
      .collection('users').doc(user.uid)
      .collection('learnProgress').doc(section)
      .collection('levels').doc(String(lvlNum))
      .collection('questions')
      .get()
        .then(snapshot => {
          const loadedAnswers = [...answeredStates];
          let allAnswered = true;
          snapshot.forEach(doc => {
            const data = doc.data() as {
              questionId: string;
              correct:    boolean;
              answer?:    string;
            };
            const idx = questions.findIndex(q => q.id === data.questionId);
            if (idx >= 0) {
              loadedAnswers[idx] = data.correct;
              setUserAnswers(prev => {
                const arr = [...prev];
                arr[idx]  = data.answer ?? '';
                return arr;
              });
            }
          });
          allAnswered = loadedAnswers.every(v => v !== null);
          setIsReviewMode(allAnswered);
          setAnsweredStates(loadedAnswers);
        })
        .catch(err => console.error('Error loading partial progress', err));
    }
  }, []);

  useEffect(() => {
    if (
      answeredStates.every(v => v !== null) &&
      answeredStates.length > 0 &&
      !isReviewMode &&
      !resultsShown
    ) {
      setShowResults(true);
      setResultsShown(true);
    }
  }, [answeredStates, isReviewMode, resultsShown]);

  useEffect(() => {
    setCurrentIndex(0);
    setInputValue('');
    setUserAnswers(Array(questions.length).fill(''));
    setAnsweredStates(Array(questions.length).fill(null));
    setAnsweredTimeLeft(Array(questions.length).fill(null));
    setTimers(Array(questions.length).fill(settings.timeLimitPerQuestion ?? null));
    setTimer(settings.timeLimitPerQuestion ?? null);
    setTimerActive(false);
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });
  }, [questions]);

  useEffect(() => {
    const timeLimit = settings.timeLimitPerQuestion;
    if (timeLimit != null) {
      setTimers(prev => {
        const arr = [...prev];
        if (arr[currentIndex] === null) {
          arr[currentIndex] = timeLimit;
        }
        return arr;
      });
      setTimerActive(answeredStates[currentIndex] === null);
    } else {
      setTimerActive(false);
    }
    setInputValue(userAnswers[currentIndex] || '');
  }, [currentIndex]);

  useEffect(() => {
    setTimer(timers[currentIndex]);
  }, [timers, currentIndex]);

  useEffect(() => {
    if (!timerActive || timer === null || answeredStates[currentIndex] !== null) return;
    if (timer <= 0) {
      handleTimeUp();
      return;
    }
    const id = setTimeout(() => {
      setTimers(prev => {
        const arr = [...prev];
        arr[currentIndex] = (arr[currentIndex] ?? 1) - 1;
        return arr;
      });
    }, 1000);
    return () => clearTimeout(id);
  }, [timerActive, timer, currentIndex, answeredStates]);

  const handleTimeUp = () => {
    if (!timerActive) return;
    setTimerActive(false);
    handleAnswer(inputValue.trim());
  };

  async function handleAnswer(ans: string): Promise<void> {
    if (answeredStates[currentIndex] !== null) return;

    const timeLeft = timer ?? 0;
    const maxTime  = settings.timeLimitPerQuestion ?? (timeLeft || 1);

    const currentQuestion: Question = questions[currentIndex];
    const trimmed                   = ans.trim();
    const isCorrect                 = trimmed === currentQuestion.answer.trim();

    setUserAnswers(prev => {
      const arr         = [...prev];
      arr[currentIndex] = trimmed;
      return arr;
    });
    setAnsweredStates(prev => {
      const arr         = [...prev];
      arr[currentIndex] = isCorrect;
      return arr;
    });
    if (settings.timeLimitPerQuestion)
      setAnsweredTimeLeft(prev => {
        const arr         = [...prev];
        arr[currentIndex] = timer ?? 0;
        return arr;
      });

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);

      const streakMult = 1 + (newCombo - 1) * scoring.streakBonus!;
      const speedMult  = 1 + (timeLeft / maxTime) * scoring.timeBonus!;
      const pts        = Math.round(scoring.correct * streakMult * speedMult);
      setScore(prev => prev + pts);
    } else
      setCombo(0);

    setTimerActive(false);
    setInputValue('');
    Keyboard.dismiss();

    if (settings.mode === 'learn') {
      const user = firebaseAuth.currentUser;
      if (!user) {
        console.error('[Learn] Erreur: Pas d\'utilisateur!');
        return;
      }

      const section = (settings as any).sectionTitle;
      const lvlNum  = (settings as any).levelNumber;
      const q       = questions[currentIndex];
      const qRef    = firebaseDb
        .collection('users').doc(user.uid)
        .collection('learnProgress').doc(section)
        .collection('levels').doc(String(lvlNum))
        .collection('questions').doc(q.id);
      try {
        await qRef.set({
          questionId:   q.id,
          questionText: q.questionText,
          correct:      isCorrect,
          answer:       trimmed,
          answeredAt:   firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.error('[Learn] Erreur: Echec d\'ecriture!', err);
      }
    }
  }

  const goto = (idx: number) => {
    if (idx < 0 || idx >= questions.length) return;
    flatListRef.current?.scrollToIndex({ index: idx, animated: true });
    setCurrentIndex(idx);
    setInputValue(userAnswers[idx] || '');
  };
  
  const maxPerRow = 10;
  const dotRows: (boolean|null)[][] = [];
  for (let i = 0; i < answeredStates.length; i += maxPerRow)
    dotRows.push(answeredStates.slice(i, i + maxPerRow));

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <BackButton onPress={() => navigation.goBack()} />

      {isReviewMode && (
        <View style={styles.reviewModeContainer}>
          <Text style={styles.reviewModeText}>
            REVIEW MODE
          </Text>
        </View>
      )}

      <View style={styles.progressContainer}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{currentIndex + 1}/{total}</Text>
        </View>
        <View style={styles.dotRowsContainer}>
          {dotRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.dotRow}>
              {row.map((v, i) => (
                <View
                  key={rowIndex * maxPerRow + i}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        v === true
                          ? colors.correct
                          : v === false
                            ? colors.wrong
                            : colors.inactive,
                    },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>

        {settings.timeLimitPerQuestion && (
          <View style={styles.timerBox}>
            <SvgIcon name="stopwatch" size={22} color="#666" />
            <Text
              style={[
                styles.timerText,
                timer !== null && timer <= 5 ? styles.timerUrgent : undefined
              ]}
            >
              {timer !== null ? timer : ''}
            </Text>
          </View>
        )}
        {settings.mode !== 'learn' && (
          <View style={styles.scoreRow}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.comboText}>Combo: {combo}</Text>
          </View>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={questions}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
          setInputValue(userAnswers[idx] || '');
        }}
        renderItem={({ item, index }) => (
          <View style={[styles.card, { width }]}>
            <Text style={[styles.question, { color: theme.accentColor }]}>
              {item.questionText}
            </Text>
            
            {answeredStates[index] !== null ? (
              <>
                <SvgIcon name={answeredStates[index] ? 'checkCircle' : 'xCircle'} size={48} color={answeredStates[index] ? colors.correct : colors.wrong} style={styles.completedIcon} />
                <Text style={styles.answerText}>
                  Your answer: {userAnswers[index]}
                </Text>
                {!answeredStates[index] && (
                  <Text style={styles.answerText}>
                    Correct answer: {item.answer}
                  </Text>
                )}
                {settings.timeLimitPerQuestion && answeredTimeLeft[index] !== null && (
                  <Text style={styles.timeLeftText}>
                    Time left: {answeredTimeLeft[index]}s
                  </Text>
                )}
              </>
            ) : item.type === 'input' ? (
              <>
                <TextInput
                  style={[styles.input, { borderColor: theme.primaryColor }]}
                  keyboardType="number-pad"
                  value={index === currentIndex ? inputValue : userAnswers[index] || ''}
                  onChangeText={setInputValue}
                  placeholder="Your answer..."
                  editable={!isReviewMode && (settings.timeLimitPerQuestion ? timerActive : true) && index === currentIndex}
                  onSubmitEditing={() => handleAnswer(inputValue)}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={() => handleAnswer(inputValue)}
                  style={[styles.btn, { backgroundColor: theme.primaryColor }]}
                  disabled={settings.timeLimitPerQuestion ? !timerActive : false}
                >
                  <Text style={styles.btnText}>Check</Text>
                </TouchableOpacity>
              </>
            ) : (
              item.options?.map((opt: string) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => handleAnswer(opt)}
                  style={[
                    styles.btn,
                    {
                      borderColor: accentColor,
                      marginVertical: 4,
                      backgroundColor: '#fff'
                    }
                  ]}
                  disabled={settings.timeLimitPerQuestion ? !timerActive : false}
                >
                  <Text style={{ color: accentColor }}>{opt}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      />

      {showResults && (
        <View style={{
          position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }}>
          <View style={{ backgroundColor: '#fff', padding: 32, borderRadius: 18, minWidth: '70%' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#111' }}>Level Results</Text>
            {questions.map((q, idx) => (
              <View key={q.id} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 16, color: '#111' }}>{q.questionText}</Text>
                <Text style={{ fontWeight: 'bold', color: answeredStates[idx] ? '#4caf50' : '#f44336' }}>
                  {answeredStates[idx] ? 'Correct' : 'Incorrect'}
                </Text>
                <Text style={{ color: '#111' }}>Your answer: {userAnswers[idx]}</Text>
                {!answeredStates[idx] && (
                  <Text style={{ color: '#111' }}>Correct answer: {q.answer}</Text>
                )}
              </View>
            ))}
            <TouchableOpacity
              style={{
                marginTop: 24, backgroundColor: theme.primaryColor,
                paddingVertical: 12, borderRadius: 10, alignItems: 'center'
              }}
              onPress={() => {
                setShowResults(false);
                navigation.goBack();
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {settings.allowNavigate && (
        <NavigationControls
          onPrev={() => goto(currentIndex - 1)}
          onNext={() => goto(currentIndex + 1)}
          canPrev={currentIndex > 0}
          canNext={currentIndex < questions.length - 1}
          accentColor={accentColor}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 4,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  question: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    width: 140,
    textAlign: 'center',
    marginBottom: 14,
    padding: 10,
    borderRadius: 8,
    fontSize: 22,
    backgroundColor: '#fff',
    color: '#111',
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  completedIcon: {
    marginVertical: 12
  },
  answerText: {
    fontSize: 18,
    marginTop: 8,
    color: '#333'
  },
  progressContainer: {
    position: 'absolute',
    top: 32,
    right: 18,
    alignItems: 'center',
    zIndex: 100,
  },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.14,
    shadowRadius: 2,
  },
  bubbleText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 8,
    color: '#1976d2',
  },
  timerUrgent: {
    color: '#d32f2f',
  },
  timeLeftText: {
    fontSize: 16,
    color: '#ff9800',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
    color: '#333',
  },
  comboText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dotRowsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  dotRow: {
    flexDirection: 'row',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 3,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  reviewModeContainer: {
    position: 'absolute',
    top: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 200,
  },
  reviewModeText: {
    backgroundColor: '#fbeee6',
    color: '#b26a00',
    fontWeight: 'bold',
    fontSize: 16,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#ffe0b2',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 1,
    letterSpacing: 1.2,
  },
});
