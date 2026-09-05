import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { PALETTE, catOf, bg, surface, textDim, textFaint, paper } from './theme';

export default function ResultScreen({ card, clue, hit, points, score, rounds, onNext, onEnd, reduceMotion }) {
  const p = PALETTE[card.cat];
  const [shown, setShown] = useState(reduceMotion ? points : 0);

  useEffect(() => {
    if (reduceMotion || points === 0) { setShown(points); return; }
    let n = 0;
    const t = setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= points) clearInterval(t);
    }, 140);
    return () => clearInterval(t);
  }, [points, reduceMotion]);

  const avg = rounds ? (score / rounds).toFixed(1).replace('.', ',') : '0,0';

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <Text style={styles.topText}>{score} pontos · {rounds} rodadas</Text>
        <Text style={styles.topText}>{catOf(card.cat).label}</Text>
      </View>

      <View style={styles.center}>
        <Text style={styles.kicker}>A RESPOSTA ERA</Text>
        <Text style={styles.answer}>{card.answer}</Text>
        <View style={[styles.pill, { backgroundColor: p.glow }]}>
          <Text style={{ color: p.accent, fontSize: 12 }}>{catOf(card.cat).label}</Text>
        </View>

        <Text style={[styles.big, { color: hit ? '#5DCAA5' : textDim }]}>
          {hit ? `+${shown}` : '—'}
        </Text>
        <Text style={styles.caption}>
          {hit ? `Acertou na dica ${clue + 1} de 10` : 'Rodada passada, sem pontos'}
        </Text>

        <View style={styles.pips}>
          {Array.from({ length: 10 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.pip,
                {
                  backgroundColor:
                    hit && i === clue ? '#5DCAA5' : i <= clue ? '#2B4A3D' : '#222836',
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.stats}>
        <View>
          <Text style={styles.statLabel}>Total da sessão</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.statLabel}>Média por carta</Text>
          <Text style={styles.statValue}>{avg}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={[styles.btn, styles.ghost]} onPress={onEnd}>
          <Text style={styles.ghostText}>Encerrar sessão</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.main, { flex: 1.3 }]} onPress={onNext}>
          <Text style={styles.mainText}>Próxima carta</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: bg, paddingHorizontal: 12, paddingTop: 8 },
  top: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  topText: { color: textDim, fontSize: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  kicker: { color: textFaint, fontSize: 11, letterSpacing: 2 },
  answer: { color: paper, fontSize: 30, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  pill: { marginTop: 10, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  big: { fontSize: 64, fontWeight: '600', marginTop: 22 },
  caption: { color: textDim, fontSize: 13, marginTop: 8 },
  pips: { flexDirection: 'row', gap: 4, marginTop: 18 },
  pip: { width: 18, height: 5, borderRadius: 3 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: surface, borderRadius: 12, padding: 14 },
  statLabel: { color: textDim, fontSize: 11 },
  statValue: { color: paper, fontSize: 20, fontWeight: '600', marginTop: 2 },
  footer: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 4 },
  btn: { height: 48, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flex: 1 },
  ghost: { borderWidth: 1, borderColor: '#3A4152' },
  ghostText: { color: '#9AA3B6', fontSize: 14 },
  main: { backgroundColor: paper },
  mainText: { color: bg, fontSize: 14, fontWeight: '600' },
});
