const CATEGORY_COLOR = {
  "Geopolitico":     "#ff6d00",
  "Politico":        "#ff9800",
  "Economico":       "#29b6f6",
  "Energia":         "#ffc107",
  "Tecnologia":      "#7c4dff",
  "Disastro Naturale": "#ff1744",
  "Sanitario":       "#00e676",
  "Corporate":       "#e8c96c",
  "Sociale":         "#888",
  "Mercato":         "#26c6da",
  "Immobiliare":     "#ef9a9a",
};

function fmtRemaining(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  if (d > 0) return `${d}g ${h}h`;
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmtTriggeredAt(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("it-IT", { day: "2-digit", month: "short" }) + " " +
           d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
}

function SectorEffectBadge({ sector, effect }) {
  const up = effect.drift > 0;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      background: up ? "rgba(0,230,118,0.12)" : "rgba(255,23,68,0.12)",
      border: `1px solid ${up ? "rgba(0,230,118,0.3)" : "rgba(255,23,68,0.3)"}`,
      color: up ? "#00e676" : "#ff1744",
      fontSize: 10, fontFamily: "Space Mono", padding: "2px 6px", borderRadius: 3,
    }}>
      {up ? "↑" : "↓"} {sector}
    </span>
  );
}

function EventCard({ event, active = false }) {
  const color = CATEGORY_COLOR[event.category] || "#888";
  const pct = active ? (event.remainingSeconds / event.totalDuration) * 100 : 0;

  return (
    <div className="card" style={{ borderLeft: `3px solid ${color}`, marginBottom: 10 }}>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{event.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
              <span style={{ fontFamily: "Space Mono", fontWeight: 700, fontSize: 13, color: "var(--gc)" }}>
                {event.title}
              </span>
              <span style={{
                fontSize: 9, fontFamily: "Space Mono", textTransform: "uppercase",
                background: `${color}22`, border: `1px solid ${color}66`,
                color, padding: "1px 6px", borderRadius: 3, letterSpacing: 1,
              }}>
                {event.category}
              </span>
              {active && (
                <span style={{ fontSize: 10, fontFamily: "Space Mono", color: "#ffc107" }}>
                  ⏱ {fmtRemaining(event.remainingSeconds)} rimanenti
                </span>
              )}
              {!active && event.triggeredAt && (
                <span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "Space Mono" }}>
                  {fmtTriggeredAt(event.triggeredAt)}
                </span>
              )}
            </div>

            <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, marginBottom: 10 }}>
              {event.description}
            </div>

            {/* Sector effects */}
            {event.sectorEffects && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {Object.entries(event.sectorEffects).map(([sector, fx]) => (
                  <SectorEffectBadge key={sector} sector={sector} effect={fx} />
                ))}
              </div>
            )}

            {/* Remaining time bar (only for active events) */}
            {active && (
              <div style={{ marginTop: 10 }}>
                <div style={{ height: 3, background: "var(--bg3)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2, transition: "width 1s linear" }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsTab({ activeEvents, pastEvents }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Active events */}
      <div>
        <div className="card-header" style={{ marginBottom: 10 }}>
          <span className="card-title">
            📡 Eventi in Corso ({activeEvents.length})
          </span>
          {activeEvents.length > 0 && (
            <span style={{ fontSize: 10, fontFamily: "Space Mono", color: "#ffc107", animation: "pulse 1.5s infinite" }}>
              ● ATTIVO
            </span>
          )}
        </div>

        {activeEvents.length === 0 ? (
          <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--text3)" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📰</div>
            <div style={{ fontFamily: "Space Mono", fontSize: 13 }}>Nessun evento in corso</div>
            <div style={{ fontSize: 11, marginTop: 6 }}>I mercati globali sono tranquilli... per ora.</div>
          </div>
        ) : (
          activeEvents.map(ev => <EventCard key={ev.instanceId} event={ev} active={true} />)
        )}
      </div>

      {/* Past events */}
      <div>
        <div className="card-header" style={{ marginBottom: 10 }}>
          <span className="card-title">📋 Storico Notizie ({pastEvents.length})</span>
        </div>

        {pastEvents.length === 0 ? (
          <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--text3)" }}>
            <div style={{ fontSize: 11, fontFamily: "Space Mono" }}>Nessun evento registrato</div>
          </div>
        ) : (
          pastEvents.map(ev => <EventCard key={ev.instanceId} event={ev} active={false} />)
        )}
      </div>
    </div>
  );
}
