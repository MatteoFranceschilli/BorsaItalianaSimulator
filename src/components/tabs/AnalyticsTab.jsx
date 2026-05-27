import { STOCKS } from "../../data/stocks.js";
import { fmt, fmtEur, fmtPct, clr } from "../../utils/formatters.js";

export default function AnalyticsTab({ positions, trades, prices, portfolioValue, totalValue }) {
  const returns = positions.map(p => p.pnlPct);
  const posCount = returns.filter(r => r > 0).length;
  const negCount = returns.filter(r => r < 0).length;
  const avgReturn = returns.length ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  const totalCommissions = trades.reduce((sum, t) => sum + t.commission, 0);
  const winRate = returns.length ? (posCount / returns.length) * 100 : 0;
  const bestPos = positions.reduce((best, p) => (!best || p.pnlPct > best.pnlPct) ? p : best, null);
  const worstPos = positions.reduce((worst, p) => (!worst || p.pnlPct < worst.pnlPct) ? p : worst, null);

  const statCards = [
    ["Ritorno Medio Posizioni", fmtPct(avgReturn), clr(avgReturn)],
    ["Win Rate", fmt(winRate) + "%", winRate >= 50 ? "#00e676" : "#ff1744"],
    ["Commissioni Totali", fmtEur(totalCommissions), "#ffc107"],
    ["Posizioni Positive", posCount, "#00e676"],
    ["Posizioni Negative", negCount, "#ff1744"],
    ["Miglior Titolo", bestPos ? `${bestPos.id} (${fmtPct(bestPos.pnlPct)})` : "—", "#00e676"],
    ["Peggior Titolo", worstPos ? `${worstPos.id} (${fmtPct(worstPos.pnlPct)})` : "—", "#ff1744"],
    ["N. Operazioni", trades.length, "#ccc"],
    ["Esposizione Mercato", fmt((portfolioValue / totalValue) * 100) + "%", "#888"],
  ];

  const byCategory = {};
  positions.forEach(p => {
    const cat = p.category || "Altro";
    if (!byCategory[cat]) byCategory[cat] = { mktVal: 0, pnl: 0 };
    byCategory[cat].mktVal += p.mktVal;
    byCategory[cat].pnl += p.pnl;
  });

  const sectors = {};
  STOCKS.forEach(s => {
    if (!sectors[s.sector]) sectors[s.sector] = [];
    sectors[s.sector].push(prices[s.id]?.pctChange || 0);
  });
  const sectorPerf = Object.entries(sectors)
    .map(([sec, changes]) => ({ sec, avg: changes.reduce((a, b) => a + b, 0) / changes.length }))
    .sort((a, b) => b.avg - a.avg);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="grid3">
        {statCards.map(([lbl, val, color]) => (
          <div className="card" key={lbl}>
            <div style={{ padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "Space Mono", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{lbl}</div>
              <div style={{ fontSize: 18, fontFamily: "Space Mono", fontWeight: 700, color }}>{val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">📊 Analisi per Categoria (Portafoglio)</span></div>
        {positions.length === 0 ? (
          <div style={{ padding: 20, color: "var(--text3)", textAlign: "center", fontSize: 12 }}>Nessuna posizione aperta</div>
        ) : (
          <div className="sector-grid">
            {Object.entries(byCategory).map(([cat, data]) => (
              <div className="sector-card" key={cat}>
                <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "Space Mono", marginBottom: 4 }}>{cat}</div>
                <div style={{ fontSize: 14, fontFamily: "Space Mono", fontWeight: 700, color: "#e8c96c" }}>€{fmt(data.mktVal)}</div>
                <div style={{ fontSize: 12, fontFamily: "Space Mono", color: clr(data.pnl) }}>
                  {data.pnl >= 0 ? "+" : ""}{fmtEur(data.pnl)}
                </div>
                <div style={{ fontSize: 10, color: "var(--g5)", marginTop: 4 }}>
                  {fmt((data.mktVal / portfolioValue) * 100)}% ptf
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">📈 Performance Mercato — Top & Flop Settori</span></div>
        <div style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {sectorPerf.map(({ sec, avg }) => (
            <div key={sec} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, color: "var(--g8)", width: 120, flexShrink: 0 }}>{sec}</span>
              <div style={{ flex: 1 }}>
                <div className="pbar-wrap">
                  <div className="pbar" style={{ width: `${Math.min(100, Math.abs(avg) * 10 + 50)}%`, background: avg >= 0 ? "#00e676" : "#ff1744", opacity: 0.6 }} />
                </div>
              </div>
              <span style={{ fontSize: 11, fontFamily: "Space Mono", color: clr(avg), width: 60, textAlign: "right" }}>{fmtPct(avg)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
