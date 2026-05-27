import { STOCKS } from './stocks.js';
import { ETFS } from './etfs.js';
import { BONDS } from './bonds.js';
import { DERIVATIVES } from './derivatives.js';
import { FONDI } from './funds.js';

export const ALL_INSTRUMENTS = [
  ...STOCKS.map(s => ({ ...s, category: "Azioni" })),
  ...ETFS.map(e => ({ ...e, category: "ETF/ETC" })),
  ...BONDS.map(b => ({ ...b, category: "Obbligazioni" })),
  ...DERIVATIVES.map(d => ({ ...d, category: "Derivati" })),
  ...FONDI,
];

export { STOCKS, ETFS, BONDS, DERIVATIVES, FONDI };
