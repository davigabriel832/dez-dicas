import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, AccessibilityInfo, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from './src/useSession';
import { drawCard, availableCards } from './src/deck';
import { CATEGORIES, bg, paper, textDim, textFaint } from './src/theme';
import SetupScreen from './src/SetupScreen';
import CardScreen from './src/CardScreen';
import ResultScreen from './src/ResultScreen';
import StatsScreen from './src/StatsScreen';

export default function App() {
  const { session, loaded, start, finishRound, reset, restartDeck } = useSession();
  const [screen, setScreen] = useState('setup');
  const [card, setCard] = useState(null);
  const [result, setResult] = useState(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
  }, []);

  useEffect(() => {
    if (loaded && session.started && screen === 'setup') draw(session);
  }, [loaded]);

  const label = session.selected.length
    ? CATEGORIES.filter((c) => session.selected.includes(c.key)).map((c) => c.label).join(' + ')
    : 'Baralho completo';

  function draw(s = session) {
    const next = drawCard(s.selected, s.usedIds);
    if (!next) { setScreen('empty'); return; }
    setCard(next);
    setScreen('card');
  }

  function onStart(selected) {
    start(selected);
    const next = drawCard(selected, []);
    setCard(next);
    setScreen('card');
  }

  function onFinish(clue, hit) {
    const points = hit ? 11 - (clue + 1) : 0;
    finishRound(card, clue, hit);
    setResult({ card, clue, hit, points });
    setScreen('result');
  }

  function onNext() {
    const s = {
      ...session,
      usedIds: [...session.usedIds, result.card.id],
    };
    const next = drawCard(s.selected, s.usedIds);
    if (!next) { setScreen('empty'); return; }
    setCard(next);
    setScreen('card');
  }

  if (!loaded) return <View style={{ flex: 1, backgroundColor: bg }} />;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {screen === 'setup' && (
          <SetupScreen onStart={onStart} initial={session.selected} />
        )}

        {screen === 'card' && card && (
          <CardScreen
            card={card}
            sessionLabel={label}
            score={session.score}
            rounds={session.rounds}
            onFinish={onFinish}
            reduceMotion={reduceMotion}
          />
        )}

        {screen === 'result' && result && (
          <ResultScreen
            {...result}
            score={session.score}
            rounds={session.rounds}
            onNext={onNext}
            onEnd={() => setScreen('stats')}
            reduceMotion={reduceMotion}
          />
        )}

        {screen === 'stats' && (
          <StatsScreen
            session={session}
            onRestart={() => { restartDeck(); setTimeout(() => draw({ ...session, usedIds: [] }), 0); }}
            onNewSession={() => { reset(); setScreen('setup'); }}
          />
        )}

        {screen === 'empty' && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Acabaram as cartas</Text>
            <Text style={styles.emptySub}>
              Você jogou tudo que havia em {label.toLowerCase()}.
            </Text>
            <Pressable
              style={styles.main}
              onPress={() => { restartDeck(); setTimeout(() => draw({ ...session, usedIds: [] }), 0); }}
            >
              <Text style={styles.mainText}>Reiniciar o baralho</Text>
            </Pressable>
            <Pressable style={styles.ghost} onPress={() => setScreen('stats')}>
              <Text style={styles.ghostText}>Ver o resultado da sessão</Text>
            </Pressable>
            <Pressable style={styles.ghost} onPress={() => { reset(); setScreen('setup'); }}>
              <Text style={styles.ghostText}>Escolher outras categorias</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyTitle: { color: paper, fontSize: 24, fontWeight: '600' },
  emptySub: { color: textDim, fontSize: 13.5, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  main: { backgroundColor: paper, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', marginTop: 26 },
  mainText: { color: bg, fontSize: 15, fontWeight: '600' },
  ghost: { height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  ghostText: { color: textFaint, fontSize: 13.5 },
});
