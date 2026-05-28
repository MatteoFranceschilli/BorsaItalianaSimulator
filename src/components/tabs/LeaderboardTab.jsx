import { useMemo } from "react";
import { NPCS, NPC_ARCHETYPES } from "../../data/npcs.js";
import { fmt, fmtEur, fmtPct, clr } from "../../utils/formatters.js";
import { useSortableTable } from "../../hooks/useSortableTable.js";
import { TableSearch, SortableTh } from "../ui/TableControls.jsx";

function calcNPCValue(state, prices) {
  return state.cash + Object.entries(state.portfolio).reduce((sum, [id, pos]) => {
    return sum + pos.qty * (prices[id]?.current || pos.avgPrice);
  }, 0);
}

export default function LeaderboardTab({ npcStates, npcTrades, prices, playerName, playerTotalValue }) {
  const PLAYER_START = 1000;
  const playerPnl = playerTotalValue - PLAYER_START;
  const playerPnlPct = (playerTotalValue / PLAYER_START - 1) * 100;

  const rankedEntries = useMemo(() => {
    const all = [
      {
        id: "__player__",
        name: playerName || "Tu",
        avatar: "🧑",
        title: "Il Giocatore",
        archetype: null,
        totalValue: playerTotalValue,
        pnl: playerPnl,
        pnlPct: playerPnlPct,
        startCash: PLAYER_START,
        isPlayer: true,
        positions: null,
        _archetypeLabel: "Giocatore",
      },
      ...NPCS.map(npc => {
        const state = npcStates[npc.id] || { cash: npc.startCash, portfolio: {} };
        const totalValue = calcNPCValue(state, prices);
        const arch = NPC_ARCHETYPES[npc.archetype];
        return {
          ...npc,
          totalValue,
          pnl: totalValue - npc.startCash,
          pnlPct: (totalValue / npc.startCash - 1) * 100,
          isPlayer: false,
          positions: Object.keys(state.portfolio).length,
          cash: state.cash,
          _archetypeLabel: arch?.label || "",
        };
      }),
    ].sort((a, b) => b.totalValue - a.totalValue);

    return all.map((e, i) => ({ ...e, _rank: i + 1 }));
  }, [npcStates, prices, playerName, playerTotalValue]);

  const playerRank = rankedEntries.find(e => e.isPlayer)?._rank ?? 0;
  const rankEmoji = playerRank === 1 ? "🥇" : playerRank === 2 ? "🥈" : playerRank === 3 ? "🥉" : `#${playerRank}`;

  const { rows, sortKey, sortDir, handleSort, query, setQuery } = useSortableTable(rankedEntries, {
    defaultKey: "totalValue",
    defaultDir: "desc",
    searchFn: (e, q) =>
      e.name.toLowerCase().includes(q) ||
      (e.title || "").toLowerCase().includes(q) ||
      e._archetypeLabel.toLowerCase().includes(q),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      <div className="card" style={{ borderLeft: `3px solid #e8c96c` }}>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "Space Mono", fontSize: 36 }}>{rankEmoji}</span>
          <div>
            <div style={{ fontFamily: "Space Mono", fontSize: 13, fontWeight: 700, color: "var(--gc)" }}>
              Sei in {playerRank}ª posizione su {rankedEntries.length} trader
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>
              Capitale totale: {fmtEur(playerTotalValue)} · P&L:{" "}
              <span style={{ color: clr(playerPnl) }}>
                {playerPnl >= 0 ? "+" : ""}{fmtEur(playerPnl)} ({fmtPct(playerPnlPct)})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">🏆 Classifica Trader</span></div>
        <TableSearch query={query} onChange={setQuery} placeholder="Cerca per nome, strategia..." />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <SortableTh label="#"         sk="_rank"      sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortableTh label="Trader"    sk="name"       sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortableTh label="Strategia" sk="_archetypeLabel" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortableTh label="Totale"    sk="totalValue" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                <SortableTh label="P&L"       sk="pnl"        sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                <SortableTh label="P&L%"      sk="pnlPct"     sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                <SortableTh label="Pos."      sk="positions"  sortKey={sortKey} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
              </tr>
            </thead>
            <tbody>
              {rows.map(entry => {
                const arch = entry.archetype ? NPC_ARCHETYPES[entry.archetype] : null;
                const medal = entry._rank === 1 ? "🥇" : entry._rank === 2 ? "🥈" : entry._rank === 3 ? "🥉" : null;
                return (
                  <tr
                    key={entry.id}
                    style={{ background: entry.isPlayer ? "rgba(232,201,108,0.06)" : undefined }}
                  >
                    <td style={{
                      fontFamily: "Space Mono", fontWeight: 700,
                      color: entry._rank === 1 ? "#ffd700" : entry._rank === 2 ? "#c0c0c0" : entry._rank === 3 ? "#cd7f32" : "var(--text3)",
                    }}>
                      {medal || `#${entry._rank}`}
                    </td>
                    <td>
                      <span style={{ fontSize: 15 }}>{entry.avatar}</span>{" "}
                      <span style={{
                        fontFamily: "Space Mono", fontSize: 11,
                        color: entry.isPlayer ? "#e8c96c" : "var(--gc)",
                        fontWeight: entry.isPlayer ? 700 : 400,
                      }}>
                        {entry.name}
                      </span>
                      {entry.isPlayer && (
                        <span style={{ fontSize: 9, color: "#e8c96c", marginLeft: 5 }}>◄ TU</span>
                      )}
                    </td>
                    <td>
                      {arch ? (
                        <span style={{
                          fontSize: 10, fontFamily: "Space Mono",
                          background: `${arch.color}22`, border: `1px solid ${arch.color}55`,
                          color: arch.color, padding: "1px 6px", borderRadius: 3,
                        }}>
                          {arch.label}
                        </span>
                      ) : (
                        <span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "Space Mono" }}>
                          {entry.title}
                        </span>
                      )}
                    </td>
                    <td style={{ fontFamily: "Space Mono", fontSize: 12, color: "#e8c96c", textAlign: "right" }}>
                      {fmtEur(entry.totalValue)}
                    </td>
                    <td style={{ fontFamily: "Space Mono", fontSize: 12, color: clr(entry.pnl), textAlign: "right" }}>
                      {entry.pnl >= 0 ? "+" : ""}{fmtEur(entry.pnl)}
                    </td>
                    <td style={{ fontFamily: "Space Mono", fontSize: 12, color: clr(entry.pnlPct), textAlign: "right" }}>
                      {fmtPct(entry.pnlPct)}
                    </td>
                    <td style={{ fontFamily: "Space Mono", fontSize: 12, color: "var(--text2)", textAlign: "right" }}>
                      {entry.isPlayer ? "—" : entry.positions}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">👥 Profili Trader NPC</span></div>
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {NPCS.map(npc => {
            const arch = NPC_ARCHETYPES[npc.archetype];
            const state = npcStates[npc.id] || { cash: npc.startCash, portfolio: {} };
            const tv = calcNPCValue(state, prices);
            const pnlPct = (tv / npc.startCash - 1) * 100;
            return (
              <div
                key={npc.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 0", borderBottom: "1px solid var(--border2)",
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{npc.avatar}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "Space Mono", fontSize: 11, fontWeight: 700, color: "var(--gc)" }}>
                      {npc.name}
                    </span>
                    <span style={{
                      fontSize: 9, fontFamily: "Space Mono",
                      background: `${arch.color}22`, border: `1px solid ${arch.color}55`,
                      color: arch.color, padding: "1px 5px", borderRadius: 3,
                    }}>
                      {arch.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{npc.description}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "Space Mono", fontSize: 11, color: "#e8c96c" }}>{fmtEur(tv)}</div>
                  <div style={{ fontFamily: "Space Mono", fontSize: 10, color: clr(pnlPct) }}>
                    {pnlPct >= 0 ? "+" : ""}{fmtPct(pnlPct)}
                  </div>
                  <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 1 }}>
                    {Object.keys(state.portfolio).length} pos.
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {npcTrades.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">🔔 Operazioni Recenti NPC</span>
            <span style={{ fontSize: 10, fontFamily: "Space Mono", color: "var(--text3)" }}>
              ultime {Math.min(npcTrades.length, 20)}
            </span>
          </div>
          <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            {npcTrades.slice(0, 20).map((trade, i) => (
              <div
                key={`${trade.npcId}_${trade.t}_${i}`}
                style={{
                  display: "flex", alignItems: "center", gap: 8, fontSize: 11,
                  borderBottom: i < Math.min(npcTrades.length, 20) - 1 ? "1px solid var(--border2)" : "none",
                  paddingBottom: 4,
                }}
              >
                <span style={{ flexShrink: 0 }}>{trade.npcAvatar}</span>
                <span style={{ fontFamily: "Space Mono", color: "var(--text3)", fontSize: 10, width: 90, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {trade.npcName}
                </span>
                <span style={{
                  color: trade.action === "buy" ? "#00e676" : "#ff1744",
                  fontFamily: "Space Mono", fontWeight: 700, fontSize: 10, flexShrink: 0,
                }}>
                  {trade.action === "buy" ? "BUY" : "SELL"}
                </span>
                <span style={{ fontFamily: "Space Mono", color: "#e8c96c", fontSize: 11 }}>{trade.instrId}</span>
                <span style={{ color: "var(--text3)", fontSize: 11 }}>×{trade.qty}</span>
                <span style={{ marginLeft: "auto", fontFamily: "Space Mono", fontSize: 10, color: "var(--text3)", flexShrink: 0 }}>
                  €{fmt(trade.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
