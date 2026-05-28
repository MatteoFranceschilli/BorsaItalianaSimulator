import { useState, useCallback } from "react";
import { fmt } from "../utils/formatters.js";
import { calcCommission, calcTax } from "../utils/tax.js";

export function usePortfolio(addAlert) {
  const [cash, setCash] = useState(1000);
  const [portfolio, setPortfolio] = useState({});
  const [trades, setTrades] = useState([]);

  const executeTrade = useCallback((instrId, side, qty, price, type) => {
    const commission = calcCommission(price * qty);
    if (side === "buy") {
      const total = price * qty + commission;
      setCash(c => {
        if (c < total) {
          addAlert?.(`Fondi insufficienti: serve €${fmt(total)}`, "error");
          return c;
        }
        setPortfolio(p => {
          const existing = p[instrId] || { qty: 0, avgPrice: 0, totalCost: 0 };
          const newQty = existing.qty + qty;
          const newCost = existing.totalCost + price * qty;
          return { ...p, [instrId]: { qty: newQty, avgPrice: newCost / newQty, totalCost: newCost } };
        });
        setTrades(t => [{
          id: Date.now(), instrId, side, qty, price, commission, tax: 0, total,
          time: new Date().toLocaleString("it-IT"), type
        }, ...t]);
        return c - total;
      });
    } else {
      setPortfolio(p => {
        const existing = p[instrId];
        if (!existing || existing.qty < qty) {
          addAlert?.("Quantità insufficiente in portafoglio", "error");
          return p;
        }
        const gain = Math.max(0, (price - existing.avgPrice) * qty);
        const tax = calcTax(gain, instrId);
        const revenue = price * qty - commission - tax;
        setCash(c => c + revenue);
        setTrades(t => [{
          id: Date.now(), instrId, side, qty, price, commission, tax, total: revenue,
          time: new Date().toLocaleString("it-IT"), type
        }, ...t]);
        const newQty = existing.qty - qty;
        const newPort = { ...p };
        if (newQty === 0) delete newPort[instrId];
        else newPort[instrId] = { qty: newQty, avgPrice: existing.avgPrice, totalCost: existing.avgPrice * newQty };
        return newPort;
      });
    }
  }, [addAlert]);

  const resetPortfolio = useCallback(() => {
    setCash(1000);
    setPortfolio({});
    setTrades([]);
  }, []);

  return { cash, setCash, portfolio, setPortfolio, trades, setTrades, executeTrade, resetPortfolio };
}
