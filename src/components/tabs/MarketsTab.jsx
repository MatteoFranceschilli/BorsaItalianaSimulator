import { useState } from "react";
import { ALL_INSTRUMENTS } from "../../data/instruments.js";
import { fmt, fmtPct, clr } from "../../utils/formatters.js";
import Sparkline from "../charts/Sparkline.jsx";

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

  const filtered = ALL_INSTRUMENTS.filter(i => i.category === subTab);

  const handleBuy = (instr) => { onSelectInstr(instr); onSetOrderSide("buy"); onSetTab("trading"); };
  const handleSell = (instr) => { onSelectInstr(instr); onSetOrderSide("sell"); onSetTab("trading"); };

  return (
    <div className="card">
      <div className="subtabs">
        {SUBTABS.map(st => (
          <button key={st} className={`sub-chip ${subTab === st ? "active" : ""}`} onClick={() => setSubTab(st)}>{st}</button>
        ))}
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Codice</th>
              <th>Nome</th>
              <th>Settore</th>
              <th style={{ textAlign: "right" }}>Prezzo</th>
              <th style={{ textAlign: "right" }}>Var%</th>
              <th style={{ textAlign: "right" }}>H/L Giornaliero</th>
              <th>Trend</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(i => (
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
