import React, { useMemo, useRef, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, PanResponder, useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, catOf, bg, line, textDim, textFaint, paper } from './theme';

function Redacted({ text, color, size }) {
  const words = useMemo(() => text.split(' '), [text]);
  return (
    <View style={styles.redactRow}>
      {words.map((w, i) => (
        <View
          key={i}
          style={{
            width: Math.max(10, w.length * size * 0.46),
            height: size * 0.62,
            borderRadius: size * 0.31,
            backgroundColor: color,
            opacity: 0.28,
            marginRight: 5,
            marginVertical: 2,
          }}
        />
      ))}
    </View>
  );
}

export default function CardScreen({ card, sessionLabel, score, rounds, onFinish, reduceMotion }) {
  const [clue, setClue] = useState(0);
  const [masked, setMasked] = useState(false);
  const { height } = useWindowDimensions();
  const p = PALETTE[card.cat];
  const cat = catOf(card.cat);

  const rowH = Math.max(30, Math.min(44, Math.floor((height - 330) / 10)));
  const fontSize = rowH >= 38 ? 13 : 12;

  const next = () => {
    if (clue >= 9) return;
    setClue((c) => c + 1);
    if (!reduceMotion) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const hit = () => {
    if (!reduceMotion) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onFinish(clue, true);
  };

  const pass = () => onFinish(clue, false);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 24 && Math.abs(g.dy) < 24,
      onPanResponderRelease: (_, g) => { if (g.dx < -40) next(); },
    })
  ).current;

  const points = 10 - clue;

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <Text style={styles.topText}>{score} pontos · {rounds} rodadas</Text>
        <Text style={styles.topText}>{sessionLabel}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: p.body }]} {...pan.panHandlers}>
        <View style={styles.header}>
          <View style={[styles.tabLeft, { backgroundColor: p.tab }]}>
            <Text style={[styles.tabHint, { color: p.body }]}>
              Diga aos jogadores{'\n'}que sou {cat.article}
            </Text>
            <Text style={styles.tabTag}>{cat.tag}</Text>
          </View>
          <View style={[styles.tabRight, { backgroundColor: p.tab, borderLeftColor: p.body }]}>
            <Text style={styles.answer} numberOfLines={2}>
              {masked ? '• • • • •' : card.answer}
            </Text>
            <Pressable
              onPress={() => setMasked((m) => !m)}
              hitSlop={12}
              accessibilityLabel={masked ? 'Mostrar a resposta' : 'Esconder a resposta'}
            >
              <Text style={styles.eye}>{masked ? '\u25CB' : '\u25C9'}</Text>
            </Pressable>
          </View>
        </View>

        {card.clues.map((text, i) => {
          const state = i < clue ? 'done' : i === clue ? 'now' : 'hidden';
          return (
            <View
              key={i}
              style={[
                styles.row,
                { height: rowH, backgroundColor: state === 'now' ? p.rowActive : p.rowIdle },
              ]}
            >
              <View style={styles.numCell}>
                <Text
                  style={[
                    styles.num,
                    { color: p.num, opacity: state === 'now' ? 1 : state === 'done' ? 0.5 : 0.4 },
                  ]}
                >
                  {i + 1}.
                </Text>
              </View>
              <View style={styles.clueCell}>
                {state === 'hidden' ? (
                  <Redacted text={text} color={p.text} size={fontSize} />
                ) : (
                  <Text
                    style={[
                      styles.clue,
                      {
                        color: p.text,
                        fontSize,
                        opacity: state === 'now' ? 1 : 0.5,
                        fontWeight: state === 'now' ? '600' : '400',
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {text}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Pressable style={[styles.btn, styles.btnGhost]} onPress={pass}>
          <Text style={styles.btnGhostText}>Passar</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnMain, { flex: 1.35, opacity: clue === 9 ? 0.35 : 1 }]}
          onPress={next}
          disabled={clue === 9}
        >
          <Text style={styles.btnMainText}>Próxima dica</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnHit]} onPress={hit}>
          <Text style={styles.btnHitText}>Acertou</Text>
        </Pressable>
      </View>
      <Text style={styles.pts}>Vale {points} {points === 1 ? 'ponto' : 'pontos'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: bg, paddingHorizontal: 12, paddingTop: 8 },
  top: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, paddingBottom: 10 },
  topText: { color: textDim, fontSize: 12 },
  card: { borderRadius: 14, overflow: 'hidden' },
  header: { flexDirection: 'row' },
  tabLeft: { width: 100, paddingHorizontal: 10, paddingVertical: 9 },
  tabHint: { fontSize: 10.5, lineHeight: 13, opacity: 0.85 },
  tabTag: { color: '#FFF', fontSize: 13, letterSpacing: 1, fontWeight: '600', marginTop: 4 },
  tabRight: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 10, paddingVertical: 9, borderLeftWidth: 2 },
  answer: { color: '#FFF', fontSize: 18, fontWeight: '600', textAlign: 'center', flexShrink: 1 },
  eye: { color: '#FFFFFFAA', fontSize: 15 },
  row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#FFFFFFCC' },
  numCell: { width: 30, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#FFFFFFCC' },
  num: { fontSize: 12 },
  clueCell: { flex: 1, paddingHorizontal: 10, justifyContent: 'center' },
  clue: { lineHeight: 15 },
  redactRow: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btn: { height: 48, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flex: 1 },
  btnGhost: { borderWidth: 1, borderColor: '#3A4152' },
  btnGhostText: { color: '#9AA3B6', fontSize: 14 },
  btnMain: { backgroundColor: paper },
  btnMainText: { color: bg, fontSize: 14, fontWeight: '600' },
  btnHit: { borderWidth: 1, borderColor: '#2F7F5C' },
  btnHitText: { color: '#5DCAA5', fontSize: 14 },
  pts: { color: textDim, fontSize: 12, textAlign: 'center', marginTop: 9 },
});
