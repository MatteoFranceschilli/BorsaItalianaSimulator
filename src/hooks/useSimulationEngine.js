import { useState, useEffect, useRef } from "react";
import { ALL_INSTRUMENTS } from "../data/instruments.js";
import { INDICES } from "../data/indices.js";
import { generatePriceChange, gaussRand } from "../utils/math.js";
import { checkMarketHours } from "../utils/marketHours.js";
import { fmt } from "../utils/formatters.js";

function buildInitialPrices() {
  const p = {};
  ALL_INSTRUMENTS.forEach(i => {
    p[i.id] = { current: i.price, prev: i.price, open: i.price, high: i.price, low: i.price, pctChange: 0 };
  });
  INDICES.forEach(i => {
    p[i.id] = { current: i.value, prev: i.value, open: i.value, high: i.value, low: i.value, pctChange: 0 };
  });
  return p;
}

export function useSimulationEngine({
  running, speed, screen, playerName,
  ordersRef, priceAlertsRef,
  executeTrade, addAlert,
  setPriceHistory,
  setCash, setPortfolio, setTrades, setOrders, setPriceAlerts,
  saveGameRef,
  checkRandomEvent,
  tickEvents,
  getEventModForSector,
}) {
  const [prices, setPrices] = useState(buildInitialPrices);
  const [simTime, setSimTime] = useState(new Date("2025-01-02T09:00:00"));
  const [marketStatus, setMarketStatus] = useState("APERTO");
  const [marketSentiment, setMarketSentiment] = useState(0);
  const [tick, setTick] = useState(0);

  const tRef = useRef(0);
  const lastSaveRef = useRef(Date.now());
  const prevPricesRef = useRef({});
  const marketStatusRef = useRef("APERTO");
  const marketSentimentRef = useRef(0);
  const pricesRef = useRef(buildInitialPrices());

  // simTimeRef tracks current simTime without stale closure issues in the interval
  const simTimeRef = useRef(new Date("2025-01-02T09:00:00"));

  // Sets both React state and the ref (used by App.jsx when loading saves or resetting)
  const setSimTimeBoth = (t) => {
    const d = t instanceof Date ? t : new Date(t);
    simTimeRef.current = d;
    setSimTime(d);
  };

  const resetPrices = () => {
    const p = buildInitialPrices();
    pricesRef.current = p;
    setPrices(p);
    tRef.current = 0;
    lastSaveRef.current = Date.now();
    simTimeRef.current = new Date("2025-01-02T09:00:00");
    setSimTime(new Date("2025-01-02T09:00:00"));
    marketSentimentRef.current = 0;
    setMarketSentiment(0);
  };

  useEffect(() => {
    if (!running) return;

    const intervalId = setInterval(() => {
      const simSeconds = speed;
      tRef.current += simSeconds;
      const t = tRef.current;

      // Advance sim time via ref (avoids stale closure)
      const nextTime = new Date(simTimeRef.current.getTime() + simSeconds * 1000);
      simTimeRef.current = nextTime;
      setSimTime(nextTime);

      const newStatus = checkMarketHours(nextTime);
      marketStatusRef.current = newStatus;
      setMarketStatus(newStatus);

      // Tick active events (decrement remaining duration) — always, even when closed
      if (tickEvents) tickEvents(simSeconds);

      // Check for new random events — always
      let triggeredEvents = [];
      if (checkRandomEvent) {
        triggeredEvents = checkRandomEvent(simSeconds, nextTime);
      }

      // Drift sentiment + apply event sentiment effects in a single update
      setMarketSentiment(prev => {
        let next = Math.max(-3, Math.min(3, prev + gaussRand() * 0.3));
        triggeredEvents.forEach(ev => {
          next = Math.max(-3, Math.min(3, next + (ev.sentimentEffect || 0)));
        });
        marketSentimentRef.current = next;
        return next;
      });

      // Notify user of new events
      triggeredEvents.forEach(ev => {
        addAlert(`📰 ${ev.icon} BREAKING: ${ev.title}`, "warning");
      });

      if (marketStatusRef.current === "APERTO") {
        // Update prices
        setPrices(prev => {
          const next = { ...prev };
          prevPricesRef.current = { ...prev };
          pricesRef.current = next;

          const sentiment = marketSentimentRef.current;

          ALL_INSTRUMENTS.forEach(instr => {
            const eventMod = getEventModForSector ? getEventModForSector(instr.sector) : null;
            const chg = generatePriceChange(instr, sentiment, simSeconds, eventMod);
            const oldP = next[instr.id].current;
            const newP = Math.max(oldP * 0.5, oldP * (1 + chg));
            next[instr.id] = {
              current: newP, prev: oldP,
              open: next[instr.id].open,
              high: Math.max(next[instr.id].high, newP),
              low: Math.min(next[instr.id].low, newP),
              pctChange: (newP / next[instr.id].open - 1) * 100,
            };
          });

          INDICES.forEach(idx => {
            const chg = generatePriceChange({ beta: 1.0 }, sentiment, simSeconds);
            const oldV = next[idx.id].current;
            const newV = oldV * (1 + chg);
            next[idx.id] = {
              current: newV, prev: oldV,
              open: next[idx.id].open,
              high: Math.max(next[idx.id].high, newV),
              low: Math.min(next[idx.id].low, newV),
              pctChange: (newV / next[idx.id].open - 1) * 100,
            };
          });

          return next;
        });

        // Sample price history every 30 sim seconds
        if (t % 30 === 0) {
          setPriceHistory(prev => {
            const next = { ...prev };
            const currentPrices = pricesRef.current;
            ALL_INSTRUMENTS.forEach(instr => {
              next[instr.id] = [...(prev[instr.id] || []).slice(-200), { t, v: currentPrices[instr.id]?.current || instr.price }];
            });
            INDICES.forEach(idx => {
              next[idx.id] = [...(prev[idx.id] || []).slice(-200), { t, v: currentPrices[idx.id]?.current || idx.value }];
            });
            return next;
          });
        }

        // Check pending orders
        const currentOrders = ordersRef.current || [];
        if (currentOrders.length > 0) {
          setOrders(prevOrders => {
            const remaining = [];
            prevOrders.forEach(ord => {
              const cp = pricesRef.current[ord.instrId]?.current;
              if (!cp) { remaining.push(ord); return; }
              let triggered = false;
              if (ord.type === "limit" && ord.side === "buy"  && cp <= ord.limitPrice) triggered = true;
              if (ord.type === "limit" && ord.side === "sell" && cp >= ord.limitPrice) triggered = true;
              if (ord.type === "stop"  && ord.side === "sell" && cp <= ord.stopPrice)  triggered = true;
              if (triggered) {
                executeTrade(ord.instrId, ord.side, ord.qty, cp, "limit/stop");
                addAlert(`Ordine eseguito: ${ord.side === "buy" ? "BUY" : "SELL"} ${ord.qty}x ${ord.instrId} @ €${fmt(cp)}`, "success");
              } else {
                remaining.push(ord);
              }
            });
            return remaining;
          });
        }

        // Check price alerts
        const currentAlerts = priceAlertsRef.current || [];
        if (currentAlerts.length > 0) {
          setPriceAlerts(prevAlerts =>
            prevAlerts.filter(a => {
              const cp = pricesRef.current[a.instrId]?.current;
              if (!cp) return true;
              const triggered = a.dir === "above" ? cp >= a.targetPrice : cp <= a.targetPrice;
              if (triggered) {
                addAlert(`🔔 ALERT: ${a.instrId} ha raggiunto €${fmt(cp)} (target: €${fmt(a.targetPrice)})`, "warning");
                return false;
              }
              return true;
            })
          );
        }

        // Dividends (rare random event)
        if (Math.random() < 0.001 * simSeconds / 3600) {
          setPortfolio(prev => {
            Object.entries(prev).forEach(([id, pos]) => {
              const instr = ALL_INSTRUMENTS.find(i => i.id === id);
              if (instr?.div && instr.div > 0 && pos.qty > 0) {
                const divAmount = pos.qty * (pricesRef.current[id]?.current || 0) * (instr.div / 100 / 12);
                if (divAmount > 0) {
                  setCash(c => c + divAmount);
                  addAlert(`💰 Dividendo ricevuto: €${fmt(divAmount)} da ${id}`, "success");
                }
              }
            });
            return prev;
          });
        }

        // Auto-save every 15 min real time
        const now = Date.now();
        if (now - lastSaveRef.current >= 15 * 60 * 1000 && screen === "playing" && playerName && saveGameRef?.current) {
          lastSaveRef.current = now;
          saveGameRef.current();
        }
      }

      setTick(t => t + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [running, speed]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    prices, setPrices,
    simTime, setSimTimeBoth,
    marketStatus, setMarketStatus,
    marketSentiment, setMarketSentiment,
    tick, tRef, lastSaveRef, resetPrices,
  };
}
