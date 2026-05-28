import { useMemo } from "react";
import { INDICES } from "../../data/indices.js";
import { STOCKS } from "../../data/stocks.js";
import { fmt, fmtEur, fmtPct, clr } from "../../utils/formatters.js";
import Sparkline from "../charts/Sparkline.jsx";
import { useSortableTable } from "../../hooks/useSortableTable.js";
import { TableSearch, SortableTh } from "../ui/TableControls.jsx";

const CATEGORY_COLOR = {
  "Geopolitico": "#ff6d00", "Politico": "#ff9800", "Economico": "#29b6f6",
  "Energia": "#ffc107", "Tecnologia": "#7c4dff", "Disastro Naturale": "#ff1744",
  "Sanitario": "#00e676", "Corporate": "#e8c96c", "Sociale": "#888",
  "Mercato": "#26c6da", "Immobiliare": "#ef9a9a",
};

function fmtRemaining(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  if (d > 0) return `${d}g ${h}h`;
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function DashboardTab({ prices, priceHistory, cash, portfolioValue, totalValue, totalPnl, totalPnlPct, positions, activeEvents = [], onSelectInstr, onSetTab }) {
  const enrichedStocks = useMemo(() =>
    STOCKS
      .filter(s => prices[s.id])
      .map(s => ({ ...s, _current: prices[s.id].current, _pctChange: prices[s.id].pctChange })),
    [prices]
  );

  const {
    rows: gainerRows, sortKey: gSortKey, sortDir: gSortDir, handleSort: gHandleSort,
    query: gQuery, setQuery: gSetQuery,
  } = useSortableTable(enrichedStocks, {
    defaultKey: "_pctChange",
    defaultDir: "desc",
    searchFn: (s, q) => s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
  });

  const {
    rows: loserRows, sortKey: lSortKey, sortDir: lSortDir, handleSort: lHandleSort,
    query: lQuery, setQuery: lSetQuery,
  } = useSortableTable(enrichedStocks, {
    defaultKey: "_pctChange",
    defaultDir: "asc",
    searchFn: (s, q) => s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
  });

  const {
    rows: posRows, sortKey: pSortKey, sortDir: pSortDir, handleSort: pHandleSort,
    query: pQuery, setQuery: pSetQuery,
  } = useSortableTable(positions, {
    searchFn: (pos, q) =>
      pos.id.toLowerCase().includes(q) ||
      (pos.name || "").toLowerCase().includes(q),
  });

  const displayedGainers = gQuery ? gainerRows : gainerRows.slice(0, 8);
  const displayedLosers = lQuery ? loserRows : loserRows.slice(0, 8);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {activeEvents.length > 0 && (
        <div className="card" style={{ borderLeft: "3px solid #ff6d00" }}>
          <div className="card-header" style={{ cursor: "pointer" }} onClick={() => onSetTab("notizie")}>
            <span className="card-title">📡 Eventi di Mercato Attivi</span>
            <span style={{ fontSize: 10, fontFamily: "Space Mono", color: "#ff6d00" }}>Vai a Notizie →</span>
          </div>
          <div style={{ padding: "8px 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            {activeEvents.map(ev => {
              const color = CATEGORY_COLOR[ev.category] || "#888";
              const pct = (ev.remainingSeconds / ev.totalDuration) * 100;
              return (
                <div key={ev.instanceId} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{ev.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                      <span style={{ fontFamily: "Space Mono", fontSize: 11, fontWeight: 700, color: "var(--gc)" }}>{ev.title}</span>
                      <span style={{ fontSize: 10, fontFamily: "Space Mono", color: "#ffc107", flexShrink: 0 }}>⏱ {fmtRemaining(ev.remainingSeconds)}</span>
                    </div>
                    <div style={{ height: 3, background: "var(--bg3)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid3">
        {INDICES.map(idx => {
          const p = prices[idx.id];
          if (!p) return null;
          return (
            <div className="card" key={idx.id}>
              <div className="card-header">
                <span className="card-title">{idx.name}</span>
                <span style={{ color: clr(p.pctChange), fontFamily: "monospace", fontSize: 11 }}>{fmtPct(p.pctChange)}</span>
              </div>
              <div style={{ padding: "10px 14px" }}>
                <div style={{ fontFamily: "Space Mono", fontSize: 22, fontWeight: 700, color: clr(p.pctChange) }}>{fmt(p.current, 1)}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--text3)" }}>A: {fmt(p.open, 1)}</span>
                  <span style={{ fontSize: 11, color: "#00e676" }}>H: {fmt(p.high, 1)}</span>
                  <span style={{ fontSize: 11, color: "#ff1744" }}>L: {fmt(p.low, 1)}</span>
                </div>
                <div style={{ marginTop: 8 }}><Sparkline data={priceHistory[idx.id] || []} w={220} h={40} /></div>
              </div>
            </div>
          );
        })}

        <div className="card">
          <div className="card-header"><span className="card-title">Il Mio Portafoglio</span></div>
          <div style={{ padding: "10px 14px" }}>
            <div style={{ fontFamily: "Space Mono", fontSize: 22, fontWeight: 700, color: "#e8c96c" }}>{fmtEur(totalValue)}</div>
            <div style={{ marginTop: 4, fontFamily: "Space Mono", fontSize: 14, color: clr(totalPnl) }}>
              {totalPnl >= 0 ? "+" : ""}{fmtEur(totalPnl)} ({fmtPct(totalPnlPct)})
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 2 }}>CASH</div>
                <div className="pbar-wrap">
                  <div className="pbar" style={{ width: `${(cash / totalValue) * 100}%`, background: "#29b6f6" }} />
                </div>
                <div style={{ fontSize: 10, color: "#29b6f6", marginTop: 2 }}>{fmt((cash / totalValue) * 100)}%</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 2 }}>INVESTITO</div>
                <div className="pbar-wrap">
                  <div className="pbar" style={{ width: `${(portfolioValue / totalValue) * 100}%`, background: "#e8c96c" }} />
                </div>
                <div style={{ fontSize: 10, color: "#e8c96c", marginTop: 2 }}>{fmt((portfolioValue / totalValue) * 100)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-header"><span className="card-title">🚀 Top Rialzisti</span></div>
          <TableSearch query={gQuery} onChange={gSetQuery} placeholder="Cerca titolo..." />
          <div className="table-scroll" style={{ maxHeight: 260 }}>
            <table>
              <thead>
                <tr>
                  <SortableTh label="Titolo"  sk="id"         sortKey={gSortKey} sortDir={gSortDir} onSort={gHandleSort} />
                  <SortableTh label="Prezzo"  sk="_current"   sortKey={gSortKey} sortDir={gSortDir} onSort={gHandleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="Var%"    sk="_pctChange" sortKey={gSortKey} sortDir={gSortDir} onSort={gHandleSort} style={{ textAlign: "right" }} />
                  <th>Grafico</th>
                </tr>
              </thead>
              <tbody>
                {displayedGainers.map(s => (
                  <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => { onSelectInstr({ ...s, category: "Azioni" }); onSetTab("trading"); }}>
                    <td style={{ color: "#e8c96c", fontFamily: "monospace", fontWeight: 700 }}>{s.id}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12, textAlign: "right" }}>€{fmt(s._current)}</td>
                    <td style={{ color: clr(s._pctChange), fontFamily: "monospace", fontSize: 12, textAlign: "right" }}>{fmtPct(s._pctChange)}</td>
                    <td><Sparkline data={priceHistory[s.id] || []} w={70} h={22} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">📉 Top Ribassisti</span></div>
          <TableSearch query={lQuery} onChange={lSetQuery} placeholder="Cerca titolo..." />
          <div className="table-scroll" style={{ maxHeight: 260 }}>
            <table>
              <thead>
                <tr>
                  <SortableTh label="Titolo"  sk="id"         sortKey={lSortKey} sortDir={lSortDir} onSort={lHandleSort} />
                  <SortableTh label="Prezzo"  sk="_current"   sortKey={lSortKey} sortDir={lSortDir} onSort={lHandleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="Var%"    sk="_pctChange" sortKey={lSortKey} sortDir={lSortDir} onSort={lHandleSort} style={{ textAlign: "right" }} />
                  <th>Grafico</th>
                </tr>
              </thead>
              <tbody>
                {displayedLosers.map(s => (
                  <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => { onSelectInstr({ ...s, category: "Azioni" }); onSetTab("trading"); }}>
                    <td style={{ color: "#e8c96c", fontFamily: "monospace", fontWeight: 700 }}>{s.id}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12, textAlign: "right" }}>€{fmt(s._current)}</td>
                    <td style={{ color: clr(s._pctChange), fontFamily: "monospace", fontSize: 12, textAlign: "right" }}>{fmtPct(s._pctChange)}</td>
                    <td><Sparkline data={priceHistory[s.id] || []} w={70} h={22} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {positions.length > 0 && (
        <div className="card">
          <div className="card-header"><span className="card-title">💼 Posizioni Aperte</span></div>
          <TableSearch query={pQuery} onChange={pSetQuery} placeholder="Cerca titolo..." />
          <div className="table-scroll" style={{ maxHeight: 240 }}>
            <table>
              <thead>
                <tr>
                  <SortableTh label="Titolo"        sk="id"           sortKey={pSortKey} sortDir={pSortDir} onSort={pHandleSort} />
                  <SortableTh label="Qtà"           sk="qty"          sortKey={pSortKey} sortDir={pSortDir} onSort={pHandleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="Prezzo Medio"  sk="avgPrice"     sortKey={pSortKey} sortDir={pSortDir} onSort={pHandleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="Prezzo Attuale" sk="currentPrice" sortKey={pSortKey} sortDir={pSortDir} onSort={pHandleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="Valore"        sk="mktVal"       sortKey={pSortKey} sortDir={pSortDir} onSort={pHandleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="P&L"           sk="pnl"          sortKey={pSortKey} sortDir={pSortDir} onSort={pHandleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="P&L%"          sk="pnlPct"       sortKey={pSortKey} sortDir={pSortDir} onSort={pHandleSort} style={{ textAlign: "right" }} />
                </tr>
              </thead>
              <tbody>
                {posRows.map(pos => (
                  <tr key={pos.id}>
                    <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{pos.id}</td>
                    <td style={{ fontFamily: "monospace", textAlign: "right" }}>{pos.qty}</td>
                    <td style={{ fontFamily: "monospace", color: "var(--g8)", textAlign: "right" }}>€{fmt(pos.avgPrice)}</td>
                    <td style={{ fontFamily: "monospace", textAlign: "right" }}>€{fmt(pos.currentPrice)}</td>
                    <td style={{ fontFamily: "monospace", textAlign: "right" }}>€{fmt(pos.mktVal)}</td>
                    <td style={{ fontFamily: "monospace", color: clr(pos.pnl), textAlign: "right" }}>{pos.pnl >= 0 ? "+" : ""}{fmtEur(pos.pnl)}</td>
                    <td style={{ fontFamily: "monospace", color: clr(pos.pnlPct), textAlign: "right" }}>{fmtPct(pos.pnlPct)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
