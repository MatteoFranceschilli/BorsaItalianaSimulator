import { fmt, fmtDate, fmtSaveDate } from "../../utils/formatters.js";

export default function LoadGameScreen({ theme, savedGames, loadingGames, onLoad, onDelete, onBack, onNewGame }) {
  return (
    <div className={`app theme-${theme}`}>
      <div className="screen-wrap" style={{ alignItems: "flex-start" }}>
        <div className="screen-card" style={{ maxWidth: 540, marginTop: 20 }}>
          <button className="s-btn s-btn-ghost" style={{ marginBottom: 16 }} onClick={onBack}>← Indietro</button>
          <div style={{ fontFamily: "Space Mono", fontSize: 13, fontWeight: 700, color: "var(--gold)", letterSpacing: 2, marginBottom: 18 }}>📂 CARICA PARTITA</div>

          {loadingGames && (
            <div style={{ textAlign: "center", color: "var(--text3)", fontFamily: "Space Mono", fontSize: 12, padding: 24 }}>Caricamento...</div>
          )}

          {!loadingGames && savedGames.length === 0 && (
            <div style={{ textAlign: "center", padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
              <div style={{ fontFamily: "Space Mono", fontSize: 12, color: "var(--text3)" }}>Nessuna partita salvata</div>
            </div>
          )}

          {!loadingGames && savedGames.map(g => {
            const total = g.cash + (g.portfolioValue || 0);
            const pnl = total - 1000;
            return (
              <div key={g.id} className="save-row" onClick={() => onLoad(g.id)}>
                <div style={{ fontSize: 26, flexShrink: 0 }}>👤</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Space Mono", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{g.playerName}</div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    {[
                      ["Capitale", `€${fmt(total)}`, "var(--gold)"],
                      ["P&L", `${pnl >= 0 ? "+" : ""}€${fmt(Math.abs(pnl))}`, pnl >= 0 ? "var(--green)" : "var(--red)"],
                      ["Data gioco", fmtDate(g.simTime), "var(--text2)"],
                      ["Salvata il", fmtSaveDate(g.savedAt), "var(--text3)"],
                    ].map(([label, val, color]) => (
                      <div key={label}>
                        <div style={{ fontSize: 9, color: "var(--text3)", fontFamily: "Space Mono", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{label}</div>
                        <div style={{ fontFamily: "Space Mono", fontSize: 12, fontWeight: 700, color }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(g.id); }}
                  style={{ flexShrink: 0, background: "transparent", border: "1px solid rgba(196,0,26,0.3)", color: "var(--red)", padding: "4px 8px", borderRadius: 3, cursor: "pointer", fontSize: 11, fontFamily: "Space Mono" }}
                >✕</button>
              </div>
            );
          })}

          <button className="s-btn s-btn-ghost" style={{ marginTop: 10, borderStyle: "dashed" }} onClick={onNewGame}>+ Nuova partita</button>
        </div>
      </div>
    </div>
  );
}
