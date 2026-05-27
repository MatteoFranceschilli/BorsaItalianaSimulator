# BORSA ITALIANA SIMULATOR — DOCUMENTO DI ARCHITETTURA
## Guida al Refactoring: Dipendenze, Relazioni e Struttura del Codice

> **Scopo**: Questo documento mappa in modo esaustivo la struttura attuale del file `borsa-italiana-sim.jsx` (~2.960 righe, componente React monolitico). Serve come base per la riscrittura in architettura modulare.

---

## 1. STRUTTURA ATTUALE (Monolite)

```
borsa-italiana-sim.jsx  (~2960 righe)
│
├── [r.1-3]      Import React hooks
├── [r.4-220]    Costanti dati strumenti (STOCKS, ETFS, BONDS, DERIVATIVES, FONDI, INDICES, ALL_INSTRUMENTS)
├── [r.221-429]  Costanti statiche UI (OP_DESCRIPTIONS, WIKI_ARTICLES)
├── [r.430-448]  Funzioni pure matematiche (gaussRand, generatePriceChange)
├── [r.450-...]  Componente unico `BorsaItaliana()`
│   ├── State declarations (~50 useState)
│   ├── Refs (~8 useRef)
│   ├── Storage layer (storageGet, storageSet, saveGame, loadGame, deleteGame, loadSavedGames)
│   ├── Simulation engine (useEffect con setInterval)
│   ├── Trade execution (executeTrade — funzione non-hook)
│   ├── Order handling (handleOrder)
│   ├── Alert system (addAlert)
│   ├── Sub-components inline (Sparkline, PriceChart, InstrumentRow, WikiArticle, OpDescModal)
│   ├── Schermate iniziali (render condizionale: start / newGame / loadGame)
│   └── Main render (~1500 righe JSX con 8 tab)
└── [fine file]  Chiusura componente
```

---

## 2. LAYER DATI (Costanti — nessuna dipendenza)

### 2.1 Strumenti Finanziari

| Costante | Righe | Tipo | Campi principali |
|---|---|---|---|
| `STOCKS` | 4–71 | `Array<Stock>` | `id, name, sector, price, beta, div` |
| `ETFS` | 72–114 | `Array<ETF>` | `id, name, price, beta, type, ter, replica` |
| `BONDS` | 115–152 | `Array<Bond>` | `id, name, price, coupon, maturity, rating, duration` |
| `DERIVATIVES` | 153–192 | `Array<Derivative>` | `id, name, price, type, underlying, strike, optType, delta, multiplier, margin` |
| `INDICES` | 194–199 | `Array<Index>` | `id, name, value` |
| `FONDI` | 201–212 | `Array<Fund>` | `id, name, price, beta, category, subtype, ter` |
| `ALL_INSTRUMENTS` | 214–220 | `Array<Instrument>` | merge di tutti, con `category` aggiunto |

**Relazioni dati**:
- `ALL_INSTRUMENTS` è derivato da STOCKS + ETFS + BONDS + DERIVATIVES + FONDI con spread operator
- `INDICES` NON è incluso in `ALL_INSTRUMENTS` — trattato separatamente nel motore di simulazione
- I `DERIVATIVES` con `underlying` (es. "ENI") fanno riferimento logico a `STOCKS[id]` ma non c'è un link strutturale — è solo una stringa
- `FONDI` ha già `category:"Fondo"` hardcoded, gli altri la ricevono via `.map()`

**Problemi da risolvere nel refactoring**:
- `FONDI` ha `category` già dentro, gli altri no → inconsistenza di schema
- `DERIVATIVES` mescola tipi molto diversi (Future, Option, Warrant, Certificato) in un unico array piatto
- `BONDS` manca il campo `ytm` calcolato (c'era in una versione precedente) → duplicato in alcune righe, mancante in altre
- Nessun tipo TypeScript → difficile rilevare errori

### 2.2 Costanti UI Statiche

| Costante | Righe | Tipo | Uso |
|---|---|---|---|
| `OP_DESCRIPTIONS` | ~222-350 | `Record<string, OpDesc>` | Modal descrizione ordini nel pannello Trading |
| `WIKI_ARTICLES` | ~351-428 | `Array<WikiArticle>` | Tab Wiki — articoli enciclopedici |

**Struttura `OP_DESCRIPTIONS`**:
- Chiavi: `"market-buy"`, `"market-sell"`, `"limit-buy"`, `"limit-sell"`, `"stop-sell"`
- Campi: `icon, label, color, riskLevel, short, when, pro[], con[], example, note`
- Consumato da: `OpDescModal` component + banner inline nel pannello ordini

**Struttura `WIKI_ARTICLES`**:
- Campi: `id, icon, title, tag, color, summary, sections[]`
- Ogni sezione: `{ h: string, body?: string, list?: string[] }`
- Consumato da: `WikiArticle` modal component + tab Wiki

---

## 3. FUNZIONI PURE (Zero dipendenze esterne)

### 3.1 Matematica / Finanza

```javascript
gaussRand()
// Input: nessuno
// Output: number (distribuzione normale standard, Box-Muller)
// Dipendenze: Math.random(), Math.sqrt(), Math.log(), Math.cos()
// Consumatori: generatePriceChange()

generatePriceChange(instrument, marketSentiment, deltaTime)
// Input: {beta?, category?}, number [-3,+3], number (secondi)
// Output: number (variazione percentuale come decimale, es. 0.012 = +1.2%)
// Formula: GBM (Geometric Brownian Motion) + effetto sentiment
// Dipendenze: gaussRand()
// Consumatori: sim loop (useEffect) per ALL_INSTRUMENTS + INDICES
// NOTA: volatilità annualizzata hardcoded per categoria:
//   Obbligazioni=3%, ETF=12%, Derivati=40%, altro=22%
```

### 3.2 Formattazione (inline nel componente, candidati all'estrazione)

```javascript
fmt(n, dec=2)     // → stringa localizzata it-IT, es. "14.823,45"
fmtEur(n)         // → "€" + fmt(|n|)
fmtPct(n)         // → "+1,23%" o "-0,45%"
clr(n)            // → "#00e676" (verde) o "#ff1744" (rosso) in base al segno
clrCls(n)         // → "pos" o "neg" (classi CSS)
```

**Dipendenze**: `n.toLocaleString("it-IT")` — locale hardcoded.
**Consumatori**: praticamente tutto il render JSX.

---

## 4. STATE DELL'APPLICAZIONE

### 4.1 Mappa Completa degli State

```
NAVIGAZIONE
  tab           : string   "dashboard"|"mercati"|"trading"|"portafoglio"|"ordini"|"storico"|"analisi"|"alert"|"wiki"
  subTab        : string   "Azioni"|"ETF/ETC"|"Obbligazioni"|"Derivati"|"Fondo"
  screen        : string   "start"|"newGame"|"loadGame"|"playing"
  theme         : string   "dark"|"light"

SIMULAZIONE
  prices        : Record<instrId, PriceState>  {current,prev,open,high,low,pctChange}
  priceHistory  : Record<instrId, {t,v}[]>     array time-series (max 200 punti per strumento)
  indexHistory  : {id,history}[]               NON USATO (dead state — da rimuovere)
  simTime       : Date
  speed         : number   1|2|4|8|16|24|48|96|192|384|768|1536|3600
  running       : boolean
  marketStatus  : string   "APERTO"|"PRE-APERTURA"|"CHIUSO"
  marketSentiment: number  [-3, +3]
  tick          : number   incrementato ogni secondo reale (usato per flash prezzi)

PORTAFOGLIO
  cash          : number   €
  portfolio     : Record<instrId, {qty, avgPrice, totalCost}>
  trades        : Trade[]  [{id,instrId,side,qty,price,commission,total,time,type}]
  orders        : Order[]  [{id,instrId,side,qty,type,limitPrice?,stopPrice?,time}]
  priceAlerts   : PriceAlert[] [{id,instrId,targetPrice,dir}]

FORM ORDINE (Trading tab)
  selectedInstr : Instrument | null
  orderType     : "market"|"limit"|"stop"
  orderSide     : "buy"|"sell"
  orderQty      : number
  limitPrice    : string
  stopPrice     : string
  orderMsg      : string

NOTIFICHE
  alerts        : Alert[]  [{id,msg,type,time}]  max 30, auto-rimosse dopo 8s
  alertInstr    : string   (form alert tab)
  alertPrice    : string   (form alert tab)
  alertDir      : "above"|"below"

UI STATE
  showOpDesc    : boolean   modal descrizione operazione
  showReset     : boolean   dialog conferma reset
  wikiOpenId    : string|null  id articolo wiki aperto
  wikiSearch    : string    query ricerca wiki

SALVATAGGIO / SESSION
  playerName    : string
  nameInput     : string   (form nuova partita)
  saveId        : string|null
  savedGames    : SaveMeta[]
  saveMsg       : string   feedback pulsante salva
  loadingGames  : boolean
```

### 4.2 Refs (mutabili, non causano re-render)

```
intervalRef     : useRef(null)     handle del setInterval della sim
tRef            : useRef(0)        tick counter sim (secondi sim accumulati)
lastSaveRef     : useRef(Date.now()) timestamp ultimo autosave reale
saveIdRef       : useRef(null)     copia ref di saveId (evita closure stale in saveGame)
tickerRef       : useRef([])       NON USATO (dead ref — da rimuovere)
prevPricesRef   : useRef({})       snapshot prezzi precedente (usato per flash cells)
memoryStorageRef: useRef({})       fallback storage in-memory
storageAvailableRef: useRef(null)  stato disponibilità window.storage (null/true/false)
```

---

## 5. MOTORE DI SIMULAZIONE (useEffect principale)

### 5.1 Dipendenze del loop

```javascript
useEffect(() => { ... }, [running, speed, marketStatus, marketSentiment, prices, addAlert, screen, playerName, cash, portfolio, trades, orders, priceAlerts, simTime, saveGame]);
```

**⚠️ PROBLEMA CRITICO**: L'array di dipendenze include `prices`, `portfolio`, `trades`, `orders`, `priceAlerts`, `simTime` — tutti state che cambiano ad ogni tick. Questo causa la ricostruzione del setInterval ad ogni tick, con potenziali memory leak e comportamento imprevedibile.

**Cosa fa il loop ogni tick (1 secondo reale)**:
1. Avanza `simTime` di `speed` secondi
2. Calcola `marketStatus` via `checkMarketHours()`
3. Fa driftare `marketSentiment` con rumore gaussiano
4. Con probabilità `0.003 * speed/60`: genera evento di mercato random (da array `EVENTS`)
5. Se `marketStatus === "APERTO"`:
   a. Aggiorna prezzi di tutti `ALL_INSTRUMENTS` via `generatePriceChange()`
   b. Aggiorna prezzi di tutti `INDICES`
   c. Ogni 30 tick sim: campiona `priceHistory`
   d. Controlla ordini limite/stop → esegue `executeTrade()` se triggerati
   e. Controlla `priceAlerts` → notifica se raggiunte
   f. Con probabilità `0.0008 * speed/3600`: eroga dividendi
   g. Ogni 15 minuti reali: autosalvataggio

### 5.2 Problemi noti del motore

```
1. CLOSURE STALE: prices, portfolio, etc. nel loop sono stale (catturati alla creazione del setInterval)
   → Gli ordini e gli alert leggono prezzi "vecchi" di un tick
   → Soluzione: usare setPrices(prev => ...) con functional update + refs per i dati necessari

2. INTERVAL RICREATO AD OGNI TICK: le dipendenze includono state che cambiano ad ogni tick
   → Il setInterval viene distrutto e ricreato continuamente
   → Soluzione: useRef per i dati che il loop deve leggere, deps array ridotto a [running, speed]

3. MISCELAZIONE DI RESPONSABILITÀ: il loop fa tutto (prezzi + ordini + alerts + dividendi + autosave)
   → Difficile testare singole parti
   → Soluzione: separare in hook dedicati useSimulationEngine, usePendingOrders, usePriceAlerts

4. priceHistory campionato con t % 30 === 0: funziona solo se tRef non viene resettato a metà
   → Al cambio velocità può saltare campionamenti

5. INDICES trattati diversamente da ALL_INSTRUMENTS: codice duplicato nel loop
```

---

## 6. ESECUZIONE TRADE (executeTrade)

```javascript
executeTrade(instrId, side, qty, price, type, alertFn, setCashFn, setPortFn, setTradesFn)
```

**Pattern**: funzione NON-hook passata come argomento — strano pattern React.
**Dipendenze in input**: tutte le setter function (setCash, setPortfolio, setTrades) + addAlert passati come parametri.
**Problema**: `side === "sell"` chiama `setCashFn` dentro `setPortFn` → setState annidato, viola best practice React.

**Flusso BUY**:
```
setCashFn(c => {
  if (c < total) → alert errore, return c
  setPortFn(p => aggiorna avg price)
  setTradesFn(t => aggiungi trade)
  return c - total
})
```

**Flusso SELL**:
```
setPortFn(p => {
  if qty > p[instrId].qty → alert errore, return p
  setCashFn(c => c + revenue)  ← setState dentro setState!
  setTradesFn(t => aggiungi trade)
  return p aggiornato
})
```

**Commissioni**: `max(€1.50, prezzo × qty × 0.001)` — 0.1% con minimo fisso.

---

## 7. GESTIONE STORAGE

### 7.1 Layer di astrazione

```
storageGet(key) → Promise<{value: string} | null>
  ├── if storageAvailableRef === false → legge da memoryStorageRef
  ├── else → window.storage.get(key, false)
  └── catch → legge da memoryStorageRef (fallback)

storageSet(key, value) → Promise<true>
  ├── if storageAvailableRef === false → scrive in memoryStorageRef
  ├── else → window.storage.set(key, value, false)
  │   ├── if !result → throw (imposta storageAvailableRef = false, usa fallback)
  │   └── else → storageAvailableRef = true
  └── catch → fallback in-memory (sempre ritorna true)
```

### 7.2 Struttura dati salvata

**Chiave unica**: `"borsa_all_saves"` — contiene JSON array di max 10 oggetti:

```typescript
interface SaveEntry {
  id:             string;       // "g" + Date.now()
  savedAt:        string;       // ISO date
  playerName:     string;
  cash:           number;
  portfolioValue: number;       // solo per visualizzazione nella lista
  simTime:        string;       // ISO date
  speed:          number;
  portfolio:      Record<instrId, {qty, avgPrice, totalCost}>;
  orders:         Order[];      // max 20
  priceAlerts:    PriceAlert[]; // max 20
  trades:         Trade[];      // max 50
}
```

**NON salvati** (si perdono al ricaricamento):
- `prices` (si riazzerano ai valori iniziali)
- `priceHistory` (si ricostruisce da zero)
- `alerts` (notifiche toast)
- `marketSentiment`

**⚠️ Problema `saveId` / `saveIdRef`**: doppia gestione — `saveId` (state) e `saveIdRef` (ref). La ref esiste per evitare closure stale in `saveGame` (useCallback con `[]` deps). Ma `updateSaveId()` è una funzione normale non-memoizzata che chiama sia `setSaveId` che aggiorna il ref → potrebbe essere sostituita da un solo ref.

---

## 8. SUB-COMPONENTS (Definiti inline nel componente principale)

### 8.1 Sparkline

```
Input: { id: string, w?: number, h?: number }
Legge: priceHistory[id] (state del parent)
Output: <svg> con polyline
Closure su: priceHistory
Problema: ricreata ad ogni render del parent
```

### 8.2 PriceChart

```
Input: { id: string, w?: number, h?: number }
Legge: priceHistory[id]
Output: <svg> con area chart + griglia prezzi
Closure su: priceHistory
Problema: stessa di Sparkline
```

### 8.3 InstrumentRow

```
Input: { instr: Instrument }
Legge: prices[instr.id], selectedInstr, priceHistory
Scrive: setSelectedInstr, setOrderSide, setTab
Output: <tr> con flash animation
Problema: ricreata ad ogni render, non memoizzata
```

### 8.4 WikiArticle (Modal)

```
Input: { articleId: string, onClose: () => void }
Legge: WIKI_ARTICLES (costante), wikiOpenId, setWikiOpenId
Output: overlay modale con articolo formattato
Autonoma: no dipendenze da state finanziario
```

### 8.5 OpDescModal (Modal)

```
Input: nessuno (legge da closure)
Legge: orderType, orderSide, showOpDesc, OP_DESCRIPTIONS
Output: overlay modale con descrizione operazione
Costruisce: opKey = "market-buy" | "market-sell" | "limit-buy" | "limit-sell" | "stop-sell"
```

---

## 9. RENDER CONDIZIONALE — SCHERMATE

```
screen === "start"    → render standalone (con <style> embeddato ridotto)
screen === "newGame"  → render standalone
screen === "loadGame" → render standalone
screen === "playing"  → render principale (~1500 righe JSX)
```

**Dipendenze schermate iniziali**:
- `start`: theme, setTheme, setScreen, loadSavedGames
- `newGame`: nameInput, setNameInput, updateSaveId, setPlayerName, setRunning, setScreen
- `loadGame`: savedGames, loadingGames, loadGame, deleteGame, setScreen, fmt, fmtDate, fmtSaveDate

**Problema**: ogni schermata iniziale ha il proprio `<style>` con variabili CSS duplicate → manutenzione difficile.

---

## 10. TAB DEL GIOCO — Dipendenze per Tab

| Tab | State letti | State scritti | Components figli |
|---|---|---|---|
| dashboard | prices, priceHistory, portfolio, positions | setSelectedInstr, setTab, setOrderSide | Sparkline, PriceChart (indici) |
| mercati | prices, priceHistory, subTab, ALL_INSTRUMENTS | setSubTab, setSelectedInstr, setTab, setOrderSide | InstrumentRow |
| trading | prices, priceHistory, selectedInstr, orderType/Side/Qty, limitPrice, stopPrice, orderMsg, portfolio, currentOpDesc, showOpDesc | tutti i setter form ordine, setShowOpDesc | PriceChart, OpDescModal |
| portafoglio | positions (derivato), cash, portfolio, prices | setPortfolio, setCash, setTrades (via executeTrade) | Sparkline |
| ordini | orders, prices | setOrders | — |
| storico | trades | — | — |
| analisi | positions, prices, STOCKS, trades | — | — |
| alert | priceAlerts, alerts, alertInstr/Price/Dir | setPriceAlerts, setAlertInstr, setAlertPrice, setAlertDir | — |
| wiki | wikiSearch, WIKI_ARTICLES | setWikiSearch, setWikiOpenId | WikiArticle |

### 10.1 Valori derivati (calcolati inline nel render)

```javascript
// Derivati da portfolio + prices — calcolati ad ogni render
const portfolioValue = Object.entries(portfolio).reduce(...)
const totalValue = cash + portfolioValue
const totalPnl = totalValue - 1000
const totalPnlPct = (totalValue / 1000 - 1) * 100
const positions = Object.entries(portfolio).map(...)   // arricchiti con currentPrice, pnl, etc.

// Derivato per tab mercati
const filteredInstruments = ALL_INSTRUMENTS.filter(i => i.category === subTab)

// Derivato per tab analisi
// (settori, win rate, commissioni — inline nel JSX)
```

**Problema**: tutti calcolati ad ogni render senza `useMemo` → inefficiente con 175 strumenti.

---

## 11. CSS ARCHITECTURE

### 11.1 Struttura

Il CSS è interamente in un unico `<style>` tag all'interno del componente (CSS-in-JS manuale, non styled-components o CSS modules).

```
<style>{`
  @import Google Fonts
  
  /* CSS Variables per temi */
  .theme-dark { --bg, --bg2, ... }
  .theme-light { --bg, --bg2, ... }
  
  /* Base */
  body, .app
  
  /* Layout */
  .header, .logo, .index-ticker, .idx-chip, .idx-name, .idx-val, .idx-chg
  .header-right, .market-badge, .sim-time, .speed-ctrl, .speed-btn, .speed-label, .play-btn
  .portfolio-strip, .pf-metric, .pf-label, .pf-value
  
  /* Navigation */
  .tabs, .tab, .subtabs, .sub-chip
  
  /* Content */
  .main, .card, .card-header, .card-title
  
  /* Tables */
  table, thead th, tbody td, .instr-row
  @keyframes flashUp/flashDown, .flash-up, .flash-down
  
  /* Buttons */
  .btn-buy-sm, .btn-sell-sm, .btn-primary, .btn-buy, .btn-sell, .btn-outline
  
  /* Form */
  input, select, .form-group, .form-label
  
  /* Grid system */
  .grid2, .grid3, .grid4, .grid-main
  
  /* Utility */
  .table-scroll, .pbar-wrap, .pbar, .sentiment-bar, .sentiment-dot
  .ob-row, .event-banner, .ticker-tape, .ticker-inner, .ticker-item
  .pos, .neg
  
  /* Alerts */
  .alerts-container, .alert-toast, .alert-info/success/warning/error
  @keyframes slideIn
  
  /* Wiki */
  .wiki-card, .wiki-grid, .wiki-icon
  
  /* Light theme overrides */
  .theme-light .card, .theme-light input, ... (20+ selettori override)
  
  /* Responsive */
  @media (max-width: 768px) { ... }
  @media (max-width: 480px) { ... }
`}</style>
```

### 11.2 Problemi CSS

```
1. VARIABILI GRIGIE CUSTOM: --g9, --g8, --g7, --g6, --g5, --ga, --gb, --gc ecc.
   Esistono perché i grigi hardcoded (#888 etc.) sono stati sostituiti via sed
   → Molto confusi, non semantici

2. STILI INLINE HARDCODED RESIDUI: molti componenti usano style={{}} inline
   con valori non tematizzati (es. fontSize: 11, color: "var(--gold)" ma anche
   color: "#ffc107" che non usa variabile CSS)

3. DUPLICAZIONE: le schermate iniziali (start/newGame/loadGame) hanno
   <style> separati con variabili CSS riduplicate

4. THEME LIGHT TRAMITE OVERRIDE: il tema chiaro sovrascrive con 30+ regole .theme-light
   invece di usare le variabili CSS già definite → fragile

5. CSS NON SCOPED: tutti i selettori sono globali, potenziali conflitti
```

---

## 12. GRAFO DELLE DIPENDENZE FUNZIONALI

```
window.storage
    └──> storageGet / storageSet
              ├──> saveGame ──────────> [playerName, cash, portfolio, trades, orders, priceAlerts, simTime, speed, prices]
              ├──> loadSavedGames ────> setSavedGames
              ├──> loadGame ─────────> [setCash, setPortfolio, setTrades, setOrders, setPriceAlerts, setSimTime, setSpeed, setScreen, setRunning, updateSaveId]
              └──> deleteGame ───────> setSavedGames

gaussRand()
    └──> generatePriceChange(instr, sentiment, dt)
              └──> sim loop (useEffect)
                        ├──> setPrices (tutti gli strumenti)
                        ├──> setPriceHistory (ogni 30 tick sim)
                        ├──> setOrders ──> executeTrade (ordini triggerati)
                        ├──> setPriceAlerts ──> addAlert (alert triggerati)
                        ├──> setCash (dividendi)
                        ├──> setSimTime + setMarketStatus
                        ├──> setMarketSentiment
                        └──> saveGame (ogni 15 min reali)

executeTrade(instrId, side, qty, price, ...)
    ├──> setCash
    ├──> setPortfolio
    ├──> setTrades
    └──> addAlert (errori e conferme)

handleOrder()
    ├──> executeTrade (market order)
    ├──> setOrders (limit/stop order)
    └──> setOrderMsg

addAlert(msg, type)
    └──> setAlerts + setTimeout(cleanup)

checkMarketHours(dt) → string
    └──> setMarketStatus (via sim loop)
```

---

## 13. PROBLEMI CRITICI DA RISOLVERE NEL REFACTORING

### P1 — PERFORMANCE (Alta priorità)

```
- useEffect loop con 14+ dipendenze inclusi state che cambiano ogni tick
  → Soluzione: useRef per prices/orders/alerts nel loop, ridurre deps a [running, speed]

- positions, portfolioValue, totalValue calcolati inline ad ogni render
  → Soluzione: useMemo con deps [portfolio, prices]

- Sparkline e InstrumentRow ricreate ad ogni render (~175 istanze)
  → Soluzione: React.memo + useCallback per le closure

- priceHistory: 175+ array di 200 punti ciascuno in state React
  → Soluzione: usare useRef per priceHistory (non serve re-render), solo estrarre
    subset quando necessario per il grafico
```

### P2 — ARCHITETTURA (Alta priorità)

```
- Tutto in un unico componente da ~2960 righe
  → Soluzione: separare in almeno 15-20 moduli (vedi sezione 14)

- Sub-components definiti dentro il render del parent
  → Soluzione: estrarre come componenti separati con props esplicite

- executeTrade non è un hook ma usa setter passati come parametri
  → Soluzione: custom hook usePortfolio() con metodi esposti

- State di UI (form, modali) mescolato con state di dominio (prezzi, portfolio)
  → Soluzione: separare store di dominio da store UI
```

### P3 — CORRETTEZZA (Media priorità)

```
- Closure stale nel loop: prices, orders, priceAlerts letti da chiusura stale
  → Il motore può triggerare ordini su prezzi "vecchi" di 1 tick

- setState annidato in executeTrade (setCashFn dentro setPortFn)
  → Comportamento non determinato in React strict mode

- saveId duplicato (state + ref) con updateSaveId() non-memoizzata
  → Semplificare a solo ref

- FONDI ha category hardcoded, altri strumenti no → inconsistenza schema

- INDICES non in ALL_INSTRUMENTS ma gestiti separatamente nel loop
  → Unificare la gestione
```

### P4 — MANUTENIBILITÀ (Media priorità)

```
- CSS variabili grigie semanticamente vuote (--g8, --ga, --gb...)
  → Rinominare: --color-muted-1, --color-muted-2, etc.

- Tre blocchi <style> separati (schermate iniziali + main)
  → Un solo CSS module o CSS-in-JS consistente

- OP_DESCRIPTIONS e WIKI_ARTICLES hardcoded nel file JS
  → Spostare in file JSON separati: /data/operations.json, /data/wiki.json

- EVENTI di mercato hardcoded inline
  → /data/marketEvents.json

- Nessuna tipizzazione
  → Aggiungere TypeScript o almeno JSDoc types
```

---

## 14. ARCHITETTURA TARGET (Struttura per il Refactoring)

```
src/
├── main.jsx                          # Entry point
│
├── data/                             # Dati statici puri (nessuna logica)
│   ├── stocks.js                     # STOCKS array
│   ├── etfs.js                       # ETFS array
│   ├── bonds.js                      # BONDS array
│   ├── derivatives.js                # DERIVATIVES array
│   ├── funds.js                      # FONDI array
│   ├── indices.js                    # INDICES array
│   ├── instruments.js                # ALL_INSTRUMENTS (aggregato)
│   ├── marketEvents.js               # EVENTS array
│   ├── operations.js                 # OP_DESCRIPTIONS
│   └── wiki.js                       # WIKI_ARTICLES
│
├── types/                            # TypeScript interfaces / JSDoc
│   └── index.d.ts
│
├── utils/                            # Funzioni pure, zero dipendenze React
│   ├── math.js                       # gaussRand, generatePriceChange
│   ├── formatters.js                 # fmt, fmtEur, fmtPct, clr, clrCls
│   └── marketHours.js                # checkMarketHours
│
├── hooks/                            # Custom hooks — logica stateful
│   ├── useSimulationEngine.js        # Motore prezzi + tick + orari
│   │   → expone: prices, simTime, marketStatus, marketSentiment, running, setRunning
│   ├── usePortfolio.js               # Portfolio + trade execution
│   │   → expone: cash, portfolio, positions, trades, buy(), sell()
│   ├── usePendingOrders.js           # Ordini limite e stop
│   │   → expone: orders, addOrder(), removeOrder(), checkOrders(prices)
│   ├── usePriceAlerts.js             # Alert sui prezzi
│   │   → expone: priceAlerts, addAlert(), removeAlert(), checkAlerts(prices)
│   ├── useNotifications.js           # Toast notifications
│   │   → expone: alerts, notify(), clearAll()
│   ├── usePriceHistory.js            # Campionamento time-series
│   │   → expone: priceHistory (ref), getHistory(id)
│   ├── useSaveSystem.js              # Storage, save/load/delete
│   │   → expone: saveGame(), loadGame(), deleteGame(), savedGames, loadSavedGames()
│   └── useTheme.js                   # Tema dark/light con persistenza
│       → expone: theme, toggleTheme
│
├── store/                            # (opzionale) Context o Zustand per stato globale
│   ├── SimulationContext.jsx         # Provider per dati sim condivisi
│   └── PortfolioContext.jsx
│
├── components/
│   ├── layout/
│   │   ├── Header.jsx                # Header con indici, controlli velocità, save
│   │   ├── PortfolioStrip.jsx        # Barra riassuntiva portafoglio
│   │   └── TabBar.jsx                # Navigazione tab
│   │
│   ├── charts/
│   │   ├── Sparkline.jsx             # Mini grafico (memoizzato)
│   │   └── PriceChart.jsx            # Grafico area con griglia
│   │
│   ├── instruments/
│   │   ├── InstrumentRow.jsx         # Riga tabella mercati (memoizzata)
│   │   ├── InstrumentTable.jsx       # Tabella con subtab e filtri
│   │   └── OrderBook.jsx             # Book ordini simulato
│   │
│   ├── trading/
│   │   ├── OrderPanel.jsx            # Form inserimento ordine
│   │   ├── OperationBanner.jsx       # Banner descrizione operazione
│   │   └── PositionCard.jsx          # Card posizione corrente
│   │
│   ├── portfolio/
│   │   ├── PositionsTable.jsx        # Tabella posizioni aperte
│   │   └── PortfolioStats.jsx        # KPI portafoglio
│   │
│   ├── modals/
│   │   ├── OpDescModal.jsx           # Modal descrizione operazione
│   │   ├── ResetConfirmModal.jsx     # Dialog conferma reset
│   │   └── WikiArticle.jsx           # Modal articolo wiki
│   │
│   ├── screens/                      # Schermate iniziali (fuori dal gioco)
│   │   ├── StartScreen.jsx
│   │   ├── NewGameScreen.jsx
│   │   └── LoadGameScreen.jsx
│   │
│   └── tabs/                         # Contenuto di ogni tab
│       ├── DashboardTab.jsx
│       ├── MarketsTab.jsx
│       ├── TradingTab.jsx
│       ├── PortfolioTab.jsx
│       ├── OrdersTab.jsx
│       ├── HistoryTab.jsx
│       ├── AnalyticsTab.jsx
│       ├── AlertsTab.jsx
│       └── WikiTab.jsx
│
├── styles/
│   ├── variables.css                 # CSS custom properties (temi)
│   ├── base.css                      # Reset, body, .app
│   ├── layout.css                    # Header, strip, tabs, main
│   ├── components.css                # Card, table, button, input, form
│   ├── animations.css                # Keyframes (flash, slideIn, ticker)
│   └── themes/
│       ├── dark.css
│       └── light.css
│
└── App.jsx                           # Root: routing tra schermate + providers
```

---

## 15. PIANO DI MIGRAZIONE (Ordine suggerito)

### Fase 1 — Estrazione dati e utils (nessun impatto sul funzionamento)
1. Spostare STOCKS, ETFS, BONDS, DERIVATIVES, FONDI, INDICES in `/data/`
2. Spostare OP_DESCRIPTIONS, WIKI_ARTICLES in `/data/`
3. Estrarre `gaussRand`, `generatePriceChange` in `/utils/math.js`
4. Estrarre `fmt`, `fmtEur`, `fmtPct`, `clr`, `clrCls` in `/utils/formatters.js`
5. Estrarre `checkMarketHours` in `/utils/marketHours.js`

### Fase 2 — CSS separato
1. Estrarre tutto il CSS in file separati
2. Rinominare variabili grigie semanticamente vuote
3. Unificare i tre blocchi `<style>` delle schermate iniziali

### Fase 3 — Custom hooks
1. `usePriceHistory` (primo: solo legge, non scrive altri state)
2. `useNotifications` (semplice, autonomo)
3. `useTheme` (semplice)
4. `usePortfolio` (estrae executeTrade, cash, portfolio, trades)
5. `usePendingOrders` (ordini limite/stop)
6. `usePriceAlerts`
7. `useSaveSystem`
8. `useSimulationEngine` (ultimo: dipende da quasi tutto)

### Fase 4 — Componenti
1. Estrarre `Sparkline` e `PriceChart` con React.memo
2. Estrarre modali (WikiArticle, OpDescModal, ResetConfirmModal)
3. Estrarre `InstrumentRow` con React.memo
4. Estrarre schermate iniziali
5. Estrarre tab per tab (iniziare dal più semplice: Storico, Ordini)

### Fase 5 — Correggere bug architetturali
1. Fix closure stale nel sim loop (passare a refs)
2. Fix setState annidato in executeTrade
3. Aggiungere useMemo per positions, portfolioValue, totalValue
4. Ridurre deps array del sim loop a [running, speed]

---

## 16. DIPENDENZE ESTERNE

```
React         ^18 (useState, useEffect, useRef, useCallback)
Nessuna altra libreria — tutto vanilla React + SVG inline

window.storage    API Claude artifacts — persistenza cross-session
                  Fallback: memoryStorageRef (in-memory, perde dati al refresh)

Google Fonts      @import via <style> — Space Mono, Barlow Condensed, Barlow
                  Dipendenza di rete — fallback: monospace/sans-serif
```

---

## 17. METRICHE ATTUALI

| Metrica | Valore |
|---|---|
| Righe totali file | ~2.960 |
| Righe componente principale | ~2.500 |
| Numero useState | ~50 |
| Numero useRef | 8 |
| Numero useEffect | 1 (il sim loop) |
| Numero useCallback | 2 (addAlert, saveGame) |
| Sub-components inline | 5 (Sparkline, PriceChart, InstrumentRow, WikiArticle, OpDescModal) |
| Strumenti finanziari | 175 |
| Articoli wiki | 11 |
| Tab di navigazione | 9 |
| Righe CSS | ~600 |
| Costanti statiche | ~400 righe |
| Funzioni pure | 7 |

---

*Documento generato il 27/05/2026 — da aggiornare ad ogni sessione di refactoring*
