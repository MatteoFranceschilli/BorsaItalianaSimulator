import { INDICES } from "../../data/indices.js";
import { STOCKS } from "../../data/stocks.js";
import { fmt, fmtEur, fmtPct, clr, clrCls } from "../../utils/formatters.js";
import Sparkline from "../charts/Sparkline.jsx";

export default function DashboardTab({ prices, priceHistory, cash, portfolioValue, totalValue, totalPnl, totalPnlPct, positions, onSelectInstr, onSetTab }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top indices */}
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

        {/* Portfolio Summary */}
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

      {/* Top movers */}
      <div className="grid2">
        <div className="card">
          <div className="card-header"><span className="card-title">🚀 Top Rialzisti</span></div>
          <div className="table-scroll" style={{ maxHeight: 220 }}>
            <table>
              <thead><tr><th>Titolo</th><th>Prezzo</th><th>Var%</th><th>Grafico</th></tr></thead>
              <tbody>
                {[...STOCKS].sort((a, b) => (prices[b.id]?.pctChange || 0) - (prices[a.id]?.pctChange || 0)).slice(0, 8).map(s => {
                  const p = prices[s.id];
                  return (
                    <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => { onSelectInstr({ ...s, category: "Azioni" }); onSetTab("trading"); }}>
                      <td style={{ color: "#e8c96c", fontFamily: "monospace", fontWeight: 700 }}>{s.id}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>€{fmt(p?.current)}</td>
                      <td style={{ color: clr(p?.pctChange || 0), fontFamily: "monospace", fontSize: 12 }}>{fmtPct(p?.pctChange || 0)}</td>
                      <td><Sparkline data={priceHistory[s.id] || []} w={70} h={22} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">📉 Top Ribassisti</span></div>
          <div className="table-scroll" style={{ maxHeight: 220 }}>
            <table>
              <thead><tr><th>Titolo</th><th>Prezzo</th><th>Var%</th><th>Grafico</th></tr></thead>
              <tbody>
                {[...STOCKS].sort((a, b) => (prices[a.id]?.pctChange || 0) - (prices[b.id]?.pctChange || 0)).slice(0, 8).map(s => {
                  const p = prices[s.id];
                  return (
                    <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => { onSelectInstr({ ...s, category: "Azioni" }); onSetTab("trading"); }}>
                      <td style={{ color: "#e8c96c", fontFamily: "monospace", fontWeight: 700 }}>{s.id}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>€{fmt(p?.current)}</td>
                      <td style={{ color: clr(p?.pctChange || 0), fontFamily: "monospace", fontSize: 12 }}>{fmtPct(p?.pctChange || 0)}</td>
                      <td><Sparkline data={priceHistory[s.id] || []} w={70} h={22} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Open positions preview */}
      {positions.length > 0 && (
        <div className="card">
          <div className="card-header"><span className="card-title">💼 Posizioni Aperte</span></div>
          <div className="table-scroll" style={{ maxHeight: 200 }}>
            <table>
              <thead>
                <tr>
                  <th>Titolo</th><th>Qtà</th><th>Prezzo Medio</th><th>Prezzo Attuale</th><th>Valore</th><th>P&L</th><th>P&L%</th>
                </tr>
              </thead>
              <tbody>
                {positions.map(pos => (
                  <tr key={pos.id}>
                    <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{pos.id}</td>
                    <td style={{ fontFamily: "monospace" }}>{pos.qty}</td>
                    <td style={{ fontFamily: "monospace", color: "var(--g8)" }}>€{fmt(pos.avgPrice)}</td>
                    <td style={{ fontFamily: "monospace" }}>€{fmt(pos.currentPrice)}</td>
                    <td style={{ fontFamily: "monospace" }}>€{fmt(pos.mktVal)}</td>
                    <td style={{ fontFamily: "monospace", color: clr(pos.pnl) }}>{pos.pnl >= 0 ? "+" : ""}{fmtEur(pos.pnl)}</td>
                    <td style={{ fontFamily: "monospace", color: clr(pos.pnlPct) }}>{fmtPct(pos.pnlPct)}</td>
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
