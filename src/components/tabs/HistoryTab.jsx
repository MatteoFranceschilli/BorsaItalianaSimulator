import { fmt } from "../../utils/formatters.js";

export default function HistoryTab({ trades }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">📋 Storico Operazioni ({trades.length})</span>
      </div>
      {trades.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontFamily: "Space Mono", fontSize: 14 }}>Nessuna operazione ancora</div>
        </div>
      ) : (
        <div className="table-scroll" style={{ maxHeight: 600 }}>
          <table>
            <thead>
              <tr>
                <th>Data/Ora</th>
                <th>Strumento</th>
                <th>Tipo</th>
                <th style={{ textAlign: "right" }}>Qtà</th>
                <th style={{ textAlign: "right" }}>Prezzo</th>
                <th style={{ textAlign: "right" }}>Commissione</th>
                <th style={{ textAlign: "right" }}>Imposta</th>
                <th style={{ textAlign: "right" }}>Totale</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(t => (
                <tr key={t.id}>
                  <td style={{ fontSize: 11, color: "var(--text3)" }}>{t.time}</td>
                  <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{t.instrId}</td>
                  <td style={{ color: t.side === "buy" ? "#00e676" : "#ff1744", fontFamily: "monospace", fontWeight: 700 }}>
                    {t.side === "buy" ? "BUY" : "SELL"}
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "monospace" }}>{t.qty}</td>
                  <td style={{ textAlign: "right", fontFamily: "monospace" }}>€{fmt(t.price)}</td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", color: "#ffc107" }}>€{fmt(t.commission)}</td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", color: (t.tax || 0) > 0 ? "#ff9800" : "var(--text3)" }}>
                    {(t.tax || 0) > 0 ? `€${fmt(t.tax)}` : "—"}
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", color: t.side === "buy" ? "#ff1744" : "#00e676", fontWeight: 700 }}>
                    {t.side === "buy" ? "-" : "+"}€{fmt(t.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
