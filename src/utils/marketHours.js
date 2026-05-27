export function checkMarketHours(dt) {
  const h = dt.getHours(), m = dt.getMinutes(), dow = dt.getDay();
  if (dow === 0 || dow === 6) return "CHIUSO";
  const mins = h * 60 + m;
  if (mins < 9 * 60 || mins >= 17 * 60 + 30) return "CHIUSO";
  if (mins < 9 * 60 + 15) return "PRE-APERTURA";
  return "APERTO";
}
