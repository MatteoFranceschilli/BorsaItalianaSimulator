import { ALL_INSTRUMENTS } from "../../data/instruments.js";
import { OP_DESCRIPTIONS } from "../../data/operations.js";
import { fmt, fmtPct, clr } from "../../utils/formatters.js";
import PriceChart from "../charts/PriceChart.jsx";
import OpDescModal from "../modals/OpDescModal.jsx";

export default function TradingTab({
  prices, priceHistory, portfolio,
  selectedInstr, onSelectInstr,
  orderType, onSetOrderType,
  orderSide, onSetOrderSide,
  orderQty, onSetOrderQty,
  limitPrice, onSetLimitPrice,
  stopPrice, onSetStopPrice,
  orderMsg, marketStatus,
  showOpDesc, onSetShowOpDesc,
  onSubmitOrder,
}) {
  const opKey = orderType === "stop" ? "stop-sell" : `${orderType}-${orderSide}`;
  const currentOpDesc = OP_DESCRIPTIONS[opKey];
  const cp = selectedInstr ? prices[selectedInstr.id]?.current : null;
  const qty = parseInt(orderQty || 0);
  const commission = cp && qty ? Math.max(1.5, cp * qty * 0.001) : 0;

  return (
    <div className="grid-main">
      {/* Left column: search + chart + order book */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">🔍 Cerca Strumento</span></div>
          <div style={{ padding: 12 }}>
            <select
              value={selectedInstr?.id || ""}
              onChange={e => {
                const instr = ALL_INSTRUMENTS.find(i => i.id === e.target.value);
                onSelectInstr(instr || null);
              }}
            >
              <option value="">-- Seleziona --</option>
              {["Azioni", "ETF/ETC", "Obbligazioni", "Derivati", "Fondo"].map(cat => (
                <optgroup key={cat} label={cat}>
                  {ALL_INSTRUMENTS.filter(i => i.category === cat).map(i => (
                    <option key={i.id} value={i.id}>{i.id} — {i.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {selectedInstr && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">{selectedInstr.id} — {selectedInstr.name}</span>
              <span style={{ fontFamily: "monospace", fontSize: 20, color: clr(prices[selectedInstr.id]?.pctChange || 0) }}>
                €{fmt(prices[selectedInstr.id]?.current)}
              </span>
            </div>
            <div style={{ padding: "0 0 8px 0" }}>
              <PriceChart data={priceHistory[selectedInstr.id] || []} id={selectedInstr.id} w={500} h={160} />
            </div>
            <div style={{ display: "flex", gap: 20, padding: "0 16px 12px", flexWrap: "wrap" }}>
              {[
                ["Apertura", `€${fmt(prices[selectedInstr.id]?.open)}`],
                ["Massimo", `€${fmt(prices[selectedInstr.id]?.high)}`],
                ["Minimo", `€${fmt(prices[selectedInstr.id]?.low)}`],
                ["Var%", fmtPct(prices[selectedInstr.id]?.pctChange || 0), clr(prices[selectedInstr.id]?.pctChange || 0)],
                ["Beta", selectedInstr.beta],
                ["Div. Yield", selectedInstr.div ? selectedInstr.div + "%" : "—"],
              ].map(([lbl, val, color]) => (
                <div key={lbl}>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 2, fontFamily: "Space Mono" }}>{lbl}</div>
                  <div style={{ fontFamily: "Space Mono", fontSize: 12, color: color || "#ccc" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedInstr && (
          <div className="card">
            <div className="card-header"><span className="card-title">📒 Book Ordini (Simulato)</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
              <div>
                <div style={{ padding: "4px 8px", background: "rgba(0,230,118,0.05)", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "Space Mono", fontSize: 10, color: "#00e676" }}>BID — Acquisto</span>
                </div>
                {Array.from({ length: 5 }, (_, i) => {
                  const bidP = (cp || 0) * (1 - 0.0002 * (i + 1));
                  const qty2 = Math.floor(Math.random() * 900 + 100);
                  return (
                    <div key={i} className="ob-row" style={{ background: `rgba(0,230,118,${0.04 - i * 0.007})` }}>
                      <span style={{ color: "#00e676" }}>€{fmt(bidP)}</span>
                      <span style={{ color: "var(--g6)" }}>{qty2}</span>
                    </div>
                  );
                })}
              </div>
              <div>
                <div style={{ padding: "4px 8px", background: "rgba(255,23,68,0.05)", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "Space Mono", fontSize: 10, color: "#ff1744" }}>ASK — Vendita</span>
                </div>
                {Array.from({ length: 5 }, (_, i) => {
                  const askP = (cp || 0) * (1 + 0.0002 * (i + 1));
                  const qty2 = Math.floor(Math.random() * 900 + 100);
                  return (
                    <div key={i} className="ob-row" style={{ background: `rgba(255,23,68,${0.04 - i * 0.007})` }}>
                      <span style={{ color: "#ff1744" }}>€{fmt(askP)}</span>
                      <span style={{ color: "var(--g6)" }}>{qty2}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right column: order panel + position card */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">⚡ Inserisci Ordine</span></div>
          <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{ flex: 1, padding: "8px", borderRadius: 3, border: "1px solid", fontFamily: "Space Mono", fontSize: 13, fontWeight: 700, cursor: "pointer", background: orderSide === "buy" ? "rgba(0,230,118,0.15)" : "transparent", borderColor: orderSide === "buy" ? "#00e676" : "var(--border-inline2)", color: orderSide === "buy" ? "#00e676" : "var(--text3)" }}
                onClick={() => onSetOrderSide("buy")}
              >ACQUISTA</button>
              <button
                style={{ flex: 1, padding: "8px", borderRadius: 3, border: "1px solid", fontFamily: "Space Mono", fontSize: 13, fontWeight: 700, cursor: "pointer", background: orderSide === "sell" ? "rgba(255,23,68,0.15)" : "transparent", borderColor: orderSide === "sell" ? "#ff1744" : "var(--border-inline2)", color: orderSide === "sell" ? "#ff1744" : "var(--text3)" }}
                onClick={() => onSetOrderSide("sell")}
              >VENDI</button>
            </div>

            <div className="form-group">
              <label className="form-label">Strumento</label>
              <select value={selectedInstr?.id || ""} onChange={e => onSelectInstr(ALL_INSTRUMENTS.find(i => i.id === e.target.value) || null)}>
                <option value="">-- Seleziona --</option>
                {["Azioni", "ETF/ETC", "Obbligazioni", "Derivati", "Fondo"].map(cat => (
                  <optgroup key={cat} label={cat}>
                    {ALL_INSTRUMENTS.filter(i => i.category === cat).map(i => (
                      <option key={i.id} value={i.id}>{i.id} — {i.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo Ordine</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[["market", "Market"], ["limit", "Limite"], ["stop", "Stop Loss"]].map(([v, l]) => (
                  <button key={v} className={`btn-outline ${orderType === v ? "active" : ""}`} onClick={() => onSetOrderType(v)}>{l}</button>
                ))}
              </div>
            </div>

            {currentOpDesc && (
              <div style={{ background: `${currentOpDesc.color}09`, border: `1px solid ${currentOpDesc.color}30`, borderLeft: `3px solid ${currentOpDesc.color}`, borderRadius: "0 4px 4px 0", padding: "9px 12px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{currentOpDesc.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Space Mono", fontSize: 10, fontWeight: 700, color: currentOpDesc.color, marginBottom: 3 }}>{currentOpDesc.label}</div>
                  <div style={{ fontSize: 11, color: "var(--g9)", lineHeight: 1.5 }}>{currentOpDesc.short}</div>
                </div>
                <button
                  onClick={() => onSetShowOpDesc(true)}
                  style={{ flexShrink: 0, background: "transparent", border: `1px solid ${currentOpDesc.color}44`, color: currentOpDesc.color, fontSize: 10, fontFamily: "Space Mono", padding: "3px 8px", borderRadius: 3, cursor: "pointer", whiteSpace: "nowrap" }}
                >Dettagli ›</button>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Quantità</label>
              <input type="number" min="1" value={orderQty} onChange={e => onSetOrderQty(e.target.value)} />
            </div>

            {orderType === "limit" && (
              <div className="form-group">
                <label className="form-label">Prezzo Limite (€)</label>
                <input type="number" step="0.01" value={limitPrice} onChange={e => onSetLimitPrice(e.target.value)} placeholder="es. 14.50" />
              </div>
            )}

            {orderType === "stop" && (
              <div className="form-group">
                <label className="form-label">Prezzo Stop (€)</label>
                <input type="number" step="0.01" value={stopPrice} onChange={e => onSetStopPrice(e.target.value)} placeholder="es. 13.80" />
              </div>
            )}

            {selectedInstr && cp && (
              <div style={{ background: "var(--bg-inline)", border: "1px solid var(--border)", borderRadius: 3, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono" }}>Prezzo attuale:</span>
                  <span style={{ fontSize: 11, fontFamily: "Space Mono", color: "var(--gc)" }}>€{fmt(cp)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono" }}>Controvalore:</span>
                  <span style={{ fontSize: 11, fontFamily: "Space Mono", color: "var(--gc)" }}>€{fmt(cp * qty)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono" }}>Commissione est.:</span>
                  <span style={{ fontSize: 11, fontFamily: "Space Mono", color: "#ffc107" }}>€{fmt(commission)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--gc)", fontFamily: "Space Mono", fontWeight: 700 }}>Totale:</span>
                  <span style={{ fontSize: 12, fontFamily: "Space Mono", fontWeight: 700, color: orderSide === "buy" ? "#ff1744" : "#00e676" }}>
                    {orderSide === "buy" ? "-" : "+"}€{fmt(cp * qty + (orderSide === "buy" ? commission : -commission))}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={onSubmitOrder}
              className={orderSide === "buy" ? "btn-buy" : "btn-sell"}
              disabled={marketStatus !== "APERTO" && orderType === "market"}
            >
              {orderType === "market" ? (orderSide === "buy" ? "ACQUISTA ORA" : "VENDI ORA") : (orderSide === "buy" ? "INSERISCI ORDINE BUY" : "INSERISCI ORDINE SELL")}
            </button>

            {marketStatus !== "APERTO" && orderType === "market" && (
              <div style={{ textAlign: "center", fontSize: 11, color: "#ff1744", fontFamily: "Space Mono" }}>⚠ Mercato {marketStatus}</div>
            )}

            {orderMsg && (
              <div style={{ padding: "8px 10px", background: "rgba(0,200,255,0.05)", border: "1px solid rgba(0,200,255,0.2)", borderRadius: 3, fontSize: 11, color: "#29b6f6", fontFamily: "Space Mono" }}>
                {orderMsg}
              </div>
            )}
          </div>
        </div>

        {selectedInstr && portfolio[selectedInstr.id] && (() => {
          const pos = portfolio[selectedInstr.id];
          const currentP = prices[selectedInstr.id]?.current || pos.avgPrice;
          const pnl = (currentP - pos.avgPrice) * pos.qty;
          const pnlPct = (currentP / pos.avgPrice - 1) * 100;
          return (
            <div className="card">
              <div className="card-header"><span className="card-title">💼 Posizione in {selectedInstr.id}</span></div>
              <div style={{ padding: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    ["Quantità:", pos.qty],
                    ["Prezzo medio:", `€${fmt(pos.avgPrice)}`],
                    ["Valore attuale:", `€${fmt(currentP * pos.qty)}`, "#e8c96c"],
                  ].map(([label, val, color]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono" }}>{label}</span>
                      <span style={{ fontSize: 12, fontFamily: "Space Mono", color: color || "var(--gc)" }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono" }}>P&L:</span>
                    <span style={{ fontSize: 13, fontFamily: "Space Mono", fontWeight: 700, color: clr(pnl) }}>
                      {pnl >= 0 ? "+" : ""}{fmt(pnl)} ({fmtPct(pnlPct)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <OpDescModal orderType={orderType} orderSide={orderSide} showOpDesc={showOpDesc} onClose={() => onSetShowOpDesc(false)} />
    </div>
  );
}
