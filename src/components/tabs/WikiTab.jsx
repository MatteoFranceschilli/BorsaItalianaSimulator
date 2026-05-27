import { useState } from "react";
import { WIKI_ARTICLES } from "../../data/wiki.js";
import WikiArticle from "../modals/WikiArticle.jsx";

const TAG_COLORS = { "Base": "#00e676", "Avanzato": "#ff6d00", "Strumenti": "#29b6f6", "Strategia": "#ef9a9a", "Contesto": "#90caf9", "Pratico": "#b0bec5" };
const TAG_ORDER = ["Base", "Avanzato", "Strumenti", "Strategia", "Contesto", "Pratico"];

export default function WikiTab() {
  const [wikiSearch, setWikiSearch] = useState("");
  const [wikiOpenId, setWikiOpenId] = useState(null);

  const filtered = WIKI_ARTICLES.filter(a =>
    !wikiSearch ||
    a.title.toLowerCase().includes(wikiSearch.toLowerCase()) ||
    a.summary.toLowerCase().includes(wikiSearch.toLowerCase()) ||
    a.sections.some(s => s.h.toLowerCase().includes(wikiSearch.toLowerCase()) || (s.body || "").toLowerCase().includes(wikiSearch.toLowerCase()))
  );

  const grouped = TAG_ORDER.reduce((acc, tag) => {
    const arts = filtered.filter(a => a.tag === tag);
    if (arts.length) acc[tag] = arts;
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="card">
        <div className="card-header">
          <span className="card-title">📚 Guida agli Strumenti Finanziari</span>
          <span style={{ fontFamily: "Space Mono", fontSize: 10, color: "var(--text3)" }}>{WIKI_ARTICLES.length} articoli</span>
        </div>
        <div style={{ padding: "12px 14px" }}>
          <input
            placeholder="🔍 Cerca argomento..."
            value={wikiSearch}
            onChange={e => setWikiSearch(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
      </div>

      {Object.entries(grouped).map(([tag, arts]) => (
        <div key={tag}>
          <div style={{ fontFamily: "Space Mono", fontSize: 10, color: TAG_COLORS[tag], textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: TAG_COLORS[tag] }} />
            {tag}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
            {arts.map(a => (
              <div
                key={a.id}
                onClick={() => setWikiOpenId(a.id)}
                style={{ background: "var(--bg2)", border: `1px solid ${a.color}33`, borderLeft: `3px solid ${a.color}`, borderRadius: 4, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#111820"; e.currentTarget.style.borderColor = `${a.color}88`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--bg2)"; e.currentTarget.style.borderColor = `${a.color}33`; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>{a.icon}</span>
                  <span style={{ fontFamily: "Space Mono", fontSize: 13, fontWeight: 700, color: a.color }}>{a.title}</span>
                </div>
                <div style={{ fontSize: 11, color: "#777", lineHeight: 1.5, marginBottom: 10 }}>{a.summary}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {a.sections.slice(0, 4).map((s, i) => (
                    <span key={i} style={{ fontSize: 9, fontFamily: "Space Mono", color: "var(--text3)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-inline)", borderRadius: 2, padding: "1px 5px" }}>{s.h}</span>
                  ))}
                  {a.sections.length > 4 && <span style={{ fontSize: 9, color: "var(--text3)" }}>+{a.sections.length - 4} altri</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {wikiOpenId && (
        <WikiArticle
          articleId={wikiOpenId}
          onClose={() => setWikiOpenId(null)}
          onNavigate={id => setWikiOpenId(id)}
        />
      )}
    </div>
  );
}
