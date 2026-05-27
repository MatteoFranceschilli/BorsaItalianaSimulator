import { useState } from "react";

export function usePriceAlerts() {
  const [priceAlerts, setPriceAlerts] = useState([]);

  const addPriceAlert = (alert) => setPriceAlerts(a => [...a, alert]);

  const removePriceAlert = (id) => setPriceAlerts(a => a.filter(x => x.id !== id));

  const clearPriceAlerts = () => setPriceAlerts([]);

  return { priceAlerts, setPriceAlerts, addPriceAlert, removePriceAlert, clearPriceAlerts };
}
