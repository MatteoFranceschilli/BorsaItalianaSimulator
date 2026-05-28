import { fmt, fmtEur, fmtPct, clr } from "../../utils/formatters.js";
import Sparkline from "../charts/Sparkline.jsx";
import { useSortableTable } from "../../hooks/useSortableTable.js";
import { TableSearch, SortableTh } from "../ui/TableControls.jsx";

export default function PortfolioTab({ cash, portfolioValue, totalValue, totalPnl, totalPnlPct, positions, tradesCount, priceHistory, onClose }) {
  const { rows, sortKey, sortDir, handleSort, query, setQuery } = useSortableTable(positions, {
    searchFn: (pos, q) =>
      pos.id.toLowerCase().includes(q) ||
      pos.name.toLowerCase().includes(q) ||
      (pos.category || "").toLowerCase().includes(q),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="grid3">
        {[
          ["Valore Totale", fmtEur(totalValue), "#e8c96c"],
          ["Liquidità", fmtEur(cash), "#29b6f6"],
          ["Investito", fmtEur(portfolioValue), "#888"],
          ["P&L Totale", `${totalPnl >= 0 ? "+" : ""}${fmtEur(totalPnl)}`, clr(totalPnl)],
          ["P&L%", fmtPct(totalPnlPct), clr(totalPnlPct)],
          ["Operazioni", tradesCount, "#888"],
        ].map(([lbl, val, color]) => (
          <div className="card" key={lbl}>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{lbl}</div>
              <div style={{ fontSize: 22, fontFamily: "Space Mono", fontWeight: 700, color }}>{val}</div>
            </div>
          </div>
        ))}
      </div>

      {positions.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          <div style={{ fontFamily: "Space Mono", fontSize: 14 }}>Nessuna posizione aperta</div>
          <div style={{ fontSize: 12, marginTop: 8 }}>Vai su Trading per acquistare strumenti</div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <span className="card-title">📊 Posizioni Aperte ({positions.length})</span>
          </div>
          <TableSearch query={query} onChange={setQuery} placeholder="Cerca per codice, nome, categoria..." />
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <SortableTh label="Codice"     sk="id"           sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  <SortableTh label="Nome"        sk="name"         sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  <SortableTh label="Categoria"   sk="category"     sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  <SortableTh label="Qtà"         sk="qty"          sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="Pr. Medio"   sk="avgPrice"     sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="Pr. Attuale" sk="currentPrice" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="Valore Mkt"  sk="mktVal"       sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="P&L €"       sk="pnl"          sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                  <SortableTh label="P&L %"       sk="pnlPct"       sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                  <th>Trend</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(pos => (
                  <tr key={pos.id}>
                    <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{pos.id}</td>
                    <td style={{ color: "var(--gc)", fontSize: 11 }}>{pos.name}</td>
                    <td style={{ color: "var(--g5)", fontSize: 11 }}>{pos.category}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>{pos.qty}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", color: "var(--g8)" }}>€{fmt(pos.avgPrice)}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>€{fmt(pos.currentPrice)}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", color: "#e8c96c" }}>€{fmt(pos.mktVal)}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", color: clr(pos.pnl) }}>
                      {pos.pnl >= 0 ? "+" : ""}{fmtEur(pos.pnl)}
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", color: clr(pos.pnlPct) }}>
                      {fmtPct(pos.pnlPct)}
                    </td>
                    <td><Sparkline data={priceHistory[pos.id] || []} w={80} h={22} /></td>
                    <td>
                      <button className="btn-sell-sm" onClick={() => onClose(pos)}>CHIUDI</button>
                    </td>
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
