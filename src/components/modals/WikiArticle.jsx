import { WIKI_ARTICLES } from "../../data/wiki.js";

const TAG_COLORS = { "Base":"#00e676","Avanzato":"#ff6d00","Strumenti":"#29b6f6","Strategia":"#ef9a9a","Contesto":"#90caf9","Pratico":"#b0bec5" };

export default function WikiArticle({ articleId, onClose, onNavigate }) {
  const a = WIKI_ARTICLES.find(x => x.id === articleId);
  if (!a) return null;

  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:600,display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",padding:"16px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"var(--bg2)",border:`1px solid ${a.color}44`,borderTop:`3px solid ${a.color}`,borderRadius:6,padding:24,maxWidth:640,width:"100%",marginTop:8,marginBottom:24 }}>
        <div style={{ display:"flex",alignItems:"flex-start",gap:12,marginBottom:20 }}>
          <span style={{ fontSize:30,lineHeight:1 }}>{a.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap" }}>
              <span style={{ fontFamily:"Space Mono",fontSize:16,fontWeight:700,color:a.color }}>{a.title}</span>
              <span style={{ fontFamily:"Space Mono",fontSize:9,padding:"2px 7px",borderRadius:10,background:`${TAG_COLORS[a.tag]}22`,color:TAG_COLORS[a.tag],border:`1px solid ${TAG_COLORS[a.tag]}44` }}>{a.tag}</span>
            </div>
            <div style={{ fontSize:12,color:"#777",marginTop:4 }}>{a.summary}</div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"1px solid var(--border-inline2)",color:"#666",fontSize:12,cursor:"pointer",padding:"4px 10px",borderRadius:3,fontFamily:"Space Mono",flexShrink:0 }}>✕ chiudi</button>
        </div>

        {a.sections.map((s, i) => (
          <div key={i} style={{ marginBottom:18 }}>
            <div style={{ fontFamily:"Space Mono",fontSize:10,fontWeight:700,color:a.color,textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${a.color}22`,paddingBottom:5,marginBottom:8 }}>{s.h}</div>
            {s.body && <p style={{ fontSize:12,color:"#bbb",lineHeight:1.75,marginBottom:4 }}>{s.body}</p>}
            {s.list && (
              <ul style={{ paddingLeft:0,listStyle:"none",display:"flex",flexDirection:"column",gap:5 }}>
                {s.list.map((item, j) => {
                  const colonIdx = item.indexOf(":");
                  const hasBold = colonIdx > 0 && colonIdx < 40;
                  return (
                    <li key={j} style={{ display:"flex",gap:8,fontSize:12,color:"#aaa",lineHeight:1.6 }}>
                      <span style={{ color:a.color,flexShrink:0,marginTop:1 }}>›</span>
                      <span>{hasBold ? <><strong style={{ color:"#ddd" }}>{item.slice(0, colonIdx)}</strong>{item.slice(colonIdx)}</> : item}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}

        <div style={{ borderTop:"1px solid var(--border-inline)",paddingTop:14,marginTop:6 }}>
          <div style={{ fontSize:10,color:"var(--text3)",fontFamily:"Space Mono",marginBottom:8 }}>ALTRI ARTICOLI</div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {WIKI_ARTICLES.filter(x => x.id !== articleId).map(x => (
              <button key={x.id} onClick={() => onNavigate(x.id)}
                style={{ background:"transparent",border:"1px solid var(--border-inline)",color:"#555",padding:"4px 10px",borderRadius:3,cursor:"pointer",fontSize:10,fontFamily:"Space Mono" }}
              >{x.icon} {x.title}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
