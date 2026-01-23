// src/screens/StatsScreen.tsx

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import SvgIcon from '../components/SvgIcon';
import HomeButton                      from '../components/HomeButton';
import { firebaseAuth, firebaseDb }    from '../firebase/FirebaseConfig';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { learnSections }               from '../config/LearnModeConfig';
import type { Operation }              from '../config/GameTypes';
import type { CompositeSettings }      from '../config/LevelSettings';

interface BestTime {
  level: number;
  time:  string;
}

interface LevelStats {
  section:        string;
  level:          number;
  states:         (boolean | null)[];
  total:          number;
  lastAnsweredAt: Date | null;
}

interface ChallengeGame {
  id:                     string;
  points:                 number;
  accuracy:               number;
  timestamp:              FirebaseFirestoreTypes.Timestamp;
  difficultyScore:        number;
  settings: {
    difficulty:           string;
    questions:            number;
    timeLimitPerQuestion: number | null;
    operations:           Operation[];
    composite:            CompositeSettings;
    totalMultiplier:      number;
  };
}

export default function StatsScreen({ navigation }: any) {
  const [userName,             setUserName]             = useState('');
  const [userEmail,            setUserEmail]            = useState('');
  const [lifetimePoints,       setLifetimePoints]       = useState<number>(0);
  const [lifetimePointsEasy,   setLifetimePointsEasy]   = useState<number>(0);
  const [lifetimePointsMedium, setLifetimePointsMedium] = useState<number>(0);
  const [lifetimePointsHard,   setLifetimePointsHard]   = useState<number>(0);
  const [lifetimeTimedPoints,  setLifetimeTimedPoints]  = useState<number>(0);
  const [lifetimePointsByOp,   setLifetimePointsByOp]   = useState<Record<string,number>>({});
  const [bestGame,             setBestGame]             = useState<any>(null);
  const [hardestGame,          setHardestGame]          = useState<any>(null);
  const [lastGames,            setLastGames]            = useState<ChallengeGame[]>([]);
  const [last10Sum,            setLast10Sum]            = useState<number>(0);
  const [levelStats,           setLevelStats]           = useState<LevelStats[]>([]);
  const [loadingLearn,         setLoadingLearn]         = useState(true);
  const [challengeOpen,        setChallengeOpen]        = useState(false);
  const [last10Open,           setLast10Open]           = useState(false);
  const [bestGameOpen,         setBestGameOpen]         = useState(false);
  const [learnOpen,            setLearnOpen]            = useState(false);
  const [levelOpenMap,         setLevelOpenMap]         = useState<Record<string, boolean>>({});
  const [gameOpenMap,          setGameOpenMap]          = useState<Record<string,boolean>>({});

  useEffect(() => {
    const u = firebaseAuth.currentUser;
    if (!u) return;

    setUserName(u.displayName  || '');
    setUserEmail(u.email       || '');

    const progressDocRef = firebaseDb
      .collection('users').doc(u.uid)
      .collection('challengeProgress').doc('stats');

    progressDocRef.get().then(doc => {
      const s = doc.data()                           || {};
      setLifetimePoints(s.lifetimePoints             || 0);
      setLifetimePointsEasy(s.byDifficulty?.easy     || 0);
      setLifetimePointsMedium(s.byDifficulty?.medium || 0);
      setLifetimePointsHard(s.byDifficulty?.hard     || 0);
      setLifetimeTimedPoints(s.lifetimeTimedPoints   || 0);
      setLifetimePointsByOp(s.byOperation            || {});
      setBestGame(s.bestGame                         || null);
      setHardestGame(s.hardestGame                   || null);
    }).catch(console.error);

    const gamesRef = progressDocRef.collection('games');
    gamesRef
      .orderBy('timestamp','desc')
      .limit(10)
      .get()
      .then((snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ChallengeGame[];
        setLastGames(docs);
        setLast10Sum(docs.reduce((acc, g) => acc + g.points, 0));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const u = firebaseAuth.currentUser;
    if (!u) return;

    (async () => {
      const stats: LevelStats[] = [];
      for (const sec of learnSections) {
        for (const lvl of sec.levels) {
          const snap = await firebaseDb
            .collection('users').doc(u.uid)
            .collection('learnProgress').doc(sec.title)
            .collection('levels').doc(String(lvl.level))
            .collection('questions')
            .get();
          if (snap.empty) continue;

          const total = lvl.questions.length;
          const states: (boolean | null)[] = Array(total).fill(null);
          const times:  number[] = [];
          snap.forEach(doc => {
            const data = doc.data();
            const idx  = parseInt(data.questionId, 10) - 1;
            if (idx >= 0 && idx < total) {
              states[idx] = data.correct;
              if (data.answeredAt?.toDate)
                times.push(data.answeredAt.toDate().getTime());
            }
          });
          const lastAnsweredAt = times.length
            ? new Date(Math.max(...times))
            : null;

          stats.push({
            section: sec.title,
            level:   lvl.level,
            states,
            total,
            lastAnsweredAt
          });
        }
      }
      setLevelStats(stats);
      setLoadingLearn(false);
    })();
  }, []);

  const hasChallenge = lastGames.length > 0 || bestGame;
  const hasLearn     = levelStats.length > 0;

  const toggleGame = (id: string) =>
    setGameOpenMap(m => ({ ...m, [id]: !m[id] }));

  const toggleAllLevels = (secTitle: string, open: boolean) => {
    const updated: Record<string, boolean> = {};
    levelStats
      .filter(ls => ls.section === secTitle)
      .forEach(ls => {
        updated[`${secTitle}-${ls.level}`] = open;
      });
    setLevelOpenMap(prev => ({ ...prev, ...updated }));
  };

  const toggleLevel = (sec: string, lvl: number) => {
    const key = `${sec}-${lvl}`;
    setLevelOpenMap(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const formatDate = (d: Date) =>
    d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });

  const learnSummary = useMemo(() => {
    const total         = levelStats.reduce((sum, ls) => sum + ls.total, 0);
    const correct       = levelStats.reduce((sum, ls) => sum + ls.states.filter(v => v === true).length, 0);
    const wrong         = levelStats.reduce((sum, ls) => sum + ls.states.filter(v => v === false).length, 0);
    const answered      = correct + wrong;
    const unanswered    = total   - answered;
    const totalLevels   = learnSections.reduce((sum, sec) => sum + sec.levels.length, 0);
    const playedLevels  = levelStats.length;
    const perfectLevels = levelStats.reduce((sum, ls) => sum + (ls.states.filter(v => v === true).length === ls.total ? 1 : 0), 0);
    return { total, answered, correct, wrong, unanswered, totalLevels, playedLevels, perfectLevels };
  }, [levelStats]);

  const operationLabels: Record<string,string> = {
    addition:       'Addition',
    subtraction:    'Soustraction',
    multiplication: 'Multiplication',
    division:       'Division',
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <SvgIcon name="user" size={80} color="#9c27b0" />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 20 }}>
        {hasChallenge && (
          <View style={styles.sectionContainer}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setChallengeOpen(o => !o)}
            >
              <SvgIcon name="trophy" size={22} color="#9c27b0" />
              <Text style={styles.sectionTitle}>Mode Défi</Text>
              <SvgIcon name={challengeOpen ? 'chevronUp' : 'chevronDown'} size={20} color="#9c27b0" />
            </TouchableOpacity>

            {challengeOpen && (
              <View style={styles.sectionBox}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Points cumulés</Text>
                  <Text style={styles.statValue}>{lifetimePoints}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Points chronométrés</Text>
                  <Text style={styles.statValue}>{lifetimeTimedPoints}</Text>
                </View>
                <View style={styles.separator} />

                <View style={styles.subSectionHeaderStatic}>
                  <Text style={styles.subHeader}>Points cumulés par difficulté</Text>
                </View>
                <View style={styles.subSectionBox}>
                  <View style={styles.matrixContainer}>
                    {[
                      ['Facile',    lifetimePointsEasy],
                      ['Moyen',     lifetimePointsMedium],
                      ['Difficile', lifetimePointsHard],
                    ].map(([label, value]) => (
                      <View key={label} style={styles.matrixCell}>
                        <Text style={styles.matrixLabel}>{label}</Text>
                        <Text style={styles.matrixValue}>{value}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.subSectionHeaderStatic}>
                  <Text style={styles.subHeader}>Points par type</Text>
                </View>
                <View style={styles.subSectionBox}>
                  <View style={styles.matrixContainer}>
                    {Object.entries(lifetimePointsByOp).map(([op, pts]) => (
                      <View key={op} style={styles.matrixCell}>
                        <Text style={styles.matrixLabel}>
                          {operationLabels[op] || op}
                        </Text>
                        <Text style={styles.matrixValue}>{Math.round(pts)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.separator} />

                {bestGame && (
                  <>
                    <View style={styles.subSectionHeaderStatic}>
                      <Text style={styles.subHeader}>Meilleure partie</Text>
                    </View>

                    <View style={styles.levelContainer}>
                      <TouchableOpacity
                        style={styles.levelHeader}
                        onPress={() => setBestGameOpen(o => !o)}
                      >
                        <Text style={styles.levelText}>
                          {new Date(bestGame.timestamp.seconds * 1000).toLocaleDateString()}
                        </Text>
                        <Text style={styles.summaryText}>
                          {bestGame.points} pts · {(bestGame.accuracy * 100).toFixed(0)}%
                        </Text>
                        <SvgIcon name={bestGameOpen ? 'chevronUp' : 'chevronDown'} size={16} color="#6a1b9a" />
                      </TouchableOpacity>

                      {bestGameOpen && (
                        <View style={styles.detailBox}>
                          <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Précision</Text>
                            <Text style={styles.statValue}>
                              {(bestGame.accuracy * 100).toFixed(0)}%
                            </Text>
                          </View>
                          <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Indice de difficulté</Text>
                            <Text style={styles.statValue}>
                              {bestGame.difficultyScore.toFixed(1)}
                            </Text>
                          </View>
                          <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Multiplicateur</Text>
                            <Text style={styles.statValue}>
                              {bestGame.settings.totalMultiplier.toFixed(2)}
                            </Text>
                          </View>
                          <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Questions</Text>
                            <Text style={styles.statValue}>
                              {bestGame.settings.questions}
                            </Text>
                          </View>
                          <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Chrono</Text>
                            <Text style={styles.statValue}>
                              {bestGame.settings.timeLimitPerQuestion ?? 'Aucun'}
                            </Text>
                          </View>
                          <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Opérations</Text>
                            <Text style={styles.statValue}>
                              {bestGame.settings.operations
                                .map((op: Operation) => operationLabels[op] || op)
                                .join(', ')}
                            </Text>
                          </View>
                          <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Composite</Text>
                            <Text style={styles.statValue}>
                              {bestGame.settings.composite.enabled
                                ? `${bestGame.settings.composite.minOperands}–${bestGame.settings.composite.maxOperands}`
                                : 'Non'}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </>
                )}

                <TouchableOpacity
                  style={styles.subSectionHeader}
                  onPress={() => setLast10Open(open => !open)}
                >
                  <Text style={styles.subHeader}>10 dernières parties</Text>
                  <SvgIcon name={last10Open ? 'chevronUp' : 'chevronDown'} size={20} color="#6a1b9a" />
                </TouchableOpacity>

                {last10Open && (
                  <View style={styles.subSectionBox}>
                    {lastGames.map(g => {
                      const isOpen = !!gameOpenMap[g.id];
                      return (
                        <View key={g.id} style={styles.levelContainer}>
                          <TouchableOpacity
                            style={styles.levelHeader}
                            onPress={() => toggleGame(g.id)}
                          >
                            <Text style={styles.levelText}>
                              {new Date(g.timestamp.seconds * 1000).toLocaleDateString()}
                            </Text>
                            <Text style={styles.summaryText}>
                              {g.points} pts · {(g.accuracy * 100).toFixed(0)}%
                            </Text>
                            <SvgIcon name={isOpen ? 'chevronUp' : 'chevronDown'} size={16} color="#6a1b9a" />
                          </TouchableOpacity>

                          {isOpen && (
                            <View style={styles.detailBox}>
                              <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Précision</Text>
                                <Text style={styles.statValue}>
                                  {(g.accuracy * 100).toFixed(0)}%
                                </Text>
                              </View>
                              <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Indice de difficulté</Text>
                                <Text style={styles.statValue}>
                                  {g.difficultyScore.toFixed(1)}
                                </Text>
                              </View>
                              <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Multiplicateur</Text>
                                <Text style={styles.statValue}>
                                  {g.settings.totalMultiplier.toFixed(2)}
                                </Text>
                              </View>
                              <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Questions</Text>
                                <Text style={styles.statValue}>
                                  {g.settings.questions}
                                </Text>
                              </View>
                              <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Chrono</Text>
                                <Text style={styles.statValue}>
                                  {g.settings.timeLimitPerQuestion ?? 'Aucun'}
                                </Text>
                              </View>
                              <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Opérations</Text>
                                <Text style={styles.statValue}>
                                  {g.settings.operations
                                    .map(op => operationLabels[op] || op)
                                    .join(', ')}
                                </Text>
                              </View>
                              <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Composite</Text>
                                <Text style={styles.statValue}>
                                  {g.settings.composite.enabled
                                    ? `${g.settings.composite.minOperands}–${g.settings.composite.maxOperands}`
                                    : 'Non'}
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}

              </View>
            )}
          </View>
        )}

        {hasLearn && (
          <View style={styles.sectionContainer}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setLearnOpen(o => !o)}
            >
              <SvgIcon name="graduationCap" size={22} color="#9c27b0" />
              <Text style={styles.sectionTitle}>Mode Apprentissage</Text>
              <SvgIcon name={learnOpen ? 'chevronUp' : 'chevronDown'} size={20} color="#9c27b0" style={styles.chevron} />
            </TouchableOpacity>
            {learnOpen && (
              <View style={styles.sectionBox}>
                {loadingLearn ? (
                  <ActivityIndicator size="small" color="#2196f3" />
                ) : (
                  <>
                    <View style={styles.globalStatsContainer}>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Niveaux joués</Text>
                        <Text style={styles.statValue}>
                          {learnSummary.playedLevels}/{learnSummary.totalLevels}
                        </Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Niveaux parfaits</Text>
                        <Text style={styles.statValue}>{learnSummary.perfectLevels}</Text>
                      </View>
                      <View style={styles.separator} />
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Nombre total de questions</Text>
                        <Text style={styles.statValue}>{learnSummary.total}</Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Répondues</Text>
                        <Text style={styles.statValue}>{learnSummary.answered}</Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Correctes</Text>
                        <Text style={styles.statValue}>{learnSummary.correct}</Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Incorrectes</Text>
                        <Text style={styles.statValue}>{learnSummary.wrong}</Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Non répondues</Text>
                        <Text style={styles.statValue}>{learnSummary.unanswered}</Text>
                      </View>
                    </View>

                    {learnSections.map(sec => {
                      const levels = levelStats.filter(s => s.section === sec.title);
                      if (!levels.length) return null;
                      const allOpen = levels.every(
                        ls => levelOpenMap[`${ls.section}-${ls.level}`]
                      );
                      return (
                        <View key={sec.title} style={styles.subSection}>
                          <TouchableOpacity
                            style={styles.subSectionHeader}
                            onPress={() => toggleAllLevels(sec.title, !allOpen)}
                          >
                            <Text style={styles.subTitle}>{sec.title}</Text>
                            <SvgIcon name={allOpen ? 'chevronUp' : 'chevronDown'} size={16} color="#2196f3" style={styles.subSectionChevron} />
                          </TouchableOpacity>
                          {levels.map(ls => {
                            const key             = `${ls.section}-${ls.level}`;
                            const answered        = ls.states.filter(v => v !== null).length;
                            const correctCount    = ls.states.filter(v => v === true).length;
                            const wrongCount      = ls.states.filter(v => v === false).length;
                            const unansweredCount = ls.states.filter(v => v === null).length;
                            const pct             = Math.round((answered / ls.total) * 100);
                            const allCorrect      = correctCount === ls.total;
                            return (
                              <View key={key} style={styles.levelContainer}>
                                <TouchableOpacity
                                  style={styles.levelHeader}
                                  onPress={() => toggleLevel(ls.section, ls.level)}
                                >
                                  <Text style={styles.levelText}>Niveau {ls.level}</Text>
                                  {allCorrect && (
                                    <SvgIcon name="star" size={18} color="#FFD700" />
                                  )}
                                  <SvgIcon name={levelOpenMap[key] ? 'chevronUp' : 'chevronDown'} size={16} color="#9c27b0" style={styles.levelChevron} />
                                </TouchableOpacity>
                                {levelOpenMap[key] && (
                                  <>
                                    <View style={styles.summaryRow}>
                                      <Text style={styles.summaryText}>{pct}% complété</Text>
                                      <Text style={styles.summaryText}>
                                        {correctCount}/{ls.total} correctes
                                      </Text>
                                    </View>
                                    <View style={styles.progressBarTrack}>
                                      <View
                                        style={[styles.progressBarFill, { width: `${pct}%` }]}   
                                      />
                                    </View>
                                    <View style={styles.countsRow}>
                                      <View style={styles.countItem}>
                                        <SvgIcon name="checkCircle" size={16} color="#4caf50" />
                                        <Text style={styles.countText}>{correctCount}</Text>
                                      </View>
                                      <View style={styles.countItem}>
                                        <SvgIcon name="xCircle" size={16} color="#f44336" />
                                        <Text style={styles.countText}>{wrongCount}</Text>
                                      </View>
                                      <View style={styles.countItem}>
                                        <SvgIcon name="help" size={16} color="#bdbdbd" />
                                        <Text style={styles.countText}>{unansweredCount}</Text>
                                      </View>
                                    </View>
                                    {ls.lastAnsweredAt && (
                                      <Text style={styles.lastAnswered}>
                                        Dernière réponse : {formatDate(ls.lastAnsweredAt)}
                                      </Text>
                                    )}
                                    <View style={styles.dotsContainer}>
                                      {ls.states.map((v, i) => (
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
                                  </>
                                )}
                              </View>
                            );
                          })}
                        </View>
                      );
                    })}
                  </>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <HomeButton color="#9c27b0" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const DOT_SIZE = 8;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e5f5',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e1bee7',
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4a148c',
  },
  userEmail: {
    fontSize: 14,
    color: '#7b1fa2',
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9c27b0',
    marginLeft: 8,
    flex: 1,
  },
  chevron: {
    marginLeft: 12,
  },
  sectionBox: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 1,
    marginTop: 4,
  },
  statText: {
    fontSize: 16,
    color: '#4a148c',
    marginBottom: 8,
  },
  highlight: {
    fontWeight: '700',
    color: '#7b1fa2',
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6a1b9a',
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    flexWrap: 'wrap',
  },
  timeLabel: {
    flex: 1,
    color: '#4a148c',
  },
  timeValue: {
    flex: 1,
    color: '#7b1fa2',
  },
  subSection: {
    marginBottom: 12,
  },
  subSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196f3',
  },
  subSectionChevron: {
    marginLeft: 8,
  },
  levelContainer: {
    marginBottom: 12,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 8,
    elevation: 1,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  levelChevron: {
    marginLeft: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryText: {
    fontSize: 12,
    color: '#555',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  countsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 4,
  },
  countItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  countText: {
    marginLeft: 4,
    color: '#333',
  },
  lastAnswered: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
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
  globalStatsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statLabel: {
    fontSize: 16,
    color: '#4a148c',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7b1fa2',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  subSectionBox: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  matrixContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  matrixCell: {
    alignItems: 'center',
    flex: 1,
  },
  matrixLabel: {
    fontSize: 14,
    color: '#555',
  },
  matrixValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7b1fa2',
  },
  detailBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fafafa',
    borderRadius: 6,
    marginTop: 4,
  },
  subSectionHeaderStatic: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
});
