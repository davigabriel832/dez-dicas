export const bg = '#0D1017';
export const surface = '#141926';
export const line = '#232937';
export const textDim = '#8B93A7';
export const textFaint = '#5F6A80';
export const paper = '#F2F5F1';

export const CATEGORIES = [
  { key: 'pessoa', label: 'Pessoa', article: 'uma', tag: 'PESSOA', icon: '\u25CF' },
  { key: 'filme', label: 'Filme', article: 'um', tag: 'FILME', icon: '\u25CF' },
  { key: 'serie', label: 'Série', article: 'uma', tag: 'SÉRIE', icon: '\u25CF' },
  { key: 'coisa', label: 'Coisa', article: 'uma', tag: 'COISA', icon: '\u25CF' },
];

export const PALETTE = {
  pessoa: {
    accent: '#C2903A',
    tab: '#8A6414',
    body: '#F6F0E2',
    rowIdle: '#EFE7D4',
    rowActive: '#FDFAF2',
    text: '#2E2410',
    num: '#8A6414',
    glow: '#43331050',
  },
  filme: {
    accent: '#45A67A',
    tab: '#0F5C3F',
    body: '#EEF4EF',
    rowIdle: '#E4EFE7',
    rowActive: '#F6FAF7',
    text: '#16301F',
    num: '#0F5C3F',
    glow: '#0F5C3F50',
  },
  serie: {
    accent: '#D96F74',
    tab: '#96343A',
    body: '#FBEEEE',
    rowIdle: '#F5E2E2',
    rowActive: '#FFF7F7',
    text: '#3A1618',
    num: '#96343A',
    glow: '#96343A50',
  },
  coisa: {
    accent: '#5FA5E6',
    tab: '#1C5386',
    body: '#EDF3FA',
    rowIdle: '#E0EAF5',
    rowActive: '#F7FAFD',
    text: '#12283C',
    num: '#1C5386',
    glow: '#1C538650',
  },
};

export const catOf = (k) => CATEGORIES.find((c) => c.key === k);
