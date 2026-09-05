import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { PALETTE, catOf, bg, surface, textDim, textFaint, paper } from './theme';

export default function StatsScreen({ session, onRestart, onNewSession }) {
  const { history, score, rounds } = session;
  const hits = history.filter((h) => h.hit);
  const best = hits.length ? Math.min(...hits.map((h) => h.clue)) : null;
  const avg = rounds ? (score / rounds).toFixed(1).replace('.', ',') : '0,0';

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>FIM DA SESSÃO</Text>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.sub}>
        {rounds} {rounds === 1 ? 'carta jogada' : 'cartas jogadas'} · {hits.length} acertos
      </Text>

      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.boxLabel}>Média por carta</Text>
          <Text style={styles.boxValue}>{avg}</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxLabel}>Melhor acerto</Text>
          <Text style={styles.boxValue}>{best === null ? '—' : `Dica ${best + 1}`}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, marginTop: 16 }} contentContainerStyle={{ paddingBottom: 12 }}>
        {history.slice().reverse().map((h, i) => (
          <View key={i} style={styles.item}>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.itemName} numberOfLines={1}>{h.answer}</Text>
              <Text style={styles.itemMeta}>
                {catOf(h.cat).label} · {h.hit ? `dica ${h.clue}` : 'passou'}
              </Text>
            </View>
            <Text style={[styles.itemPts, { color: h.points ? PALETTE[h.cat].accent : textFaint }]}>
              {h.points ? `+${h.points}` : '—'}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={[styles.btn, styles.ghost]} onPress={onNewSession}>
          <Text style={styles.ghostText}>Trocar categorias</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.main]} onPress={onRestart}>
          <Text style={styles.mainText}>Jogar de novo</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: bg, paddingHorizontal: 14, paddingTop: 24 },
  kicker: { color: textFaint, fontSize: 11, letterSpacing: 2, textAlign: 'center' },
  score: { color: paper, fontSize: 56, fontWeight: '600', textAlign: 'center', marginTop: 6 },
  sub: { color: textDim, fontSize: 13, textAlign: 'center', marginTop: 4 },
  row: { flexDirection: 'row', gap: 12, marginTop: 22 },
  box: { flex: 1, backgroundColor: surface, borderRadius: 12, padding: 14 },
  boxLabel: { color: textDim, fontSize: 11 },
  boxValue: { color: paper, fontSize: 20, fontWeight: '600', marginTop: 2 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#1B2130' },
  itemName: { color: paper, fontSize: 15 },
  itemMeta: { color: textDim, fontSize: 11.5, marginTop: 2 },
  itemPts: { fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  btn: { flex: 1, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  ghost: { borderWidth: 1, borderColor: '#3A4152' },
  ghostText: { color: '#9AA3B6', fontSize: 14 },
  main: { backgroundColor: paper },
  mainText: { color: bg, fontSize: 14, fontWeight: '600' },
});
