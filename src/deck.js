import pessoa from '../deck/pessoa.json';
import filme from '../deck/filme.json';
import serie from '../deck/serie.json';
import coisa from '../deck/coisa.json';

const withCat = (arr, cat) => arr.map((c) => ({ ...c, cat }));

export const DECK = [
  ...withCat(pessoa, 'pessoa'),
  ...withCat(filme, 'filme'),
  ...withCat(serie, 'serie'),
  ...withCat(coisa, 'coisa'),
];

export const countByCat = (cat) => DECK.filter((c) => c.cat === cat).length;

export function availableCards(selected, usedIds) {
  const cats = selected.length ? selected : null;
  return DECK.filter(
    (c) => (!cats || cats.includes(c.cat)) && !usedIds.includes(c.id)
  );
}

export function drawCard(selected, usedIds) {
  const pool = availableCards(selected, usedIds);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function remainingByCat(cat, usedIds) {
  return DECK.filter((c) => c.cat === cat && !usedIds.includes(c.id)).length;
}
