export default function StartScreen({ theme, toggleTheme, onNewGame, onLoadGame }) {
  return (
    <div className={`app theme-${theme}`}>
      <div className="screen-wrap">
        <div className="screen-card" style={{ textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:14 }}>🇮🇹</div>
          <div style={{ fontFamily:"Space Mono", fontSize:20, fontWeight:700, color:"var(--gold)", letterSpacing:2, marginBottom:2 }}>BORSA ITALIANA</div>
          <div style={{ fontFamily:"Space Mono", fontSize:10, color:"var(--text3)", letterSpacing:4, marginBottom:32 }}>SIMULATORE</div>
          <button className="s-btn s-btn-gold" onClick={onNewGame}>▶ NUOVA PARTITA</button>
          <button className="s-btn s-btn-ghost" onClick={onLoadGame}>📂 CARICA PARTITA</button>
          <button onClick={toggleTheme}
            style={{ background:"transparent", border:"none", color:"var(--text3)", fontSize:11, fontFamily:"Space Mono", cursor:"pointer", marginTop:10 }}>
            {theme === "dark" ? "☀️ Tema chiaro" : "🌙 Tema scuro"}
          </button>
        </div>
      </div>
    </div>
  );
}
