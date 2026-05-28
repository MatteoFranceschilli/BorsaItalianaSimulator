import { useState, useMemo } from "react";
import { ALL_INSTRUMENTS } from "../../data/instruments.js";
import { fmt, fmtPct, clr } from "../../utils/formatters.js";
import Sparkline from "../charts/Sparkline.jsx";
import { useSortableTable } from "../../hooks/useSortableTable.js";
import { TableSearch, SortableTh } from "../ui/TableControls.jsx";

const SUBTABS = ["Azioni", "ETF/ETC", "Obbligazioni", "Derivati", "Fondo"];

function InstrumentRow({ instr, prices, priceHistory, selectedId, onSelect, onBuy, onSell }) {
  const p = prices[instr.id];
  if (!p) return null;
  const changed = p.current !== p.prev;
  const up = p.current > p.prev;
  return (
    <tr
      className={`instr-row ${changed ? (up ? "flash-up" : "flash-down") : ""}`}
      onClick={() => onSelect(instr)}
      style={{ cursor: "pointer", background: selectedId === instr.id ? "rgba(0,230,118,0.05)" : "" }}
    >
      <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{instr.id}</td>
      <td style={{ color: "var(--gc)", fontSize: 12 }}>{instr.name}</td>
      <td style={{ color: "var(--ga)", fontSize: 11 }}>{instr.sector || instr.type || instr.category}</td>
      <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: up ? "#00e676" : "#ff1744" }}>
        €{fmt(p.current)}
      </td>
      <td style={{ textAlign: "right", color: clr(p.pctChange), fontFamily: "monospace", fontSize: 12 }}>{fmtPct(p.pctChange)}</td>
      <td style={{ textAlign: "right", color: "var(--g5)", fontSize: 11, fontFamily: "monospace" }}>
        H: €{fmt(p.high)} / L: €{fmt(p.low)}
      </td>
      <td><Sparkline data={priceHistory[instr.id] || []} w={80} h={24} /></td>
      <td>
        <button className="btn-buy-sm" onClick={e => { e.stopPropagation(); onBuy(instr); }}>BUY</button>
        <button className="btn-sell-sm" onClick={e => { e.stopPropagation(); onSell(instr); }}>SELL</button>
      </td>
    </tr>
  );
}

export default function MarketsTab({ prices, priceHistory, selectedInstr, onSelectInstr, onSetTab, onSetOrderSide }) {
  const [subTab, setSubTab] = useState("Azioni");

  const enriched = useMemo(() =>
    ALL_INSTRUMENTS
      .filter(i => i.category === subTab)
      .map(i => {
        const p = prices[i.id] || {};
        return {
          ...i,
          _current: p.current || 0,
          _pctChange: p.pctChange || 0,
          _high: p.high || 0,
          _low: p.low || 0,
          _sector: i.sector || i.type || i.category || "",
        };
      }),
    [subTab, prices]
  );

  const { rows, sortKey, sortDir, handleSort, query, setQuery } = useSortableTable(enriched, {
    searchFn: (row, q) =>
      row.id.toLowerCase().includes(q) ||
      row.name.toLowerCase().includes(q) ||
      row._sector.toLowerCase().includes(q),
  });

  const handleBuy = (instr) => { onSelectInstr(instr); onSetOrderSide("buy"); onSetTab("trading"); };
  const handleSell = (instr) => { onSelectInstr(instr); onSetOrderSide("sell"); onSetTab("trading"); };

  return (
    <div className="card">
      <div className="subtabs">
        {SUBTABS.map(st => (
          <button key={st} className={`sub-chip ${subTab === st ? "active" : ""}`} onClick={() => setSubTab(st)}>{st}</button>
        ))}
      </div>
      <TableSearch query={query} onChange={setQuery} placeholder="Cerca per codice, nome, settore..." />
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <SortableTh label="Codice"          sk="id"         sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableTh label="Nome"             sk="name"       sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableTh label="Settore"          sk="_sector"    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableTh label="Prezzo"           sk="_current"   sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
              <SortableTh label="Var%"             sk="_pctChange" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
              <SortableTh label="H/L Giornaliero" sk="_high"      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
              <th>Trend</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(i => (
              <InstrumentRow
                key={i.id}
                instr={i}
                prices={prices}
                priceHistory={priceHistory}
                selectedId={selectedInstr?.id}
                onSelect={onSelectInstr}
                onBuy={handleBuy}
                onSell={handleSell}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
