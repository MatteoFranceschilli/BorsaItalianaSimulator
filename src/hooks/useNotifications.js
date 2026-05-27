import { useState, useCallback } from "react";

export function useNotifications() {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((msg, type = "info") => {
    const id = Date.now();
    setAlerts(a => [{ id, msg, type, time: new Date().toLocaleTimeString("it-IT") }, ...a.slice(0, 29)]);
    setTimeout(() => setAlerts(a => a.filter(x => x.id !== id)), 8000);
  }, []);

  return { alerts, addAlert };
}
