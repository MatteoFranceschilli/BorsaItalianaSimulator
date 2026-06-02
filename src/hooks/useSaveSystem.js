import { useState, useRef, useCallback } from "react";

const CLIENT_KEY_STORAGE = "borsa_client_key";
const API_BASE = import.meta.env.VITE_API_URL || "";

function getClientKey() {
  let key = localStorage.getItem(CLIENT_KEY_STORAGE);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(CLIENT_KEY_STORAGE, key);
  }
  return key;
}

export function useSaveSystem() {
  const [savedGames, setSavedGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [saveId, setSaveId] = useState(null);
  const saveIdRef = useRef(null);
  const clientKey = useRef(getClientKey());

  const updateSaveId = (id) => { saveIdRef.current = id; setSaveId(id); };

  const saveGame = useCallback(async (explicitState) => {
    try {
      const id = saveIdRef.current || ("g" + Date.now());
      if (!saveIdRef.current) { saveIdRef.current = id; setSaveId(id); }

      const portfolioValue = Object.entries(explicitState.portfolio || {})
        .reduce((s, [pid, pos]) => s + (explicitState.prices?.[pid]?.current || 0) * pos.qty, 0);

      const saveEntry = {
        saveId:         id,
        clientKey:      clientKey.current,
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

      const res = await fetch(`${API_BASE}/api/saves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saveEntry),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      return true;
    } catch (e) {
      console.error("[saveGame]", e?.message || e);
      return String(e?.message || "errore");
    }
  }, []);

  const loadSavedGames = async () => {
    setLoadingGames(true);
    try {
      const res = await fetch(`${API_BASE}/api/saves?clientKey=${clientKey.current}`);
      if (!res.ok) throw new Error(await res.text());
      setSavedGames(await res.json());
    } catch (e) {
      console.error("[loadSavedGames]", e);
      setSavedGames([]);
    } finally {
      setLoadingGames(false);
    }
  };

  const loadGameData = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/saves/${id}?clientKey=${clientKey.current}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const deleteGame = async (id) => {
    try {
      await fetch(`${API_BASE}/api/saves/${id}?clientKey=${clientKey.current}`, {
        method: "DELETE",
      });
      setSavedGames(prev => prev.filter(x => x.id !== id));
    } catch (e) {
      console.error("Errore eliminazione:", e);
    }
  };

  return { savedGames, loadingGames, saveId, saveIdRef, updateSaveId, saveGame, loadSavedGames, loadGameData, deleteGame };
}
