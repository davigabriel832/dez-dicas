import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CATEGORIES, PALETTE, bg, surface, line, textDim, textFaint, paper } from './theme';
import { countByCat } from './deck';

export default function SetupScreen({ onStart, initial = [] }) {
  const [sel, setSel] = useState(initial);

  const toggle = (k) =>
    setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  const active = sel.length ? sel : CATEGORIES.map((c) => c.key);
  const total = active.reduce((a, k) => a + countByCat(k), 0);
  const label = sel.length
    ? CATEGORIES.filter((c) => sel.includes(c.key)).map((c) => c.label).join(' + ')
    : 'Baralho completo';

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Text style={styles.kicker}>NOVA SESSÃO</Text>
        <Text style={styles.title}>Do que vai ser o baralho de hoje?</Text>
        <Text style={styles.sub}>Vale para a sessão inteira.{'\n'}Depois é só ir sorteando.</Text>
      </View>

      <View style={styles.grid}>
        {CATEGORIES.map((c) => {
          const on = sel.includes(c.key);
          const p = PALETTE[c.key];
          return (
            <Pressable
              key={c.key}
              onPress={() => toggle(c.key)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              style={[
                styles.cat,
                { borderColor: on ? p.accent : line, backgroundColor: on ? p.glow : surface },
              ]}
            >
              <View style={styles.catTop}>
                <Text style={{ color: p.accent, fontSize: 18 }}>{'\u25CF'}</Text>
                <View
                  style={[
                    styles.check,
                    { borderColor: on ? p.accent : '#343C4E', backgroundColor: on ? p.accent : 'transparent' },
                  ]}
                >
                  {on ? <Text style={styles.checkMark}>{'\u2713'}</Text> : null}
                </View>
              </View>
              <Text style={styles.catName}>{c.label}</Text>
              <Text style={styles.catCount}>{countByCat(c.key)} cartas</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.summary}>{label} · {total} cartas</Text>

      <Pressable style={styles.cta} onPress={() => onStart(sel)}>
        <Text style={styles.ctaText}>Começar sessão</Text>
      </Pressable>
      <Text style={styles.foot}>Dá para trocar as categorias depois sem perder o placar.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: bg, paddingHorizontal: 14, justifyContent: 'center' },
  head: { alignItems: 'center', paddingBottom: 22 },
  kicker: { color: textFaint, fontSize: 11, letterSpacing: 2 },
  title: { color: paper, fontSize: 24, fontWeight: '600', marginTop: 10, textAlign: 'center' },
  sub: { color: textDim, fontSize: 12.5, marginTop: 10, textAlign: 'center', lineHeight: 19 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
  cat: { width: '47.5%', flexGrow: 1, borderRadius: 12, borderWidth: 1.5, padding: 14 },
  catTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  check: { width: 19, height: 19, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: '#0D1017', fontSize: 11, fontWeight: '700' },
  catName: { color: paper, fontSize: 18, fontWeight: '600', marginTop: 11 },
  catCount: { color: textDim, fontSize: 11.5, marginTop: 4 },
  summary: { color: '#9AA3B6', fontSize: 12.5, textAlign: 'center', marginVertical: 20 },
  cta: { height: 54, borderRadius: 12, backgroundColor: paper, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: bg, fontSize: 15, fontWeight: '600' },
  foot: { color: textFaint, fontSize: 11.5, textAlign: 'center', marginTop: 14 },
});
