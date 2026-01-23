// src/screens/LearnModeScreen.tsx

import React, { useState, useEffect }                            from 'react';
import { View, SectionList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createLevelInstance }                                   from '../logic/GameEngine';
import LevelCard                                                 from '../components/LevelCard';
import SvgIcon from '../components/SvgIcon';
import HomeButton                                                from '../components/HomeButton';
import { learnSections, LearnLevel, LearnSection }               from '../config/LearnModeConfig';
import { LevelSettings }                                         from '../config/LevelSettings';
import { firebaseAuth, firebaseDb }                              from '../firebase/FirebaseConfig';
import TutorialCard                                              from '../components/TutorialCard';

interface LevelProgress {
  answered: number;
  total:    number;
}

type ExpandedSections = Record<string, boolean>;
type VisibleLevels    = Record<string, number>;
type Tutorial         = NonNullable<LearnSection['tutorial']>;
type SectionItem =
  | { type: 'tutorial'; key: string; data: Tutorial }
  | { type: 'level';    key: string; data: LearnLevel }
  | { type: 'showMore'; key: string };

export default function LearnModeScreen({ navigation }: any) {
  const defaultMap: Record<number, LevelProgress> = {};
  learnSections.forEach(sec =>
    sec.levels.forEach(lvl => {type Tutorial = NonNullable<LearnSection['tutorial']>;
      defaultMap[lvl.level] = { answered: 0, total: lvl.questions.length };
    })
  );
  const [progressMap,  setProgressMap]  = useState(defaultMap);
  const [expanded,     setExpanded]     = useState<ExpandedSections>({});
  const [visibleCount, setVisibleCount] = useState<VisibleLevels>({});

  useEffect(() => {
    (async () => {
      const user = firebaseAuth.currentUser;
      if (!user) return;

      const map: Record<number, LevelProgress> = {};
      for (const sec of learnSections)
        for (const lvl of sec.levels) {
          const snapshot = await firebaseDb
            .collection('users').doc(user.uid)
            .collection('learnProgress').doc(sec.title)
            .collection('levels').doc(String(lvl.level))
            .collection('questions')
            .get();

          const answered = snapshot.docs.filter(d => d.data().correct).length;
          map[lvl.level] = { answered, total: lvl.questions.length };
        }
      setProgressMap(map);
    })();
  }, []);

  useEffect(() => {
    const initialExpanded: ExpandedSections = {};
    const initialVisible:  VisibleLevels    = {};
    learnSections.forEach(sec => {
      initialExpanded[sec.title] = false;
      initialVisible[sec.title]  = 3;
    });
    setExpanded(initialExpanded);
    setVisibleCount(initialVisible);
  }, []);

  const toggleSection = (title: string) => {
    setExpanded(prev => {
      const isCurrentlyOpen = prev[title];
      if (isCurrentlyOpen)
        setVisibleCount(vc => ({ ...vc, [title]: 3 }));
      return {
        ...prev,
        [title]: !isCurrentlyOpen,
      };
    });
  };

  const showMore = (title: string, total: number) => {
    setVisibleCount(prev => {
      const current = prev[title] || 3;
      const next    = Math.min(current + 3, total);
      return { ...prev, [title]: next };
    });
  };

  const handleLevelPress = (sectionTitle: string, level: LearnLevel) => {
    const settings: LevelSettings & { sectionTitle: String; levelNumber:  number } = {
      mode:              'learn',
      questionSource:    'manual',
      questionsPerLevel: level.questions.length,
      allowedOperations: level.operations,
      allowSkip:         true,
      allowNavigate:     true,
      manualQuestions:   level.questions,
      theme: {
        backgroundColor: '#e3f2fd',
        primaryColor:    '#2196f3',
        accentColor:     '#2196f3'
      },
      sectionTitle,
      levelNumber:       level.level,
      scoring: {
        correct:         0,
        incorrect:       0,
        streakBonus:     0,
        timeBonus:       0,
      },
    };
    const instance = createLevelInstance(settings);
    navigation.navigate('Game', { levelInstance: instance });
  };

  const sections = learnSections.map(sec => {
    const isOpen    = expanded[sec.title];
    const showCount = visibleCount[sec.title] || 3;

    const items: SectionItem[] = [];
    if (isOpen) {
      if (sec.tutorial) {
        items.push({
          type: 'tutorial',
          key:  `tutorial-${sec.title}`,
          data: sec.tutorial
        });
      }
      sec.levels.slice(0, showCount).forEach(lvl =>
        items.push({
          type: 'level',
          key:  `level-${sec.title}-${lvl.level}`,
          data: lvl
        })
      );
      if (showCount < sec.levels.length) {
        items.push({
          type: 'showMore',
          key:  `showMore-${sec.title}`
        });
      }
    }

    return {
      title:     sec.title,
      data:      items,
      allLevels: sec.levels
    };
  });

  const renderSectionHeader = ({ section: { title } }: any) => {
    const isOpen = expanded[title];
    return (
      <TouchableOpacity
        style={styles.sectionHeaderContainer}
        onPress={() => toggleSection(title)}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionHeader}>{title}</Text>
        <SvgIcon name={isOpen ? 'chevronUp' : 'chevronDown'} size={22} color="#2196f3" />
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, section}: {
    item:    SectionItem;
    section: { title: string; allLevels: LearnLevel[] };
  }) => {
    switch (item.type) {
      case 'tutorial':
        return (
          <TutorialCard
            title={item.data.title}
            onPress={() =>
              navigation.navigate('Tutorial', { tutorial: item.data })
            }
          />
        );

      case 'level': {
        const lvl       = item.data;
        const prog      = progressMap[lvl.level];
        const completed = !!prog && prog.answered === prog.total;
        return (
          <View
            style={[styles.levelWrapper, completed && styles.completedWrapper]}
          >
            <LevelCard
              sectionTitle={section.title}
              levelNumber={lvl.level}
              totalQuestions={lvl.questions.length}
              category={lvl.title}
              onPress={() => handleLevelPress(section.title, lvl)}
            />
            {completed && (
              <View style={styles.checkIcon}>
                <SvgIcon name="checkCircle" size={22} color="#2196f3" />
              </View>
            )}
          </View>
        );
      }

      case 'showMore':
        return (
          <TouchableOpacity
            style={[styles.levelWrapper, styles.showMoreBtn]}
            onPress={() => showMore(section.title, section.allLevels.length)}
            activeOpacity={0.85}
          >
            <Text style={styles.showMoreText}>Show More</Text>
            <SvgIcon name="chevronDown" size={18} color="#2196f3" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mode Apprentissage</Text>
      <SectionList
        sections={sections}
        keyExtractor={item => item.key}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        stickySectionHeadersEnabled={false}
      />
      <HomeButton color="#2196f3" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
  },
  levelWrapper: {
    margin: 8,
    position: 'relative',
  },
  completedWrapper: {
    borderWidth: 2,
    borderColor: '#2196f3',
    borderRadius: 12,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#2196f3',
    textAlign: 'center',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginLeft: 8,
    justifyContent: 'space-between',
    backgroundColor: '#e3f2fd',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 10,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2196f3',
    flex: 1,
  },
  checkIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  showMoreBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    alignItems: 'center',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 8,
    minHeight: 56,
  },
  showMoreText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2196f3',
  },
});
