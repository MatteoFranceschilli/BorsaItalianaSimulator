import { useState } from "react";

export default function NewGameScreen({ theme, onStart, onBack }) {
  const [nameInput, setNameInput] = useState("");

  const handleStart = () => {
    if (nameInput.trim()) onStart(nameInput.trim());
  };

  return (
    <div className={`app theme-${theme}`}>
      <div className="screen-wrap">
        <div className="screen-card" style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"Space Mono", fontSize:13, fontWeight:700, color:"var(--gold)", letterSpacing:2, marginBottom:20 }}>▶ NUOVA PARTITA</div>
          <div style={{ fontSize:13, color:"var(--text2)", marginBottom:22, lineHeight:1.7 }}>
            Inizierai con un capitale di <strong style={{ color:"var(--gold)" }}>€1.000</strong>.<br/>Come ti chiami?
          </div>
          <input
            className="s-input"
            placeholder="Il tuo nome..."
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleStart(); }}
            autoFocus
          />
          <button className="s-btn s-btn-gold" disabled={!nameInput.trim()} onClick={handleStart}>
            ▶ INIZIA
          </button>
          <button className="s-btn s-btn-ghost" onClick={onBack}>← Indietro</button>
        </div>
      </div>
    </div>
  );
}
