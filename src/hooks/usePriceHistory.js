import { useState } from "react";
import { ALL_INSTRUMENTS } from "../data/instruments.js";
import { INDICES } from "../data/indices.js";

function buildInitialHistory() {
  const h = {};
  ALL_INSTRUMENTS.forEach(i => { h[i.id] = [{ t: 0, v: i.price }]; });
  INDICES.forEach(i => { h[i.id] = [{ t: 0, v: i.value }]; });
  return h;
}

export function usePriceHistory() {
  const [priceHistory, setPriceHistory] = useState(buildInitialHistory);

  const resetHistory = () => setPriceHistory(buildInitialHistory());

  return { priceHistory, setPriceHistory, resetHistory };
}
