// Italian "regime amministrato" tax rules
// Government bonds (D.Lgs 239/96) → 12.5%
// Everything else → 26%

const GOV_BOND_PREFIXES = ["BOT", "BTP", "CCT", "CTZ", "BTPI"];
const GOV_BOND_ETF_IDS  = new Set(["XBTP", "VGOV"]);

export function getTaxRate(instrId) {
  if (!instrId) return 0.26;
  if (GOV_BOND_ETF_IDS.has(instrId)) return 0.125;
  if (GOV_BOND_PREFIXES.some(p => instrId.startsWith(p))) return 0.125;
  return 0.26;
}

export const COMMISSION_RATE = 0.001; // 0.1%
export const COMMISSION_MIN  = 1.5;   // €1.50 minimum

export function calcCommission(tradeValue) {
  return Math.max(COMMISSION_MIN, tradeValue * COMMISSION_RATE);
}

export function calcTax(gain, instrId) {
  if (gain <= 0) return 0;
  return gain * getTaxRate(instrId);
}
