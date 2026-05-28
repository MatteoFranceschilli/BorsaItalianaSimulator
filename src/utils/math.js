export function gaussRand() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function generatePriceChange(instrument, marketSentiment, deltaTime, eventMod = null) {
  const beta = instrument.beta || 1.0;
  const baseVol = instrument.category === "Obbligazioni" ? 0.03
    : instrument.category === "ETF/ETC" ? 0.12
    : instrument.category === "Derivati" ? 0.4
    : 0.22;

  const volMult = eventMod?.volMult ?? 1;
  const eventDrift = eventMod?.drift ?? 0;
  const sigma = baseVol * volMult;

  const dtYears = deltaTime / (365 * 24 * 3600);
  const drift = (0.06 * beta - 0.5 * sigma * sigma + eventDrift) * dtYears;
  const shock = sigma * Math.sqrt(dtYears) * gaussRand();
  const marketEffect = marketSentiment * 0.002 * beta;
  return Math.exp(drift + shock + marketEffect) - 1;
}
