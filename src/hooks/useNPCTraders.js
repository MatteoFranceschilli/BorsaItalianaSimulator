import { useState, useRef } from "react";
import { NPCS } from "../data/npcs.js";
import { STOCKS } from "../data/stocks.js";
import { calcCommission, calcTax } from "../utils/tax.js";

function calcPortfolioValue(state, prices) {
  return Object.entries(state.portfolio).reduce((sum, [id, pos]) => {
    return sum + pos.qty * (prices[id]?.current || pos.avgPrice);
  }, 0);
}

// Variable position sizing: confidence + random variance
// Confident NPCs size up, shaken NPCs size down
function getQty(total, baseRatio, price, confidence = 1.0) {
  const confScale = Math.max(0.5, Math.min(1.6, confidence));
  const randomVariance = 0.75 + Math.random() * 0.5; // ±25%
  return Math.floor((total * baseRatio * confScale * randomVariance) / price);
}

// How likely each archetype is to "change their mind" even when the signal is valid
const HESITATION = {
  cassettista: 0.22, // patient, but sometimes skips an opportunity
  momentum:    0.10,
  contrarian:  0.18, // sometimes too stubborn to act
  panic:       0.03, // barely hesitates — acts on impulse
  quant:       0.06, // systematic, rarely second-guesses
  novice:      0.32, // overthinks everything
  speculator:  0.08,
  dividend:    0.24, // deliberate accumulator, slow to act
};

function initStates() {
  return Object.fromEntries(
    NPCS.map(npc => [npc.id, {
      cash: npc.startCash,
      portfolio: {},
      confidence: 1.0,   // 0.3–1.8: modifies trade frequency and position size
      dormantTicks: 0,   // NPC pauses trading after a significant loss
    }])
  );
}

// ── Decision logic per archetype ──────────────────────────────────────────────
// Each function receives state (with .confidence) and returns {action, instrId, qty} | null
// Confidence affects: thresholds for entering/exiting, position size

function decideCassettista(state, prices) {
  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;
  const conf = state.confidence;

  // Only sell on severe loss; shaken cassettisti cut losses a touch earlier
  const lossThreshold = conf < 0.7 ? 0.78 : 0.75;
  for (const [id, pos] of Object.entries(state.portfolio)) {
    const cp = prices[id]?.current;
    if (cp && cp / pos.avgPrice < lossThreshold) return { action: "sell", instrId: id, qty: pos.qty };
  }

  // Buy when sitting on excess cash; confident ones deploy sooner
  const cashThreshold = conf > 1.2 ? 0.30 : 0.40;
  if (state.cash > total * cashThreshold) {
    const picks = STOCKS
      .filter(s => (s.div || 0) >= 4 && !state.portfolio[s.id])
      .sort((a, b) => (b.div || 0) - (a.div || 0));
    if (picks.length) {
      const s = picks[Math.floor(Math.random() * Math.min(4, picks.length))];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = getQty(total, 0.12, price, conf);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }
  return null;
}

function decideMomentum(state, prices, priceHistory) {
  const conf = state.confidence;
  // Confident trend followers give winners more room; shaken ones cut faster
  const stopLoss  = conf > 1.2 ? -0.06 : -0.05;
  const takeProfit = conf > 1.2 ? 0.22 : 0.18;

  for (const [id, pos] of Object.entries(state.portfolio)) {
    const cp = prices[id]?.current;
    if (!cp) continue;
    const ret = cp / pos.avgPrice - 1;
    if (ret < stopLoss || ret > takeProfit) return { action: "sell", instrId: id, qty: pos.qty };
    const hist = priceHistory[id] || [];
    if (hist.length >= 3) {
      const [h2, h1, h0] = hist.slice(-3).map(h => h.v);
      if (h0 < h1 && h1 < h2) return { action: "sell", instrId: id, qty: pos.qty };
    }
  }

  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;
  // Confident traders stay more invested; shaken ones keep a bigger cash buffer
  const minCash = conf > 1.3 ? 0.08 : 0.12;
  if (state.cash > total * minCash) {
    // Confident traders chase even moderate moves; cautious ones wait for stronger signals
    const minPct = conf > 1.3 ? 1.5 : 2.0;
    const rising = STOCKS
      .filter(s => (prices[s.id]?.pctChange || 0) > minPct && !state.portfolio[s.id])
      .sort((a, b) => (prices[b.id]?.pctChange || 0) - (prices[a.id]?.pctChange || 0));
    if (rising.length) {
      const s = rising[0];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = getQty(total, 0.15, price, conf);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }
  return null;
}

function decideContrarian(state, prices) {
  const conf = state.confidence;
  for (const [id, pos] of Object.entries(state.portfolio)) {
    const cp = prices[id]?.current;
    if (!cp) continue;
    // Stubborn contrarians hold longer when confident; exit faster when shaken
    const riseToSell = conf > 1.2 ? 9 : 7;
    const gainToSell = conf < 0.7 ? 0.12 : 0.15;
    if ((prices[id]?.pctChange || 0) > riseToSell) return { action: "sell", instrId: id, qty: Math.ceil(pos.qty / 2) };
    if (cp / pos.avgPrice - 1 > gainToSell) return { action: "sell", instrId: id, qty: pos.qty };
  }

  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;
  // Shaken contrarians need a bigger cash cushion before going in
  const cashRequired = conf < 0.7 ? 0.35 : 0.25;
  if (state.cash > total * cashRequired) {
    // More confident → buy on smaller dips; more cautious → wait for bigger drops
    const dipRequired = conf < 0.7 ? -6 : -4;
    const dipped = STOCKS
      .filter(s => (prices[s.id]?.pctChange || 0) < dipRequired && !state.portfolio[s.id])
      .sort((a, b) => (prices[a.id]?.pctChange || 0) - (prices[b.id]?.pctChange || 0));
    if (dipped.length) {
      const s = dipped[0];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = getQty(total, 0.12, price, conf);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }
  return null;
}

function decidePanic(state, prices, activeEvents) {
  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;
  const conf = state.confidence;

  // Shaken panic traders have a lower threshold for panic-selling on bad news
  const sentimentTrigger = conf < 0.7 ? -1.0 : -1.5;
  if (activeEvents.some(e => (e.sentimentEffect || 0) < sentimentTrigger)) {
    const ids = Object.keys(state.portfolio);
    if (ids.length) {
      const id = ids[Math.floor(Math.random() * ids.length)];
      return { action: "sell", instrId: id, qty: state.portfolio[id].qty };
    }
  }

  // Confident panic traders are even more susceptible to FOMO
  const fomoTrigger = conf > 1.2 ? 0.8 : 1.5;
  if (activeEvents.some(e => (e.sentimentEffect || 0) > fomoTrigger) && state.cash > total * 0.25) {
    const movers = STOCKS.filter(s => (prices[s.id]?.pctChange || 0) > 1.5 && !state.portfolio[s.id]);
    if (movers.length) {
      const s = movers[Math.floor(Math.random() * movers.length)];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = getQty(total, 0.28, price, conf);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }

  // Sell individual positions on sharp drops; threshold tightens when already shaken
  const dropTrigger = conf < 0.6 ? -3.5 : -5;
  for (const [id, pos] of Object.entries(state.portfolio)) {
    if ((prices[id]?.pctChange || 0) < dropTrigger) return { action: "sell", instrId: id, qty: pos.qty };
  }

  // Impulsive buy when sitting on too much cash
  const cashTrigger = conf > 1.2 ? 0.35 : 0.50;
  if (state.cash > total * cashTrigger && Math.random() < 0.2) {
    const s = STOCKS[Math.floor(Math.random() * STOCKS.length)];
    const price = prices[s.id]?.current;
    if (price) {
      const qty = getQty(total, 0.18, price, conf);
      if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
    }
  }
  return null;
}

function decideQuant(state, prices, priceHistory) {
  const conf = state.confidence;
  // Quant uses MA bands; confident ones sell a bit later, shaken ones earlier
  const sellBand = conf > 1.2 ? 1.06 : 1.04;
  for (const [id, pos] of Object.entries(state.portfolio)) {
    const hist = priceHistory[id] || [];
    const cp = prices[id]?.current;
    if (!cp || hist.length < 10) continue;
    const ma = hist.slice(-20).reduce((s, h) => s + h.v, 0) / Math.min(20, hist.length);
    if (cp > ma * sellBand) return { action: "sell", instrId: id, qty: pos.qty };
  }

  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;
  // Shaken quants keep a larger safety buffer
  const minCash = conf < 0.7 ? 0.15 : 0.10;
  if (state.cash > total * minCash) {
    // Confident quants buy on smaller deviations from MA
    const buyBand = conf > 1.2 ? 0.98 : 0.97;
    const underMA = STOCKS
      .filter(s => {
        const hist = priceHistory[s.id] || [];
        const cp = prices[s.id]?.current;
        if (!cp || hist.length < 10) return false;
        const ma = hist.slice(-20).reduce((sum, h) => sum + h.v, 0) / Math.min(20, hist.length);
        return cp < ma * buyBand;
      })
      .filter(s => !state.portfolio[s.id]);
    if (underMA.length) {
      const s = underMA[Math.floor(Math.random() * Math.min(3, underMA.length))];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = getQty(total, 0.10, price, conf);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }
  return null;
}

function decideNovice(state, prices) {
  const conf = state.confidence;
  // Disposition effect: sells winners too early — threshold shrinks when scared
  const winThreshold = conf < 0.7 ? 0.05 : 0.08;
  for (const [id, pos] of Object.entries(state.portfolio)) {
    const cp = prices[id]?.current;
    if (!cp) continue;
    if (cp / pos.avgPrice - 1 > winThreshold) return { action: "sell", instrId: id, qty: pos.qty };
    // Panics on sharp drops when already shaken (learns mistakes)
    if ((prices[id]?.pctChange || 0) < -6 && conf < 0.8) {
      return { action: "sell", instrId: id, qty: pos.qty };
    }
  }

  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;
  const cashThreshold = conf > 1.2 ? 0.28 : 0.40;
  if (state.cash > total * cashThreshold && Math.random() < 0.4) {
    // Overconfident novice chases things that already moved (FOMO)
    const candidates = conf > 1.2
      ? STOCKS.filter(s => (prices[s.id]?.pctChange || 0) > 1)
      : STOCKS;
    if (candidates.length) {
      const s = candidates[Math.floor(Math.random() * candidates.length)];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = getQty(total, 0.18, price, conf);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }
  return null;
}

function decideSpeculator(state, prices, activeEvents) {
  const conf = state.confidence;
  // Confident speculators hold through more pain; shaken ones cut quicker
  const stopLoss  = conf < 0.7 ? -0.06 : -0.08;
  const takeProfit = conf > 1.3 ? 0.30 : 0.25;
  for (const [id, pos] of Object.entries(state.portfolio)) {
    const cp = prices[id]?.current;
    if (!cp) continue;
    const ret = cp / pos.avgPrice - 1;
    if (ret < stopLoss || ret > takeProfit) return { action: "sell", instrId: id, qty: pos.qty };
  }

  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;

  if (state.cash > total * 0.10 && activeEvents.length) {
    const ev = activeEvents[0];
    const sectorStocks = STOCKS.filter(s =>
      ev.sectorEffects?.[s.sector]?.drift > 0 && !state.portfolio[s.id]
    );
    if (sectorStocks.length) {
      const s = sectorStocks[Math.floor(Math.random() * sectorStocks.length)];
      const price = prices[s.id]?.current;
      if (price) {
        // Confident speculators go bigger on event plays
        const ratio = conf > 1.3 ? 0.28 : 0.20;
        const qty = getQty(total, ratio, price, conf);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }

  if (state.cash > total * 0.15) {
    const volatile = STOCKS.filter(s => (s.beta || 1) >= 1.3 && !state.portfolio[s.id]);
    if (volatile.length) {
      const s = volatile[Math.floor(Math.random() * volatile.length)];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = getQty(total, 0.18, price, conf);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }
  return null;
}

function decideDividend(state, prices) {
  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;
  const conf = state.confidence;
  // Confident dividend investors deploy more aggressively
  const minCash = conf > 1.2 ? 0.15 : 0.20;
  if (state.cash > total * minCash) {
    // Confident ones reach for slightly lower-yielding stocks too
    const minDiv = conf > 1.2 ? 4 : 5;
    const divs = STOCKS
      .filter(s => (s.div || 0) >= minDiv)
      .sort((a, b) => (b.div || 0) - (a.div || 0));
    if (divs.length) {
      const s = divs[Math.floor(Math.random() * Math.min(5, divs.length))];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = getQty(total, 0.08, price, conf);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }
  return null;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useNPCTraders() {
  const [npcStates, setNpcStates] = useState(initStates);
  const statesRef = useRef(initStates());
  const [npcTrades, setNpcTrades] = useState([]);
  const npcPressureRef = useRef(0);

  const tickNPCs = (prices, priceHistory, activeEvents) => {
    if (!prices || Object.keys(prices).length === 0) return;

    const states = { ...statesRef.current };
    let netPressure = 0;
    const newTrades = [];

    NPCS.forEach(npc => {
      const state = states[npc.id];

      // 1. Confidence slowly reverts toward 1.0 every tick (humans recover)
      const conf = state.confidence + (1.0 - state.confidence) * 0.004;

      // 2. Dormancy countdown: NPC is licking wounds after a big loss
      const newDormant = Math.max(0, state.dormantTicks - 1);

      // Always persist the base confidence update (even without trading)
      states[npc.id] = { ...state, confidence: conf, dormantTicks: newDormant };

      // Skip trading while still in dormancy period
      if (state.dormantTicks > 0) return;

      // 3. Confidence modifies effective decision probability
      //    High confidence → trades more; low confidence → trades less
      const effectiveProb = npc.decisionProb * Math.max(0.3, conf);
      if (Math.random() > effectiveProb) return;

      // 4. Decide
      const stateWithConf = { ...state, confidence: conf };
      let decision = null;
      switch (npc.archetype) {
        case "cassettista": decision = decideCassettista(stateWithConf, prices); break;
        case "momentum":    decision = decideMomentum(stateWithConf, prices, priceHistory); break;
        case "contrarian":  decision = decideContrarian(stateWithConf, prices); break;
        case "panic":       decision = decidePanic(stateWithConf, prices, activeEvents); break;
        case "quant":       decision = decideQuant(stateWithConf, prices, priceHistory); break;
        case "novice":      decision = decideNovice(stateWithConf, prices); break;
        case "speculator":  decision = decideSpeculator(stateWithConf, prices, activeEvents); break;
        case "dividend":    decision = decideDividend(stateWithConf, prices); break;
      }

      if (!decision) return;

      // 5. Hesitation: even with a valid signal, humans sometimes second-guess
      if (Math.random() < (HESITATION[npc.archetype] || 0.1)) return;

      const { action, instrId, qty } = decision;
      const price = prices[instrId]?.current;
      if (!price || !qty || qty <= 0) return;

      // 6. Execute trade
      const s = { ...state, portfolio: { ...state.portfolio }, confidence: conf, dormantTicks: 0 };
      let newConf = conf;
      let dormantTicks = 0;

      if (action === "buy") {
        const commission = calcCommission(qty * price);
        const cost = qty * price + commission;
        if (cost > s.cash) return;
        s.cash -= cost;
        if (s.portfolio[instrId]) {
          const old = s.portfolio[instrId];
          const newQty = old.qty + qty;
          s.portfolio[instrId] = { qty: newQty, avgPrice: (old.qty * old.avgPrice + qty * price) / newQty };
        } else {
          s.portfolio[instrId] = { qty, avgPrice: price };
        }
        netPressure += qty * price;
      } else {
        const pos = s.portfolio[instrId];
        if (!pos || pos.qty < qty) return;
        const commission = calcCommission(qty * price);
        const gain = (price - pos.avgPrice) * qty;
        const tax = calcTax(Math.max(0, gain), instrId);
        s.cash += qty * price - commission - tax;
        const rem = pos.qty - qty;
        if (rem <= 0) {
          const { [instrId]: _, ...rest } = s.portfolio;
          s.portfolio = rest;
        } else {
          s.portfolio[instrId] = { ...pos, qty: rem };
        }
        netPressure -= qty * price;

        // 7. Update confidence based on trade outcome
        if (gain > 0) {
          // Win → more confident; big win → extra boost
          newConf = conf + 0.12 + (gain > qty * price * 0.08 ? 0.08 : 0);
        } else {
          // Loss → less confident
          newConf = conf - 0.20;
          // Significant loss → go dormant (step away from the market)
          const totalVal = s.cash + calcPortfolioValue(s, prices);
          if (Math.abs(gain) > totalVal * 0.04) {
            dormantTicks = Math.floor(12 + Math.random() * 30);
          }
        }
      }

      s.confidence = Math.max(0.3, Math.min(1.8, newConf));
      s.dormantTicks = dormantTicks;
      states[npc.id] = s;
      newTrades.push({
        npcId: npc.id, npcName: npc.name, npcAvatar: npc.avatar,
        action, instrId, qty, price, t: Date.now(),
      });
    });

    // Scale pressure for 24 NPCs
    npcPressureRef.current = Math.max(-1, Math.min(1, netPressure / 6000));

    statesRef.current = states;
    setNpcStates({ ...states });
    if (newTrades.length > 0) {
      setNpcTrades(prev => [...newTrades, ...prev].slice(0, 60));
    }
  };

  const resetNPCs = () => {
    const init = initStates();
    statesRef.current = init;
    setNpcStates(init);
    setNpcTrades([]);
    npcPressureRef.current = 0;
  };

  return { npcStates, npcTrades, tickNPCs, npcPressureRef, resetNPCs };
}
