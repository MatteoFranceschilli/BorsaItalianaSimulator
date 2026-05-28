import { useState, useRef } from "react";

import { ALL_INSTRUMENTS } from "./data/instruments.js";
import { STOCKS } from "./data/stocks.js";
import { ETFS } from "./data/etfs.js";
import { INDICES } from "./data/indices.js";

import { fmt, fmtEur, fmtPct, clr, clrCls } from "./utils/formatters.js";

import { useTheme } from "./hooks/useTheme.js";
import { useNotifications } from "./hooks/useNotifications.js";
import { usePortfolio } from "./hooks/usePortfolio.js";
import { usePendingOrders } from "./hooks/usePendingOrders.js";
import { usePriceAlerts } from "./hooks/usePriceAlerts.js";
import { usePriceHistory } from "./hooks/usePriceHistory.js";
import { useSaveSystem } from "./hooks/useSaveSystem.js";
import { useSimulationEngine } from "./hooks/useSimulationEngine.js";
import { useMarketEvents } from "./hooks/useMarketEvents.js";

import StartScreen from "./components/screens/StartScreen.jsx";
import NewGameScreen from "./components/screens/NewGameScreen.jsx";
import LoadGameScreen from "./components/screens/LoadGameScreen.jsx";

import DashboardTab from "./components/tabs/DashboardTab.jsx";
import MarketsTab from "./components/tabs/MarketsTab.jsx";
import TradingTab from "./components/tabs/TradingTab.jsx";
import PortfolioTab from "./components/tabs/PortfolioTab.jsx";
import OrdersTab from "./components/tabs/OrdersTab.jsx";
import HistoryTab from "./components/tabs/HistoryTab.jsx";
import AnalyticsTab from "./components/tabs/AnalyticsTab.jsx";
import AlertsTab from "./components/tabs/AlertsTab.jsx";
import NewsTab from "./components/tabs/NewsTab.jsx";
import WikiTab from "./components/tabs/WikiTab.jsx";

const TABS = ["dashboard", "mercati", "trading", "portafoglio", "ordini", "storico", "analisi", "alert", "notizie", "wiki"];
const TAB_LABELS = {
  dashboard:   "📊 Dashboard",
  mercati:     "📈 Mercati",
  trading:     "⚡ Trading",
  portafoglio: "💼 Portafoglio",
  storico:     "📋 Storico",
  analisi:     "🔬 Analisi",
  alert:       "🚨 Alert",
  notizie:     "📰 Notizie",
  wiki:        "📚 Wiki",
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { alerts, addAlert } = useNotifications();

  const { cash, setCash, portfolio, setPortfolio, trades, setTrades, executeTrade, resetPortfolio } = usePortfolio(addAlert);
  const { orders, setOrders, addOrder, removeOrder, clearOrders } = usePendingOrders();
  const { priceAlerts, setPriceAlerts, addPriceAlert, removePriceAlert } = usePriceAlerts();
  const { priceHistory, setPriceHistory, resetHistory } = usePriceHistory();
  const { savedGames, loadingGames, saveIdRef, updateSaveId, saveGame, loadSavedGames, loadGameData, deleteGame } = useSaveSystem();
  const { activeEvents, pastEvents, checkRandomEvent, tickEvents, getEventModForSector, resetEvents } = useMarketEvents();

  // Screen routing
  const [screen, setScreen] = useState("start");
  const [playerName, setPlayerName] = useState("");

  // Simulation control
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(24);

  // Active tab / UI state
  const [tab, setTab] = useState("dashboard");
  const [selectedInstr, setSelectedInstr] = useState(null);
  const [orderType, setOrderType] = useState("market");
  const [orderSide, setOrderSide] = useState("buy");
  const [orderQty, setOrderQty] = useState(1);
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [orderMsg, setOrderMsg] = useState("");
  const [showOpDesc, setShowOpDesc] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Alert form state
  const [alertInstr, setAlertInstr] = useState("");
  const [alertPrice, setAlertPrice] = useState("");
  const [alertDir, setAlertDir] = useState("above");

  // Refs for simulation engine (avoid stale closures)
  const ordersRef = useRef(orders);
  ordersRef.current = orders;
  const priceAlertsRef = useRef(priceAlerts);
  priceAlertsRef.current = priceAlerts;

  const saveGameRef = useRef(null);
  const pricesForSave = useRef({});

  const {
    prices, setPrices, simTime, setSimTimeBoth,
    marketStatus, setMarketStatus, marketSentiment, setMarketSentiment,
    tick, tRef, lastSaveRef, resetPrices,
  } = useSimulationEngine({
    running, speed, screen, playerName,
    ordersRef, priceAlertsRef,
    executeTrade, addAlert,
    setPriceHistory,
    setCash, setPortfolio, setTrades, setOrders, setPriceAlerts,
    saveGameRef,
    checkRandomEvent,
    tickEvents,
    getEventModForSector,
  });

  pricesForSave.current = prices;

  saveGameRef.current = () => {
    saveGame({ playerName, cash, portfolio, trades, orders, priceAlerts, simTime, speed, prices: pricesForSave.current, priceHistory });
  };

  // Derived portfolio stats
  const portfolioValue = Object.entries(portfolio).reduce((sum, [id, pos]) => sum + (prices[id]?.current || 0) * pos.qty, 0);
  const totalValue = cash + portfolioValue;
  const totalPnl = totalValue - 1000;
  const totalPnlPct = (totalValue / 1000 - 1) * 100;

  const positions = Object.entries(portfolio).map(([id, pos]) => {
    const cp = prices[id]?.current || pos.avgPrice;
    const mktVal = cp * pos.qty;
    const pnl = (cp - pos.avgPrice) * pos.qty;
    const pnlPct = (cp / pos.avgPrice - 1) * 100;
    const instr = ALL_INSTRUMENTS.find(i => i.id === id);
    return { id, ...pos, currentPrice: cp, mktVal, pnl, pnlPct, name: instr?.name || id, category: instr?.category };
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStartNew = (name) => {
    setPlayerName(name);
    updateSaveId(`save_${Date.now()}`);
    setRunning(true);
    setScreen("playing");
  };

  const handleLoadGame = (id) => {
    const s = loadGameData(id);
    if (!s) return;
    setRunning(false);
    setPlayerName(s.playerName);
    updateSaveId(id);
    setCash(s.cash);
    setPortfolio(s.portfolio || {});
    setTrades(s.trades || []);
    setOrders(s.orders || []);
    setPriceAlerts(s.priceAlerts || []);
    setSimTimeBoth(new Date(s.simTime));
    setSpeed(s.speed || 24);
    tRef.current = 0;
    lastSaveRef.current = Date.now();
    saveIdRef.current = id;
    setScreen("playing");
    setTimeout(() => setRunning(true), 100);
  };

  const handleSave = async () => {
    setSaveMsg("...");
    const result = await saveGame({ playerName, cash, portfolio, trades, orders, priceAlerts, simTime, speed, prices, priceHistory });
    setSaveMsg(result === true ? "✓ Salvato" : "✗ " + String(result).slice(0, 18));
    setTimeout(() => setSaveMsg(""), 3500);
  };

  const handleReset = () => {
    setShowReset(false);
    setRunning(false);
    resetPortfolio();
    clearOrders();
    setPriceAlerts([]);
    resetEvents();
    setMarketSentiment(0);
    setSimTimeBoth(new Date("2025-01-02T09:00:00"));
    setSpeed(24);
    setOrderMsg("");
    setSelectedInstr(null);
    tRef.current = 0;
    lastSaveRef.current = Date.now();
    saveIdRef.current = null;
    resetPrices();
    resetHistory();
    setTimeout(() => setRunning(true), 50);
  };

  const handleOrder = () => {
    if (!selectedInstr) { setOrderMsg("Seleziona uno strumento"); return; }
    const p = prices[selectedInstr.id]?.current;
    if (!p) return;
    const qty = parseInt(orderQty);
    if (isNaN(qty) || qty <= 0) { setOrderMsg("Quantità non valida"); return; }

    if (orderType === "market") {
      executeTrade(selectedInstr.id, orderSide, qty, p, "market");
      setOrderMsg(`Ordine market ${orderSide === "buy" ? "BUY" : "SELL"} eseguito @ €${fmt(p)}`);
    } else if (orderType === "limit") {
      const lp = parseFloat(limitPrice);
      if (isNaN(lp)) { setOrderMsg("Prezzo limite non valido"); return; }
      addOrder({ id: Date.now(), instrId: selectedInstr.id, side: orderSide, qty, type: "limit", limitPrice: lp, time: new Date().toLocaleString("it-IT") });
      setOrderMsg(`Ordine limite: ${orderSide} ${qty}x ${selectedInstr.id} @ €${fmt(lp)}`);
    } else if (orderType === "stop") {
      const sp = parseFloat(stopPrice);
      if (isNaN(sp)) { setOrderMsg("Prezzo stop non valido"); return; }
      addOrder({ id: Date.now(), instrId: selectedInstr.id, side: orderSide, qty, type: "stop", stopPrice: sp, time: new Date().toLocaleString("it-IT") });
      setOrderMsg(`Stop loss: ${qty}x ${selectedInstr.id} trigger @ €${fmt(sp)}`);
    }
  };

  const handleAddPriceAlert = () => {
    if (!alertInstr || !alertPrice) return;
    const p = parseFloat(alertPrice);
    if (isNaN(p)) return;
    addPriceAlert({ id: Date.now(), instrId: alertInstr, targetPrice: p, dir: alertDir });
    addAlert(`Alert impostato: ${alertInstr} ${alertDir === "above" ? "≥" : "≤"} €${fmt(p)}`, "info");
    setAlertInstr("");
    setAlertPrice("");
  };

  // ── Screen routing ─────────────────────────────────────────────────────────
  if (screen === "start") {
    return <StartScreen theme={theme} toggleTheme={toggleTheme} onNewGame={() => setScreen("newGame")} onLoadGame={() => { setScreen("loadGame"); loadSavedGames(); }} />;
  }

  if (screen === "newGame") {
    return <NewGameScreen theme={theme} onStart={handleStartNew} onBack={() => setScreen("start")} />;
  }

  if (screen === "loadGame") {
    return (
      <LoadGameScreen
        theme={theme}
        savedGames={savedGames}
        loadingGames={loadingGames}
        onLoad={handleLoadGame}
        onDelete={deleteGame}
        onBack={() => setScreen("start")}
        onNewGame={() => setScreen("newGame")}
      />
    );
  }

  // ── Main game layout ───────────────────────────────────────────────────────
  return (
    <div className={`app theme-${theme}`}>
      {/* TICKER TAPE */}
      <div className="ticker-tape">
        <div className="ticker-inner">
          {[...STOCKS, ...ETFS].map(i => {
            const p = prices[i.id];
            if (!p) return null;
            return (
              <span key={i.id} className="ticker-item">
                <span style={{ color: "#e8c96c" }}>{i.id}</span>
                <span style={{ color: "var(--gc)" }}>€{fmt(p.current)}</span>
                <span style={{ color: clr(p.pctChange) }}>{fmtPct(p.pctChange)}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* BREAKING NEWS BANNER (visible when events are active) */}
      {activeEvents.length > 0 && (
        <div
          style={{
            background: "rgba(255,109,0,0.15)",
            borderBottom: "1px solid #ff6d00",
            padding: "5px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => setTab("notizie")}
          title="Vai alla scheda Notizie"
        >
          <span style={{ fontFamily: "Space Mono", fontSize: 10, color: "#ff6d00", fontWeight: 700, flexShrink: 0, letterSpacing: 1 }}>
            📡 BREAKING
          </span>
          <div style={{ overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>
            <span style={{ fontSize: 11, color: "var(--gc)" }}>
              {activeEvents.map(e => `${e.icon} ${e.title}`).join("  ·  ")}
            </span>
          </div>
          <span style={{ fontFamily: "Space Mono", fontSize: 10, color: "#ff6d00", flexShrink: 0 }}>
            {activeEvents.length} evento{activeEvents.length > 1 ? "i" : ""} attiv{activeEvents.length > 1 ? "i" : "o"} →
          </span>
        </div>
      )}

      {/* HEADER */}
      <div className="header">
        <div className="logo">
          🇮🇹 <span>BORSA</span>ITALIANA <span style={{ color: "var(--text3)", fontSize: 12 }}>SIM</span>
        </div>
        <div className="index-ticker">
          {INDICES.map(idx => {
            const p = prices[idx.id];
            if (!p) return null;
            return (
              <div className="idx-chip" key={idx.id}>
                <span className="idx-name">{idx.name}</span>
                <span className="idx-val">{fmt(p.current, 1)}</span>
                <span className="idx-chg" style={{ color: clr(p.pctChange) }}>{fmtPct(p.pctChange)}</span>
              </div>
            );
          })}
        </div>
        <div className="header-right">
          <span className="sim-time">
            {simTime.toLocaleDateString("it-IT", { weekday: "short", day: "2-digit", month: "short" })}{" "}
            {simTime.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className={`market-badge ${marketStatus === "APERTO" ? "market-open" : marketStatus === "PRE-APERTURA" ? "market-pre" : "market-closed"}`}>
            {marketStatus}
          </span>
          <div className="speed-ctrl">
            <button className="speed-btn" onClick={() => setSpeed(s => Math.max(1, s / 2))}>−</button>
            <span className="speed-label">×{speed}</span>
            <button className="speed-btn" onClick={() => setSpeed(s => Math.min(3600, s * 2))}>+</button>
          </div>
          <button className="play-btn" onClick={() => setRunning(r => !r)}>
            {running ? "⏸ PAUSA" : "▶ PLAY"}
          </button>
          <button className="play-btn" style={{ color: "#00e676", borderColor: "#00e676" }} onClick={handleSave}>
            {saveMsg || "💾 SALVA"}
          </button>
          <button className="play-btn" style={{ color: "#ff6d00", borderColor: "#ff6d00" }} onClick={() => setShowReset(true)}>
            ↺ RESET
          </button>
          <button
            onClick={toggleTheme}
            style={{ background: "transparent", border: "1px solid var(--border2)", color: "var(--text2)", padding: "3px 9px", borderRadius: 3, cursor: "pointer", fontFamily: "Space Mono, monospace", fontSize: 13, flexShrink: 0 }}
            title={theme === "dark" ? "Passa al tema chiaro" : "Passa al tema scuro"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            className="play-btn"
            onClick={() => { setRunning(false); setScreen("start"); }}
            style={{ color: "var(--text3)", borderColor: "var(--border2)", flexShrink: 0 }}
            title="Torna alla schermata iniziale"
          >🏠</button>
          {playerName && (
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: 11, color: "var(--gold)", flexShrink: 0, borderLeft: "1px solid var(--border2)", paddingLeft: 10 }}>
              👤 {playerName}
            </span>
          )}
        </div>
      </div>

      {/* PORTFOLIO STRIP */}
      <div className="portfolio-strip">
        <div className="pf-metric">
          <span className="pf-label">Liquidità</span>
          <span className="pf-value gold">{fmtEur(cash)}</span>
        </div>
        <div className="pf-metric">
          <span className="pf-label">Portafoglio</span>
          <span className="pf-value">{fmtEur(portfolioValue)}</span>
        </div>
        <div className="pf-metric">
          <span className="pf-label">Totale</span>
          <span className="pf-value gold">{fmtEur(totalValue)}</span>
        </div>
        <div className="pf-metric">
          <span className="pf-label">P&L</span>
          <span className={`pf-value ${clrCls(totalPnl)}`}>{totalPnl >= 0 ? "+" : ""}{fmtEur(totalPnl)} ({fmtPct(totalPnlPct)})</span>
        </div>
        <div className="pf-metric">
          <span className="pf-label">Posizioni</span>
          <span className="pf-value">{positions.length}</span>
        </div>
        <div className="pf-metric">
          <span className="pf-label">Ordini Attivi</span>
          <span className="pf-value" style={{ color: orders.length > 0 ? "#ffc107" : "var(--text3)" }}>{orders.length}</span>
        </div>
        <div className="pf-metric" style={{ marginLeft: "auto" }}>
          <span className="pf-label">Sentiment</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="sentiment-bar" style={{ width: 100 }}>
              <div className="sentiment-dot" style={{ left: `${((marketSentiment + 3) / 6) * 100}%` }} />
            </div>
            <span style={{ fontFamily: "Space Mono", fontSize: 10, color: clr(marketSentiment) }}>
              {marketSentiment > 0.5 ? "BULL" : marketSentiment < -0.5 ? "BEAR" : "NEUTRO"}
            </span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        {TABS.map(t => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "ordini"
              ? `🔔 Ordini (${orders.length})`
              : t === "notizie" && activeEvents.length > 0
                ? `📰 Notizie (${activeEvents.length})`
                : TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="main">
        {tab === "dashboard" && (
          <DashboardTab
            prices={prices}
            priceHistory={priceHistory}
            cash={cash}
            portfolioValue={portfolioValue}
            totalValue={totalValue}
            totalPnl={totalPnl}
            totalPnlPct={totalPnlPct}
            positions={positions}
            activeEvents={activeEvents}
            onSelectInstr={setSelectedInstr}
            onSetTab={setTab}
          />
        )}

        {tab === "mercati" && (
          <MarketsTab
            prices={prices}
            priceHistory={priceHistory}
            selectedInstr={selectedInstr}
            onSelectInstr={setSelectedInstr}
            onSetTab={setTab}
            onSetOrderSide={setOrderSide}
          />
        )}

        {tab === "trading" && (
          <TradingTab
            prices={prices}
            priceHistory={priceHistory}
            portfolio={portfolio}
            selectedInstr={selectedInstr}
            onSelectInstr={setSelectedInstr}
            orderType={orderType}
            onSetOrderType={setOrderType}
            orderSide={orderSide}
            onSetOrderSide={setOrderSide}
            orderQty={orderQty}
            onSetOrderQty={setOrderQty}
            limitPrice={limitPrice}
            onSetLimitPrice={setLimitPrice}
            stopPrice={stopPrice}
            onSetStopPrice={setStopPrice}
            orderMsg={orderMsg}
            marketStatus={marketStatus}
            showOpDesc={showOpDesc}
            onSetShowOpDesc={setShowOpDesc}
            onSubmitOrder={handleOrder}
          />
        )}

        {tab === "portafoglio" && (
          <PortfolioTab
            cash={cash}
            portfolioValue={portfolioValue}
            totalValue={totalValue}
            totalPnl={totalPnl}
            totalPnlPct={totalPnlPct}
            positions={positions}
            tradesCount={trades.length}
            priceHistory={priceHistory}
            onClose={pos => {
              executeTrade(pos.id, "sell", pos.qty, pos.currentPrice, "market");
              addAlert(`SELL ALL: ${pos.id} @ €${fmt(pos.currentPrice)}`, "info");
            }}
          />
        )}

        {tab === "ordini" && (
          <OrdersTab
            orders={orders}
            prices={prices}
            onRemoveOrder={removeOrder}
            onClearOrders={clearOrders}
          />
        )}

        {tab === "storico" && <HistoryTab trades={trades} />}

        {tab === "analisi" && (
          <AnalyticsTab
            positions={positions}
            trades={trades}
            prices={prices}
            portfolioValue={portfolioValue}
            totalValue={totalValue}
          />
        )}

        {tab === "alert" && (
          <AlertsTab
            priceAlerts={priceAlerts}
            alerts={alerts}
            prices={prices}
            alertInstr={alertInstr}
            alertPrice={alertPrice}
            alertDir={alertDir}
            onAlertInstrChange={setAlertInstr}
            onAlertPriceChange={setAlertPrice}
            onAlertDirChange={setAlertDir}
            onAddAlert={handleAddPriceAlert}
            onRemoveAlert={removePriceAlert}
          />
        )}

        {tab === "notizie" && (
          <NewsTab
            activeEvents={activeEvents}
            pastEvents={pastEvents}
          />
        )}

        {tab === "wiki" && <WikiTab />}
      </div>

      {/* FLOATING ALERTS */}
      <div className="alerts-container">
        {alerts.slice(0, 4).map(a => (
          <div key={a.id} className={`alert-toast alert-${a.type}`}>{a.msg}</div>
        ))}
      </div>

      {/* RESET MODAL */}
      {showReset && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "var(--bg2)", border: "1px solid #ff6d00", borderTop: "3px solid #ff6d00", borderRadius: 6, padding: 28, maxWidth: 360, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>↺</div>
            <div style={{ fontFamily: "Space Mono", fontSize: 14, fontWeight: 700, color: "#ff6d00", marginBottom: 8 }}>Reset Simulazione</div>
            <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6, marginBottom: 24 }}>
              Tutti i dati verranno azzerati:<br />portafoglio, trade, ordini, prezzi e storia grafici.<br />Si ricomincia da €1.000.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowReset(false)}
                style={{ flex: 1, padding: "10px", background: "var(--bg3)", border: "1px solid var(--border-inline2)", color: "var(--text2)", borderRadius: 3, fontFamily: "Space Mono", fontSize: 12, cursor: "pointer" }}
              >Annulla</button>
              <button
                onClick={handleReset}
                style={{ flex: 1, padding: "10px", background: "rgba(255,109,0,0.15)", border: "1px solid #ff6d00", color: "#ff6d00", borderRadius: 3, fontFamily: "Space Mono", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
              >↺ Conferma Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
