export const NPCS = [
  // ── CASSETTISTA ───────────────────────────────────────────────────────────────
  {
    id: "marco",
    name: "Marco Bertini",
    title: "Il Cassettista",
    avatar: "👴",
    description: "Investe in buoni dividendi e non vende mai. La borsa è roba da attendere, non da inseguire.",
    startCash: 2000,
    archetype: "cassettista",
    tradeIntervalHours: 336,   // ~1 trade ogni 2 settimane
  },
  {
    id: "ernesto",
    name: "Ernesto Vitale",
    title: "Il Patriarca",
    avatar: "🏛️",
    description: "Ex bancario. Parcheggia il capitale in blue chip solide e aspetta. Il tempo è il suo alleato.",
    startCash: 3500,
    archetype: "cassettista",
    tradeIntervalHours: 480,   // ~1 trade ogni 3 settimane
  },
  {
    id: "lucia",
    name: "Lucia Fontana",
    title: "La Monastica",
    avatar: "📦",
    description: "Compra azioni solide ogni mese come un orologio svizzero. Non apre quasi mai il portafoglio.",
    startCash: 1800,
    archetype: "cassettista",
    tradeIntervalHours: 240,   // ~1 trade ogni 10 giorni
  },

  // ── MOMENTUM ─────────────────────────────────────────────────────────────────
  {
    id: "sofia",
    name: "Sofia Marchetti",
    title: "La Trend Follower",
    avatar: "📈",
    description: "Segue il momentum. Compra quel che sale, vende quel che scende.",
    startCash: 2000,
    archetype: "momentum",
    tradeIntervalHours: 18,    // circa ogni 18 ore
  },
  {
    id: "daniele",
    name: "Daniele Russo",
    title: "Il Surfista",
    avatar: "🏄",
    description: "Surfa i trend di breve periodo. Entra sul breakout, esce appena il momentum si piega.",
    startCash: 2500,
    archetype: "momentum",
    tradeIntervalHours: 12,    // molto attivo, due volte al giorno
  },
  {
    id: "federica",
    name: "Federica Longo",
    title: "La Breakout Trader",
    avatar: "🚀",
    description: "Caccia i titoli in forte accelerazione. Alta rotazione, sempre sul lato giusto del mercato.",
    startCash: 1500,
    archetype: "momentum",
    tradeIntervalHours: 24,    // una volta al giorno
  },

  // ── CONTRARIAN ───────────────────────────────────────────────────────────────
  {
    id: "giulio",
    name: "Giulio Ferrari",
    title: "Il Contrarian",
    avatar: "🔄",
    description: "Compra i ribassi, vende i rialzi. Scommette sulla mean-reversion.",
    startCash: 2000,
    archetype: "contrarian",
    tradeIntervalHours: 36,    // ogni 1.5 giorni
  },
  {
    id: "matteo",
    name: "Matteo Serra",
    title: "Il Ribelle",
    avatar: "⚡",
    description: "Se tutti vendono, lui compra. Se tutti comprano, lui studia già l'uscita.",
    startCash: 2200,
    archetype: "contrarian",
    tradeIntervalHours: 30,
  },
  {
    id: "cristina",
    name: "Cristina Moretti",
    title: "La Scettica",
    avatar: "🔍",
    description: "Diffidente dei rialzi euforici. Preferisce raccogliere ciò che il panico del mercato butta via.",
    startCash: 3000,
    archetype: "contrarian",
    tradeIntervalHours: 48,    // ogni 2 giorni
  },

  // ── PANIC ────────────────────────────────────────────────────────────────────
  {
    id: "valentina",
    name: "Valentina Rossi",
    title: "La Panicante",
    avatar: "😱",
    description: "Reagisce in modo esagerato alle notizie. Vende nel panico, compra per FOMO.",
    startCash: 2000,
    archetype: "panic",
    tradeIntervalHours: 4,     // molto reattiva
  },
  {
    id: "fabio",
    name: "Fabio Ricci",
    title: "Il Nervoso",
    avatar: "😰",
    description: "Al minimo segno di crollo, liquida tutto. Si ricompra soltanto dopo che il titolo è già risalito.",
    startCash: 1500,
    archetype: "panic",
    tradeIntervalHours: 6,
  },
  {
    id: "anna",
    name: "Anna Gallo",
    title: "La FOMO",
    avatar: "🎢",
    description: "La paura di perdere un'occasione la divora. Compra sempre tardi, vende sempre per paura.",
    startCash: 1800,
    archetype: "panic",
    tradeIntervalHours: 3,     // la più reattiva di tutte
  },

  // ── QUANT ────────────────────────────────────────────────────────────────────
  {
    id: "alessandro",
    name: "Alessandro Mori",
    title: "L'Algoritmo",
    avatar: "🤖",
    description: "Approccio quantitativo puro. Media mobile, mean-reversion, zero emozioni.",
    startCash: 2000,
    archetype: "quant",
    tradeIntervalHours: 5,
  },
  {
    id: "lorenzo",
    name: "Lorenzo Amato",
    title: "Il Matematico",
    avatar: "📐",
    description: "Puro statistico. Opera solo quando il prezzo diverge significativamente dalla media storica.",
    startCash: 4000,
    archetype: "quant",
    tradeIntervalHours: 7,
  },
  {
    id: "silvia",
    name: "Silvia Barbieri",
    title: "La Modellista",
    avatar: "💻",
    description: "Modelli sistematici e disciplina ferrea. Nessuna decisione discrezionale, solo segnali.",
    startCash: 2800,
    archetype: "quant",
    tradeIntervalHours: 4,     // la più sistematica
  },

  // ── NOVICE ───────────────────────────────────────────────────────────────────
  {
    id: "chiara",
    name: "Chiara Bianchi",
    title: "La Principiante",
    avatar: "🌱",
    description: "Nuova al trading. Vende i vincitori troppo presto e tiene i perdenti troppo a lungo.",
    startCash: 2000,
    archetype: "novice",
    tradeIntervalHours: 48,    // ogni 2 giorni
  },
  {
    id: "tommaso",
    name: "Tommaso Esposito",
    title: "Il Millennial",
    avatar: "📱",
    description: "Appassionato di finanza online. Segue consigli sui social e impara a caro prezzo.",
    startCash: 1200,
    archetype: "novice",
    tradeIntervalHours: 36,    // controlla più spesso
  },
  {
    id: "martina",
    name: "Martina Fiore",
    title: "La Studentessa",
    avatar: "🎓",
    description: "Studia economia. La teoria è solida, ma la pratica le gioca continuamente brutti scherzi.",
    startCash: 1000,
    archetype: "novice",
    tradeIntervalHours: 72,    // ogni 3 giorni
  },

  // ── SPECULATOR ───────────────────────────────────────────────────────────────
  {
    id: "roberto",
    name: "Roberto Conti",
    title: "Lo Speculatore",
    avatar: "🎲",
    description: "Alto rischio, alta ricompensa. Punta su titoli volatili e news di mercato.",
    startCash: 2000,
    archetype: "speculator",
    tradeIntervalHours: 10,
  },
  {
    id: "giancarlo",
    name: "Giancarlo Riva",
    title: "Il Giocatore",
    avatar: "🃏",
    description: "Scommette sui titoli più volatili. Ride dei rischi quanto piange delle perdite.",
    startCash: 2500,
    archetype: "speculator",
    tradeIntervalHours: 8,
  },
  {
    id: "paola",
    name: "Paola Monti",
    title: "La Scommettitrice",
    avatar: "🎯",
    description: "Concentra tutto su pochi titoli ad alto beta. Grandi rialzi o grandi crolli, niente di mezzo.",
    startCash: 1800,
    archetype: "speculator",
    tradeIntervalHours: 14,
  },

  // ── DIVIDEND ─────────────────────────────────────────────────────────────────
  {
    id: "elena",
    name: "Elena Greco",
    title: "La Dividendista",
    avatar: "💰",
    description: "Cerca rendite passive. Accumula titoli ad alto dividendo e non vende quasi mai.",
    startCash: 2000,
    archetype: "dividend",
    tradeIntervalHours: 360,   // ogni 15 giorni
  },
  {
    id: "sergio",
    name: "Sergio Palma",
    title: "Il Pensionato",
    avatar: "🌅",
    description: "Ex dirigente in pensione. Vive dei dividendi incassati, non tocca mai il capitale.",
    startCash: 5000,
    archetype: "dividend",
    tradeIntervalHours: 480,   // ogni 20 giorni
  },
  {
    id: "carla",
    name: "Carla Bassi",
    title: "La Rentier",
    avatar: "🏦",
    description: "Reinveste ogni dividendo ricevuto. Il compounding è la sua religione e la sua pazienza.",
    startCash: 3000,
    archetype: "dividend",
    tradeIntervalHours: 240,   // ogni 10 giorni
  },
];

export const NPC_ARCHETYPES = {
  cassettista: { label: "Cassettista",    color: "#29b6f6" },
  momentum:    { label: "Trend Follower", color: "#7c4dff" },
  contrarian:  { label: "Contrarian",     color: "#ff9800" },
  panic:       { label: "Panicante",      color: "#ff1744" },
  quant:       { label: "Algoritmo",      color: "#00e676" },
  novice:      { label: "Principiante",   color: "#ffc107" },
  speculator:  { label: "Speculatore",    color: "#e8c96c" },
  dividend:    { label: "Dividendista",   color: "#ef9a9a" },
};
