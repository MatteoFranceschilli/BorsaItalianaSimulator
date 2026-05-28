import { useMemo } from "react";
import { ALL_INSTRUMENTS } from "../../data/instruments.js";
import { fmt, fmtPct, clr } from "../../utils/formatters.js";
import { useSortableTable } from "../../hooks/useSortableTable.js";
import { TableSearch, SortableTh } from "../ui/TableControls.jsx";

export default function AlertsTab({ priceAlerts, alerts, prices, alertInstr, alertPrice, alertDir, onAlertInstrChange, onAlertPriceChange, onAlertDirChange, onAddAlert, onRemoveAlert }) {
  const enrichedAlerts = useMemo(() =>
    priceAlerts.map(a => {
      const cp = prices[a.instrId]?.current;
      const dist = cp ? ((a.targetPrice / cp - 1) * 100) : null;
      return { ...a, _cp: cp || 0, _dist: dist };
    }),
    [priceAlerts, prices]
  );

  const { rows, sortKey, sortDir, handleSort, query, setQuery } = useSortableTable(enrichedAlerts, {
    searchFn: (a, q) =>
      a.instrId.toLowerCase().includes(q) ||
      a.dir.includes(q),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="card">
        <div className="card-header"><span className="card-title">🔔 Imposta Alert Prezzo</span></div>
        <div style={{ padding: 14, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div className="form-group" style={{ minWidth: 200 }}>
            <label className="form-label">Strumento</label>
            <select value={alertInstr} onChange={e => onAlertInstrChange(e.target.value)}>
              <option value="">-- Seleziona --</option>
              {ALL_INSTRUMENTS.map(i => <option key={i.id} value={i.id}>{i.id} — {i.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ minWidth: 120 }}>
            <label className="form-label">Direzione</label>
            <select value={alertDir} onChange={e => onAlertDirChange(e.target.value)}>
              <option value="above">Supera (≥)</option>
              <option value="below">Scende sotto (≤)</option>
            </select>
          </div>
          <div className="form-group" style={{ minWidth: 120 }}>
            <label className="form-label">Prezzo Target (€)</label>
            <input type="number" step="0.01" value={alertPrice} onChange={e => onAlertPriceChange(e.target.value)} placeholder="es. 15.00" />
          </div>
          <button className="btn-primary" style={{ width: "auto", padding: "6px 20px" }} onClick={onAddAlert}>
            + Aggiungi Alert
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">📋 Alert Attivi ({priceAlerts.length})</span></div>
        {priceAlerts.length === 0 ? (
          <div style={{ padding: 30, textAlign: "center", color: "var(--text3)" }}>Nessun alert impostato</div>
        ) : (
          <>
            <TableSearch query={query} onChange={setQuery} placeholder="Cerca per strumento..." />
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <SortableTh label="Strumento"      sk="instrId"      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableTh label="Condizione"     sk="dir"          sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableTh label="Target"         sk="targetPrice"  sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                    <SortableTh label="Prezzo Attuale" sk="_cp"          sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                    <SortableTh label="Distanza"       sk="_dist"        sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(a => (
                    <tr key={a.id}>
                      <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{a.instrId}</td>
                      <td style={{ color: "var(--g8)" }}>{a.dir === "above" ? "Supera ≥" : "Scende ≤"}</td>
                      <td style={{ fontFamily: "monospace", color: "#ffc107", textAlign: "right" }}>€{fmt(a.targetPrice)}</td>
                      <td style={{ fontFamily: "monospace", textAlign: "right" }}>€{fmt(a._cp)}</td>
                      <td style={{ fontFamily: "monospace", color: clr(a._dist || 0), fontSize: 12, textAlign: "right" }}>
                        {a._dist !== null ? fmtPct(a._dist) : "—"}
                      </td>
                      <td>
                        <button className="btn-outline" onClick={() => onRemoveAlert(a.id)}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">📢 Log Notifiche</span></div>
        <div style={{ maxHeight: 300, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          {alerts.length === 0 ? (
            <div style={{ color: "var(--text3)", fontSize: 12, textAlign: "center", padding: 20 }}>Nessuna notifica</div>
          ) : alerts.map(a => (
            <div key={a.id} style={{
              padding: "6px 10px",
              borderLeft: `3px solid ${a.type === "success" ? "#00e676" : a.type === "error" ? "#ff1744" : a.type === "warning" ? "#ffc107" : "#29b6f6"}`,
              background: "var(--bg-inline)",
              borderRadius: "0 3px 3px 0"
            }}>
              <span style={{ fontSize: 10, color: "var(--text3)", marginRight: 8, fontFamily: "Space Mono" }}>{a.time}</span>
              <span style={{ fontSize: 12 }}>{a.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
