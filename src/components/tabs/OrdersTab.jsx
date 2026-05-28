import { useMemo } from "react";
import { fmt, fmtPct, clr } from "../../utils/formatters.js";
import { useSortableTable } from "../../hooks/useSortableTable.js";
import { TableSearch, SortableTh } from "../ui/TableControls.jsx";

export default function OrdersTab({ orders, prices, onRemoveOrder, onClearOrders }) {
  const enriched = useMemo(() =>
    orders.map(ord => {
      const cp = prices[ord.instrId]?.current;
      const trigger = ord.limitPrice || ord.stopPrice;
      const dist = cp && trigger ? ((trigger / cp - 1) * 100) : null;
      return { ...ord, _trigger: trigger || 0, _cp: cp || 0, _dist: dist };
    }),
    [orders, prices]
  );

  const { rows, sortKey, sortDir, handleSort, query, setQuery } = useSortableTable(enriched, {
    searchFn: (ord, q) =>
      ord.instrId.toLowerCase().includes(q) ||
      ord.type.toLowerCase().includes(q) ||
      ord.side.includes(q),
  });

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
        <>
          <TableSearch query={query} onChange={setQuery} placeholder="Cerca per strumento, tipo..." />
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <SortableTh label="Strumento"      sk="instrId"  sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  <SortableTh label="Tipo"            sk="type"     sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  <SortableTh label="Direzione"       sk="side"     sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  <SortableTh label="Qtà"             sk="qty"      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="Prezzo Trigger"  sk="_trigger" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="Prezzo Attuale"  sk="_cp"      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="Inserito"        sk="time"     sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(ord => (
                  <tr key={ord.id}>
                    <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{ord.instrId}</td>
                    <td style={{ color: "var(--g8)", fontSize: 12, fontFamily: "monospace" }}>{ord.type.toUpperCase()}</td>
                    <td style={{ color: ord.side === "buy" ? "#00e676" : "#ff1744", fontFamily: "monospace", fontWeight: 700 }}>
                      {ord.side === "buy" ? "BUY" : "SELL"}
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>{ord.qty}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", color: "#ffc107" }}>€{fmt(ord._trigger)}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                      €{fmt(ord._cp)}
                      {ord._dist !== null && <span style={{ marginLeft: 6, fontSize: 10, color: clr(-ord._dist) }}>({fmtPct(ord._dist)})</span>}
                    </td>
                    <td style={{ fontSize: 11, color: "var(--text3)" }}>{ord.time}</td>
                    <td>
                      <button className="btn-outline" onClick={() => onRemoveOrder(ord.id)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
