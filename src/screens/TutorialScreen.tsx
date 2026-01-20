// src/screens/TutorialScreen.tsx

import React from 'react';
import { SafeAreaView, View, ScrollView, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import BackButton from '../components/BackButton';

interface TutorialParams {
  tutorial: {
    id:      string;
    title:   string;
    content: string[];
  };
}

interface TutorialScreenProps {
  navigation: any;
  route:      { params: TutorialParams };
}

export default function TutorialScreen({ navigation, route }: TutorialScreenProps) {
  const { tutorial } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleContainer}>
          <View style={styles.titleLine} />
          <Text style={styles.title}>{tutorial.title}</Text>
          <View style={styles.titleLine} />
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {tutorial.content.map((block, idx) => (
            <Text key={idx} style={styles.paragraph}>
              {block}
            </Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const HEADER_HEIGHT = 80;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    justifyContent: 'center',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  body: {
    flex: 1,
    marginTop: HEADER_HEIGHT,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
  },
  titleLine: {
    height: 2,
    backgroundColor:  '#2196f3',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2196f3',
    textAlign: 'center',
    textTransform: 'capitalize',
    letterSpacing: 1,
    marginVertical: 8,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
    textAlign: 'justify',
  },
});
