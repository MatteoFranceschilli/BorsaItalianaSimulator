import { useState, useRef, useCallback } from "react";

const STORAGE_KEY = "borsa_all_saves";

function storageGet(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? { value: v } : null;
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function useSaveSystem() {
  const [savedGames, setSavedGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [saveId, setSaveId] = useState(null);
  const saveIdRef = useRef(null);

  const updateSaveId = (id) => { saveIdRef.current = id; setSaveId(id); };

  const saveGame = useCallback(async (explicitState) => {
    try {
      const id = saveIdRef.current || ("g" + Date.now());
      if (!saveIdRef.current) { saveIdRef.current = id; setSaveId(id); }

      const portfolioValue = Object.entries(explicitState.portfolio || {})
        .reduce((s, [pid, pos]) => s + (explicitState.prices?.[pid]?.current || 0) * pos.qty, 0);

      const saveEntry = {
        id,
        savedAt:        new Date().toISOString(),
        playerName:     explicitState.playerName || "",
        cash:           Math.round((explicitState.cash || 0) * 100) / 100,
        portfolioValue: Math.round(portfolioValue * 100) / 100,
        simTime:        (explicitState.simTime instanceof Date ? explicitState.simTime : new Date()).toISOString(),
        speed:          explicitState.speed || 24,
        portfolio:      explicitState.portfolio || {},
        orders:         (explicitState.orders || []).slice(0, 20),
        priceAlerts:    (explicitState.priceAlerts || []).slice(0, 20),
        trades:         (explicitState.trades || []).slice(0, 50),
      };

      let allSaves = [];
      try {
        const raw = storageGet(STORAGE_KEY);
        if (raw && raw.value) allSaves = JSON.parse(raw.value);
      } catch {}

      const updated = [saveEntry, ...allSaves.filter(s => s.id !== id)].slice(0, 10);
      storageSet(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error("[saveGame]", e?.message || e);
      return String(e?.message || "errore");
    }
  }, []);

  const loadSavedGames = () => {
    setLoadingGames(true);
    try {
      const raw = storageGet(STORAGE_KEY);
      if (raw && raw.value) setSavedGames(JSON.parse(raw.value));
      else setSavedGames([]);
    } catch { setSavedGames([]); }
    setLoadingGames(false);
  };

  const loadGameData = (id) => {
    try {
      const raw = storageGet(STORAGE_KEY);
      if (!raw || !raw.value) return null;
      const allSaves = JSON.parse(raw.value);
      return allSaves.find(x => x.id === id) || null;
    } catch { return null; }
  };

  const deleteGame = (id) => {
    try {
      const raw = storageGet(STORAGE_KEY);
      let allSaves = [];
      if (raw && raw.value) allSaves = JSON.parse(raw.value);
      const updated = allSaves.filter(x => x.id !== id);
      storageSet(STORAGE_KEY, JSON.stringify(updated));
      setSavedGames(updated);
    } catch (e) { console.error("Errore eliminazione:", e); }
  };

  return { savedGames, loadingGames, saveId, saveIdRef, updateSaveId, saveGame, loadSavedGames, loadGameData, deleteGame };
}
