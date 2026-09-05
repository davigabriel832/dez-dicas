import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@dezdicas/session/v1';

const EMPTY = {
  started: false,
  selected: [],
  usedIds: [],
  score: 0,
  rounds: 0,
  history: [],
};

export function useSession() {
  const [session, setSession] = useState(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setSession({ ...EMPTY, ...JSON.parse(raw) });
      } catch (e) {
        // sessão corrompida ou indisponível: começa limpa
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback((next) => {
    setSession(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const start = useCallback(
    (selected) => persist({ ...EMPTY, started: true, selected }),
    [persist]
  );

  const finishRound = useCallback(
    (card, clueIndex, hit) => {
      const points = hit ? 11 - (clueIndex + 1) : 0;
      persist({
        ...session,
        usedIds: [...session.usedIds, card.id],
        score: session.score + points,
        rounds: session.rounds + 1,
        history: [
          ...session.history,
          { id: card.id, cat: card.cat, answer: card.answer, clue: clueIndex + 1, points, hit },
        ],
      });
      return points;
    },
    [session, persist]
  );

  const setSelected = useCallback(
    (selected) => persist({ ...session, selected }),
    [session, persist]
  );

  const reset = useCallback(() => persist(EMPTY), [persist]);

  const restartDeck = useCallback(
    () => persist({ ...session, usedIds: [], score: 0, rounds: 0, history: [] }),
    [session, persist]
  );

  return { session, loaded, start, finishRound, setSelected, reset, restartDeck };
}
