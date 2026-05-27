import { fmt, fmtPct, clr } from "../../utils/formatters.js";

export default function OrdersTab({ orders, prices, onRemoveOrder, onClearOrders }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">🔔 Ordini Attivi ({orders.length})</span>
        {orders.length > 0 && (
          <button className="btn-outline" onClick={onClearOrders}>Cancella Tutti</button>
        )}
      </div>
      {orders.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          <div style={{ fontFamily: "Space Mono", fontSize: 14 }}>Nessun ordine in attesa</div>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Strumento</th>
              <th>Tipo</th>
              <th>Direzione</th>
              <th style={{ textAlign: "right" }}>Qtà</th>
              <th style={{ textAlign: "right" }}>Prezzo Trigger</th>
              <th style={{ textAlign: "right" }}>Prezzo Attuale</th>
              <th>Inserito</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(ord => {
              const cp = prices[ord.instrId]?.current;
              const trigger = ord.limitPrice || ord.stopPrice;
              const dist = cp && trigger ? ((trigger / cp - 1) * 100) : null;
              return (
                <tr key={ord.id}>
                  <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{ord.instrId}</td>
                  <td style={{ color: "var(--g8)", fontSize: 12, fontFamily: "monospace" }}>{ord.type.toUpperCase()}</td>
                  <td style={{ color: ord.side === "buy" ? "#00e676" : "#ff1744", fontFamily: "monospace", fontWeight: 700 }}>
                    {ord.side === "buy" ? "BUY" : "SELL"}
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "monospace" }}>{ord.qty}</td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", color: "#ffc107" }}>€{fmt(trigger)}</td>
                  <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                    €{fmt(cp)}
                    {dist !== null && <span style={{ marginLeft: 6, fontSize: 10, color: clr(-dist) }}>({fmtPct(dist)})</span>}
                  </td>
                  <td style={{ fontSize: 11, color: "var(--text3)" }}>{ord.time}</td>
                  <td>
                    <button className="btn-outline" onClick={() => onRemoveOrder(ord.id)}>✕</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
