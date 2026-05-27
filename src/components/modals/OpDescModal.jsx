import { OP_DESCRIPTIONS } from "../../data/operations.js";

export default function OpDescModal({ orderType, orderSide, showOpDesc, onClose }) {
  const opKey = orderType === "stop" ? "stop-sell" : `${orderType}-${orderSide}`;
  const d = OP_DESCRIPTIONS[opKey];
  if (!d || !showOpDesc) return null;

  const RiskDot = ({ filled }) => (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%", marginRight: 3,
      background: filled ? d.color : "var(--border-inline2)", border: `1px solid ${filled ? d.color : "var(--border-inline2)"}`
    }} />
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg2)", border: `1px solid ${d.color}55`, borderTop: `3px solid ${d.color}`, borderRadius: 6, padding: 24, maxWidth: 500, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>{d.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Space Mono", fontSize: 14, fontWeight: 700, color: d.color }}>{d.label}</div>
            <div style={{ fontSize: 12, color: "var(--g8)", marginTop: 3 }}>{d.short}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "Space Mono" }}>RISCHIO</span>
            {[0, 1, 2].map(i => <RiskDot key={i} filled={i <= d.riskLevel} />)}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--g5)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>⏱ Quando usarlo</div>
          <div style={{ fontSize: 12, color: "var(--gc)", lineHeight: 1.6, background: "var(--bg-inline2)", borderRadius: 3, padding: "8px 10px" }}>{d.when}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#00e676", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>✓ Vantaggi</div>
            {d.pro.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                <span style={{ color: "#00e676", flexShrink: 0 }}>+</span>
                <span style={{ fontSize: 11, color: "var(--ga)", lineHeight: 1.5 }}>{p}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#ff1744", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>✗ Svantaggi</div>
            {d.con.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                <span style={{ color: "#ff1744", flexShrink: 0 }}>−</span>
                <span style={{ fontSize: 11, color: "var(--ga)", lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: d.note ? 12 : 0 }}>
          <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>📋 Esempio pratico</div>
          <div style={{ fontSize: 12, color: "var(--gb)", lineHeight: 1.6, background: `${d.color}08`, border: `1px solid ${d.color}22`, borderRadius: 3, padding: "8px 10px", fontFamily: "Space Mono" }}>{d.example}</div>
        </div>

        {d.note && (
          <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(255,109,0,0.06)", border: "1px solid rgba(255,109,0,0.25)", borderRadius: 3, fontSize: 11, color: "#ff9e40", lineHeight: 1.5 }}>{d.note}</div>
        )}
      </div>
    </div>
  );
}
