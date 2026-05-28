import { useState, useRef } from "react";
import { NPCS } from "../data/npcs.js";
import { STOCKS } from "../data/stocks.js";
import { calcCommission, calcTax } from "../utils/tax.js";

function calcPortfolioValue(state, prices) {
  return Object.entries(state.portfolio).reduce((sum, [id, pos]) => {
    return sum + pos.qty * (prices[id]?.current || pos.avgPrice);
  }, 0);
}

function initStates() {
  return Object.fromEntries(
    NPCS.map(npc => [npc.id, { cash: npc.startCash, portfolio: {} }])
  );
}

// ── Decision logic per archetype ──────────────────────────────────────────────

function decideCassettista(state, prices) {
  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;

  for (const [id, pos] of Object.entries(state.portfolio)) {
    const cp = prices[id]?.current;
    if (cp && cp / pos.avgPrice < 0.75) return { action: "sell", instrId: id, qty: pos.qty };
  }

  if (state.cash > total * 0.35) {
    const picks = STOCKS
      .filter(s => (s.div || 0) >= 4 && !state.portfolio[s.id])
      .sort((a, b) => (b.div || 0) - (a.div || 0));
    if (picks.length) {
      const s = picks[Math.floor(Math.random() * Math.min(4, picks.length))];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = Math.floor((total * 0.12) / price);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }
  return null;
}

function decideMomentum(state, prices, priceHistory) {
  for (const [id, pos] of Object.entries(state.portfolio)) {
    const cp = prices[id]?.current;
    if (!cp) continue;
    const ret = cp / pos.avgPrice - 1;
    if (ret < -0.05 || ret > 0.18) return { action: "sell", instrId: id, qty: pos.qty };
    const hist = priceHistory[id] || [];
    if (hist.length >= 3) {
      const [h2, h1, h0] = hist.slice(-3).map(h => h.v);
      if (h0 < h1 && h1 < h2) return { action: "sell", instrId: id, qty: pos.qty };
    }
  }

  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;
  if (state.cash > total * 0.12) {
    const rising = STOCKS
      .filter(s => (prices[s.id]?.pctChange || 0) > 2 && !state.portfolio[s.id])
      .sort((a, b) => (prices[b.id]?.pctChange || 0) - (prices[a.id]?.pctChange || 0));
    if (rising.length) {
      const s = rising[0];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = Math.floor((total * 0.15) / price);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }
  return null;
}

function decideContrarian(state, prices) {
  for (const [id, pos] of Object.entries(state.portfolio)) {
    const cp = prices[id]?.current;
    if (!cp) continue;
    if ((prices[id]?.pctChange || 0) > 7) return { action: "sell", instrId: id, qty: Math.ceil(pos.qty / 2) };
    if (cp / pos.avgPrice - 1 > 0.15) return { action: "sell", instrId: id, qty: pos.qty };
  }

  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;
  if (state.cash > total * 0.25) {
    const dipped = STOCKS
      .filter(s => (prices[s.id]?.pctChange || 0) < -4 && !state.portfolio[s.id])
      .sort((a, b) => (prices[a.id]?.pctChange || 0) - (prices[b.id]?.pctChange || 0));
    if (dipped.length) {
      const s = dipped[0];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = Math.floor((total * 0.12) / price);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }
  return null;
}

function decidePanic(state, prices, activeEvents) {
  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;

  if (activeEvents.some(e => (e.sentimentEffect || 0) < -1.5)) {
    const ids = Object.keys(state.portfolio);
    if (ids.length) {
      const id = ids[Math.floor(Math.random() * ids.length)];
      return { action: "sell", instrId: id, qty: state.portfolio[id].qty };
    }
  }

  if (activeEvents.some(e => (e.sentimentEffect || 0) > 1.5) && state.cash > total * 0.4) {
    const movers = STOCKS.filter(s => (prices[s.id]?.pctChange || 0) > 2 && !state.portfolio[s.id]);
    if (movers.length) {
      const s = movers[Math.floor(Math.random() * movers.length)];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = Math.floor((state.cash * 0.35) / price);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }

  for (const [id, pos] of Object.entries(state.portfolio)) {
    if ((prices[id]?.pctChange || 0) < -5) return { action: "sell", instrId: id, qty: pos.qty };
  }

  if (state.cash > total * 0.5 && Math.random() < 0.25) {
    const s = STOCKS[Math.floor(Math.random() * STOCKS.length)];
    const price = prices[s.id]?.current;
    if (price) {
      const qty = Math.floor((state.cash * 0.2) / price);
      if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
    }
  }
  return null;
}

function decideQuant(state, prices, priceHistory) {
  for (const [id, pos] of Object.entries(state.portfolio)) {
    const hist = priceHistory[id] || [];
    const cp = prices[id]?.current;
    if (!cp || hist.length < 10) continue;
    const ma = hist.slice(-20).reduce((s, h) => s + h.v, 0) / Math.min(20, hist.length);
    if (cp > ma * 1.04) return { action: "sell", instrId: id, qty: pos.qty };
  }

  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;
  if (state.cash > total * 0.1) {
    const underMA = STOCKS
      .filter(s => {
        const hist = priceHistory[s.id] || [];
        const cp = prices[s.id]?.current;
        if (!cp || hist.length < 10) return false;
        const ma = hist.slice(-20).reduce((sum, h) => sum + h.v, 0) / Math.min(20, hist.length);
        return cp < ma * 0.97;
      })
      .filter(s => !state.portfolio[s.id]);
    if (underMA.length) {
      const s = underMA[Math.floor(Math.random() * Math.min(3, underMA.length))];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = Math.floor((total * 0.10) / price);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }
  return null;
}

function decideNovice(state, prices) {
  for (const [id, pos] of Object.entries(state.portfolio)) {
    const cp = prices[id]?.current;
    if (cp && cp / pos.avgPrice - 1 > 0.08) return { action: "sell", instrId: id, qty: pos.qty };
  }

  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;
  if (state.cash > total * 0.4 && Math.random() < 0.4) {
    const s = STOCKS[Math.floor(Math.random() * STOCKS.length)];
    const price = prices[s.id]?.current;
    if (price) {
      const qty = Math.floor((state.cash * 0.18) / price);
      if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
    }
  }
  return null;
}

function decideSpeculator(state, prices, activeEvents) {
  for (const [id, pos] of Object.entries(state.portfolio)) {
    const cp = prices[id]?.current;
    if (!cp) continue;
    const ret = cp / pos.avgPrice - 1;
    if (ret < -0.08 || ret > 0.25) return { action: "sell", instrId: id, qty: pos.qty };
  }

  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;

  if (state.cash > total * 0.1 && activeEvents.length) {
    const ev = activeEvents[0];
    const sectorStocks = STOCKS.filter(s =>
      ev.sectorEffects?.[s.sector]?.drift > 0 && !state.portfolio[s.id]
    );
    if (sectorStocks.length) {
      const s = sectorStocks[Math.floor(Math.random() * sectorStocks.length)];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = Math.floor((total * 0.2) / price);
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
        const qty = Math.floor((total * 0.18) / price);
        if (qty > 0 && qty * price <= state.cash) return { action: "buy", instrId: s.id, qty };
      }
    }
  }
  return null;
}

function decideDividend(state, prices) {
  const pVal = calcPortfolioValue(state, prices);
  const total = state.cash + pVal;
  if (state.cash > total * 0.2) {
    const divs = STOCKS
      .filter(s => (s.div || 0) >= 5)
      .sort((a, b) => (b.div || 0) - (a.div || 0));
    if (divs.length) {
      const s = divs[Math.floor(Math.random() * Math.min(5, divs.length))];
      const price = prices[s.id]?.current;
      if (price) {
        const qty = Math.floor((total * 0.08) / price);
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
    let changed = false;

    NPCS.forEach(npc => {
      if (Math.random() > npc.decisionProb) return;

      const state = states[npc.id];
      let decision = null;

      switch (npc.archetype) {
        case "cassettista": decision = decideCassettista(state, prices); break;
        case "momentum":    decision = decideMomentum(state, prices, priceHistory); break;
        case "contrarian":  decision = decideContrarian(state, prices); break;
        case "panic":       decision = decidePanic(state, prices, activeEvents); break;
        case "quant":       decision = decideQuant(state, prices, priceHistory); break;
        case "novice":      decision = decideNovice(state, prices); break;
        case "speculator":  decision = decideSpeculator(state, prices, activeEvents); break;
        case "dividend":    decision = decideDividend(state, prices); break;
      }

      if (!decision) return;

      const { action, instrId, qty } = decision;
      const price = prices[instrId]?.current;
      if (!price || !qty || qty <= 0) return;

      const s = { ...state, portfolio: { ...state.portfolio } };

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
        const gain = Math.max(0, (price - pos.avgPrice) * qty);
        const tax = calcTax(gain, instrId);
        s.cash += qty * price - commission - tax;
        const rem = pos.qty - qty;
        if (rem <= 0) {
          const { [instrId]: _, ...rest } = s.portfolio;
          s.portfolio = rest;
        } else {
          s.portfolio[instrId] = { ...pos, qty: rem };
        }
        netPressure -= qty * price;
      }

      states[npc.id] = s;
      newTrades.push({
        npcId: npc.id, npcName: npc.name, npcAvatar: npc.avatar,
        action, instrId, qty, price, t: Date.now(),
      });
      changed = true;
    });

    // Normalize: ±€4000 net flow → ±1 pressure unit
    npcPressureRef.current = Math.max(-1, Math.min(1, netPressure / 4000));

    if (changed) {
      statesRef.current = states;
      setNpcStates({ ...states });
      setNpcTrades(prev => [...newTrades, ...prev].slice(0, 30));
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
