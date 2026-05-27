export const WIKI_ARTICLES = [
  {
    id: "azioni", icon: "📈", title: "Azioni",
    tag: "Base", color: "#00e676",
    summary: "Quote di proprietà di una società quotata in Borsa.",
    sections: [
      { h: "Cosa sono", body: "Un'azione rappresenta una quota di proprietà di una società. Chi la possiede (azionista) partecipa agli utili tramite dividendi e al valore dell'azienda tramite il prezzo di mercato." },
      { h: "Come si forma il prezzo", body: "Il prezzo varia continuamente per effetto di domanda e offerta. I principali driver sono: risultati trimestrali (utili/perdite), guidance futura del management, rating degli analisti, dati macro (PIL, inflazione, tassi), sentiment del mercato e flussi istituzionali." },
      { h: "Dividendi", body: "Molte società distribuiscono una parte degli utili agli azionisti. Il Dividend Yield è il rapporto dividendo annuo / prezzo corrente. Un yield alto (>5%) può indicare un titolo difensivo e redditizio, ma anche un'azienda in difficoltà con prezzo depresso." },
      { h: "Indicatori fondamentali", list: ["P/E (Price/Earnings): capitalizzazione / utile netto. Alto P/E = crescita attesa alta oppure sopravvalutazione", "P/B (Price/Book): prezzo / patrimonio netto per azione. Sotto 1 = potenziale sottovalutazione", "EV/EBITDA: misura il valore operativo al netto della struttura finanziaria", "Beta: sensibilità al mercato. Beta 1.5 = se l'indice sale del 2%, il titolo tende a salire del 3%", "Dividend Yield: rendimento cedolare annuo", "Payout Ratio: % degli utili distribuiti come dividendo"] },
      { h: "Segmenti Borsa Italiana", list: ["FTSE MIB: 40 titoli a maggiore capitalizzazione (ENI, Enel, UniCredit…)", "FTSE Italia Mid Cap: medie imprese (200–1.500 M€ di cap)", "FTSE Italia STAR: PMI con elevati standard di governance e liquidità", "AIM/Euronext Growth: mercato crescita per PMI innovative"] },
      { h: "Rischi principali", list: ["Rischio di mercato: il prezzo può scendere anche a zero (fallimento)", "Rischio di liquidità: titoli small-cap difficili da vendere rapidamente", "Rischio specifico: profit warning, scandali, cambi di management", "Rischio settoriale: crollo del petrolio colpisce tutti i titoli energetici"] },
    ]
  },
  {
    id: "etf", icon: "📊", title: "ETF ed ETC",
    tag: "Base", color: "#29b6f6",
    summary: "Fondi indicizzati negoziabili in tempo reale come azioni.",
    sections: [
      { h: "Cosa sono gli ETF", body: "Exchange Traded Fund: fondo che replica un indice (FTSE MIB, S&P 500, MSCI World…) acquistando tutti i titoli che lo compongono. Si compra e vende in Borsa esattamente come un'azione, con prezzi in tempo reale." },
      { h: "Cosa sono gli ETC", body: "Exchange Traded Commodity: simili agli ETF ma replicano materie prime (oro, argento, petrolio). Possono detenere fisicamente il bene (es. oro in cassaforte) oppure usare contratti derivati (replica sintetica)." },
      { h: "Tipologie principali", list: ["Azionari: replicano indici di mercato (Italia, Europa, USA, Globale, Emergenti)", "Obbligazionari: panieri di titoli di stato o corporate bond", "Materie prime (ETC): oro, argento, petrolio, rame, agricoltura", "Tematici: clean energy, robotica, cybersecurity, healthcare, acqua", "Dividendo: selezionano titoli ad alto rendimento cedolare", "Smart Beta: filtrano per fattori (valore, momentum, bassa volatilità)"] },
      { h: "Replica fisica vs sintetica", body: "Fisica: l'ETF acquista realmente i titoli sottostanti → massima trasparenza e sicurezza. Sintetica: usa swap con una banca d'investimento per replicare la performance → aggiunge rischio controparte ma può replicare mercati difficili da accedere." },
      { h: "TER (Total Expense Ratio)", body: "Costo annuo di gestione, dedotto automaticamente dal NAV ogni giorno. Gli ETF hanno TER bassissimi: 0.07%–0.80% contro l'1.5%–2.5% dei fondi attivi. Su un investimento di €10.000 per 10 anni, la differenza di costi può valere migliaia di euro." },
      { h: "Vantaggi vs fondi attivi", list: ["Diversificazione immediata con un solo acquisto", "Costi di gestione molto bassi", "Liquidità intraday (si compra e vende come un'azione)", "Trasparenza: composizione pubblica e aggiornata quotidianamente", "Nessun rischio gestore: un brutto gestore non può sottoperformare l'indice"] },
      { h: "Rischi", list: ["Rischio di mercato: se l'indice scende, l'ETF scende", "Rischio cambio: ETF in USD senza copertura valutaria espone all'EUR/USD", "Rischio controparte: per replica sintetica (limitato da normativa UCITS)", "Tracking error: piccola deviazione dalla performance esatta dell'indice"] },
    ]
  },
  {
    id: "obbligazioni", icon: "🏦", title: "Obbligazioni",
    tag: "Base", color: "#ffd740",
    summary: "Titoli di debito che pagano una cedola periodica e restituiscono il capitale a scadenza.",
    sections: [
      { h: "Meccanismo base", body: "Acquistando un'obbligazione presti denaro all'emittente (Stato o azienda) per un periodo definito. In cambio ricevi cedole periodiche (interessi) e il rimborso del valore nominale (solitamente 100) a scadenza." },
      { h: "Tipologie italiane", list: ["BOT (Buoni Ordinari del Tesoro): 3, 6 o 12 mesi. Zero coupon: rendimento tramite scarto di emissione (compri a 98, rimborso a 100)", "BTP (Buoni del Tesoro Poliennali): tasso fisso, durate da 3 a 50 anni. Cedole semestrali", "BTP Valore: emissioni retail con cedole crescenti nel tempo per premiare chi mantiene fino a scadenza", "CCT/CCTeu: tasso variabile agganciato a Euribor 6M + spread. Proteggono dall'aumento dei tassi", "BTPi (inflation-linked): capitale e cedole rivalutati sull'inflazione europea (HICP). Protezione dall'inflazione", "Corporate bond: emessi da aziende (ENI, Enel, TIM, banche). Rendimento più alto ma rischio di credito"] },
      { h: "Parametri fondamentali", list: ["Cedola: interesse annuo sul valore nominale. Un BTP 3% paga €3 l'anno per ogni €100 nominali (in due rate da €1,50)", "Prezzo: quotato in % del nominale. Sotto 100 = sotto la pari (rendimento > cedola). Sopra 100 = sopra la pari", "YTM (Yield to Maturity): rendimento effettivo annualizzato se detenuto fino a scadenza. Tiene conto di cedole, prezzo pagato e rimborso a 100", "Duration (Macaulay): misura la sensibilità del prezzo ai tassi. Duration 7 = se i tassi salgono dell'1%, il prezzo scende circa del 7%", "Rating: giudizio di solvibilità. AAA/AA = massima qualità; BBB = investment grade (minimo); BB e sotto = high yield (speculativo)"] },
      { h: "Relazione prezzi/tassi", body: "Quando i tassi di mercato salgono, i prezzi delle obbligazioni esistenti scendono (e viceversa). Logica: un BTP vecchio al 2% vale meno di uno nuovo al 4%. Più lunga è la duration, più forte è questo effetto." },
      { h: "Spread BTP-Bund", body: "Differenziale di rendimento tra BTP italiano e Bund tedesco a 10 anni. Misura il rischio-paese: spread a 150bp significa che l'Italia paga 1,50% in più della Germania per finanziarsi. Spread alto → pressione su banche italiane e BTP." },
      { h: "Rischi", list: ["Rischio tasso: se i tassi salgono dopo l'acquisto, il prezzo del bond scende", "Rischio credito (default): l'emittente non rimborsa. Per i BTP rischio basso ma non zero", "Rischio inflazione: una cedola fissa vale meno in termini reali se l'inflazione sale", "Rischio liquidità: alcune emissioni corporate sono difficili da vendere rapidamente"] },
    ]
  },
  {
    id: "futures", icon: "⚙️", title: "Futures",
    tag: "Avanzato", color: "#ff6d00",
    summary: "Contratti standardizzati per comprare/vendere un sottostante a prezzo e data futuri fissati oggi.",
    sections: [
      { h: "Meccanismo", body: "Un future è un accordo vincolante tra due parti: una si impegna a comprare e l'altra a vendere un sottostante (indice, commodity, valuta) a un prezzo prestabilito a una data futura (scadenza). A differenza delle opzioni, entrambe le parti sono obbligate." },
      { h: "FTSE MIB Future (FIB) — parametri", list: ["Sottostante: Indice FTSE MIB", "Moltiplicatore FIB: €5 per punto → 34.000 punti = €170.000 di controvalore", "Moltiplicatore MiniFIB: €1 per punto → €34.000 di controvalore", "MicroFIB: €0,10 per punto → €3.400 di controvalore (per chi inizia)", "Margine iniziale: ~8% del controvalore (es. €13.600 per 1 FIB)", "Scadenze: terzo venerdì di marzo, giugno, settembre, dicembre", "Tick: 5 punti = €25 per FIB, €5 per MiniFIB"] },
      { h: "Leva finanziaria", body: "La leva è il rapporto tra controvalore e margine versato. Con margine 8% la leva è circa 12,5×. Se il mercato sale dell'1% (340 punti), guadagni €1.700 su 1 FIB, avendo versato solo €13.600 come margine → rendimento sul margine = +12,5%. Ma la leva funziona in entrambe le direzioni." },
      { h: "Margin call", body: "Se il future va contro di te e il tuo conto scende sotto il margine di mantenimento, ricevi una margin call: devi versare ulteriore liquidità entro la giornata, altrimenti il broker chiude forzatamente la posizione." },
      { h: "Rollover", body: "I futures scadono ogni trimestre. Per mantenere l'esposizione devi 'rollare': chiudere il contratto in scadenza e aprirne uno sulla scadenza successiva. Il costo del rollover (differenza di prezzo tra le scadenze) riflette i tassi d'interesse e i dividendi attesi." },
      { h: "Utilizzi", list: ["Speculazione: amplificare i movimenti dell'indice con leva", "Hedging: proteggere un portafoglio azionario vendendo futures (se il mercato scende, il future guadagna compensando le perdite)", "Arbitraggio: sfruttare disallineamenti tra future e indice spot"] },
      { h: "Rischi", list: ["Perdita superiore al capitale investito (leva)", "Margin call in caso di movimenti avversi rapidi", "Rischio gap: movimenti overnight non coperti", "Rischio rollover: costo di mantenimento della posizione nel tempo"] },
    ]
  },
  {
    id: "opzioni", icon: "🔀", title: "Opzioni",
    tag: "Avanzato", color: "#e040fb",
    summary: "Contratti che danno il diritto (non l'obbligo) di comprare o vendere a un prezzo stabilito entro una data.",
    sections: [
      { h: "CALL e PUT", body: "CALL: diritto di acquistare il sottostante allo strike price entro la scadenza. Guadagna quando il sottostante sale oltre lo strike + premio pagato. PUT: diritto di vendere il sottostante allo strike price. Guadagna quando il sottostante scende sotto lo strike − premio incassato." },
      { h: "Terminologia essenziale", list: ["Premio: prezzo dell'opzione. È il massimo che può perdere il compratore", "Strike (prezzo di esercizio): prezzo al quale si può esercitare il diritto", "Scadenza: data entro cui esercitare (IDEM: terzo venerdì del mese)", "In-the-money (ITM): l'opzione ha già valore intrinseco", "At-the-money (ATM): strike = prezzo corrente del sottostante", "Out-of-the-money (OTM): nessun valore intrinseco, solo valore temporale"] },
      { h: "Le Greche — come leggere le opzioni", list: ["Delta (Δ): variazione del premio per ogni €1 di movimento del sottostante. CALL: 0→1; PUT: −1→0. Una CALL con delta 0.5 guadagna €0,50 se il titolo sale di €1", "Gamma (Γ): velocità di variazione del delta. Alto gamma = delta cambia rapidamente", "Theta (Θ): decadimento temporale. Ogni giorno che passa, il valore dell'opzione erode (nemico del compratore, amico del venditore)", "Vega (V): sensibilità alla volatilità implicita. Alta volatilità = premi più alti", "Rho (ρ): sensibilità ai tassi d'interesse (effetto minore)"] },
      { h: "Strategie base", list: ["Long CALL: rialzista. Guadagno illimitato, perdita limitata al premio", "Long PUT: ribassista. Usata anche come assicurazione su posizioni long", "Covered CALL: vendi CALL su titolo già in portafoglio → incassi premio e limiti il rialzo", "Protective PUT: compri PUT su titolo in portafoglio → assicuri il portafoglio da crolli", "Straddle: compri CALL + PUT stesso strike → guadagni se il titolo si muove molto in qualunque direzione"] },
      { h: "Rischi", list: ["Perdita totale del premio (opzione scade senza valore)", "Theta decay: il tempo erode il valore ogni giorno", "Volatilità implicita: può comprimersi dopo eventi attesi (earnings, BCE) causando perdite anche se il titolo si muove nella direzione giusta"] },
    ]
  },
  {
    id: "certificates", icon: "📑", title: "Certificati",
    tag: "Avanzato", color: "#ff9e40",
    summary: "Strumenti strutturati emessi da banche che combinano protezione e partecipazione al mercato.",
    sections: [
      { h: "Cosa sono", body: "I certificati (certificates) sono strumenti finanziari derivati emessi da banche d'investimento, quotati sul mercato SeDeX di Borsa Italiana. Combinano obbligazioni e opzioni per offrire profili rischio/rendimento personalizzati." },
      { h: "Tipologie principali", list: ["Turbo Bull/Bear: leva su rialzo (Bull) o ribasso (Bear) di un sottostante, con barriera knockout. Se il sottostante tocca la barriera, il certificato vale zero. Leva variabile (2× fino a 20×)", "Bonus Cap: non partecipa al rialzo oltre il cap, ma protegge dal ribasso se il sottostante non tocca la barriera. Alla scadenza rimborsa almeno il bonus se la barriera non è stata toccata", "Express: rimborso anticipato con cedola bonus se il sottostante supera un livello trigger a date di osservazione periodiche. Se non supera, continua fino alla scadenza", "Phoenix Memory: paga cedole periodiche se il sottostante è sopra una barriera cedola; ha 'memoria' delle cedole non pagate (le recupera). Rimborsa il capitale se non tocca la barriera di protezione", "Tracker (Delta One): replicano linearmente il sottostante, senza scadenza o con scadenza lunga. Simili agli ETF ma emessi da banche"] },
      { h: "Rischio emittente", body: "A differenza degli ETF, i certificati non sono segregati: sono passività della banca emittente. In caso di fallimento della banca, potresti perdere l'intero investimento (come è successo con i certificati Lehman Brothers nel 2008)." },
      { h: "Fiscalità vantaggiosa", body: "I redditi da certificati rientrano nei redditi diversi (plusvalenze), non nei redditi di capitale. Questo significa che le minusvalenze pregresse possono essere compensate — vantaggio fiscale rispetto agli ETF i cui proventi sono redditi di capitale non compensabili." },
      { h: "Quando usarli", list: ["Turbo: speculazione con leva su indici o singoli titoli", "Bonus Cap: mercato laterale o leggermente ribassista, vuoi rendimento con protezione parziale", "Express/Phoenix: mercato laterale, vuoi cedole periodiche con protezione condizionale del capitale"] },
    ]
  },
  {
    id: "analisi_tecnica", icon: "📉", title: "Analisi Tecnica",
    tag: "Strumenti", color: "#80cbc4",
    summary: "Studio di grafici e prezzi storici per identificare tendenze e punti di ingresso/uscita.",
    sections: [
      { h: "Principi fondamentali", list: ["Il mercato sconta tutto: il prezzo riflette già tutte le informazioni disponibili", "I prezzi si muovono in trend: un trend in corso tende a continuare fino a segnale contrario", "La storia si ripete: i pattern si ripresentano perché derivano dalla psicologia umana"] },
      { h: "Trend e struttura di mercato", body: "Uptrend: sequenza di massimi e minimi crescenti. Ogni ritracciamento è un'opportunità di acquisto. Downtrend: massimi e minimi decrescenti. Laterale: oscillazione in un range, attendere la rottura. La struttura si identifica guardando i swing high/low sulle timeframe superiori." },
      { h: "Supporti e Resistenze", body: "Supporto: livello di prezzo dove la domanda è storicamente forte e il prezzo rimbalza al rialzo. Resistenza: livello dove l'offerta è forte e il prezzo viene respinto. Regola chiave: quando un supporto viene rotto con forza, diventa resistenza (e viceversa)." },
      { h: "Medie Mobili", list: ["SMA (Simple Moving Average): media aritmetica degli ultimi N prezzi di chiusura", "EMA (Exponential MA): peso esponenzialmente maggiore ai prezzi recenti. Più reattiva della SMA", "Golden Cross: EMA 50 supera al rialzo EMA 200 → segnale rialzista di lungo periodo", "Death Cross: EMA 50 supera al ribasso EMA 200 → segnale ribassista di lungo periodo", "Uso comune: EMA 20 per trend di breve, EMA 50 per medio, EMA 200 per lungo"] },
      { h: "Indicatori principali", list: ["RSI (Relative Strength Index): oscillatore 0–100. Sopra 70 = ipercomprato (potenziale inversione ribassista); sotto 30 = ipervenduto (potenziale inversione rialzista)", "MACD: differenza tra EMA 12 e EMA 26. Crossover della signal line = segnale operativo. Istogramma mostra la forza della divergenza", "Bande di Bollinger: banda superiore/inferiore a 2 deviazioni standard dalla SMA 20. Prezzo sulla banda superiore = potenziale inversione; bande strette = esplosione di volatilità imminente", "Volume: conferma i movimenti. Un breakout con volumi alti è più affidabile di uno su volumi bassi"] },
      { h: "Pattern candlestick essenziali", list: ["Doji: apertura e chiusura quasi uguali → indecisione del mercato", "Hammer / Hanging Man: corpo piccolo con lunga ombra inferiore → potenziale inversione", "Engulfing bullish: candela verde che ingloba completamente la rossa precedente → forte segnale rialzista", "Evening Star: pattern a 3 candele (verde, doji, rossa) → inversione ribassista after uptrend"] },
    ]
  },
  {
    id: "analisi_fondamentale", icon: "📐", title: "Analisi Fondamentale",
    tag: "Strumenti", color: "#a5d6a7",
    summary: "Valutazione delle aziende tramite bilanci e dati economici per stimare il fair value.",
    sections: [
      { h: "Obiettivo", body: "Determinare il valore intrinseco di un titolo analizzando i dati economici e finanziari dell'azienda. Se il prezzo di mercato è inferiore al valore intrinseco = titolo sottovalutato (opportunità d'acquisto). Se superiore = sopravvalutato (vendita o attesa)." },
      { h: "Multipli di valutazione", list: ["P/E (Price/Earnings): prezzo / utile per azione. P/E 15 = paghi 15 anni di utili. Confrontare sempre con il settore e la media storica", "P/E forward: usa gli utili stimati per l'anno successivo. Più predittivo del P/E trailing", "PEG Ratio: P/E / tasso di crescita atteso degli utili. PEG < 1 = potenzialmente sottovalutato rispetto alla crescita", "P/B (Price/Book): prezzo / patrimonio netto per azione. Sotto 1 = il mercato valuta l'azienda meno del suo patrimonio contabile", "EV/EBITDA: enterprise value / EBITDA. Migliore del P/E perché ignora la struttura del debito e la tassazione", "P/S (Price/Sales): utile per aziende in perdita o crescita rapida (startup, tech)"] },
      { h: "Analisi del conto economico", list: ["Ricavi: prima linea. Crescita dei ricavi = espansione del business", "EBITDA: utile operativo prima di ammortamenti. Proxy del flusso di cassa operativo", "Utile netto: dopo tasse e interessi. Soggetto a manipolazioni contabili", "EPS (Earnings Per Share): utile / azioni in circolazione. Base per il calcolo del P/E"] },
      { h: "Analisi del flusso di cassa", body: "Il free cash flow (FCF = flusso operativo − capex) è considerato la misura più affidabile della salute finanziaria. Un'azienda con utili positivi ma FCF negativo potrebbe avere problemi. Il modello DCF (Discounted Cash Flow) attualizza i FCF futuri per stimare il valore intrinseco." },
      { h: "Solidità patrimoniale", list: ["Debt/Equity: debito finanziario / patrimonio netto. Alto = più rischio, ma dipende dal settore", "Net Debt/EBITDA: anni necessari per ripagare il debito con l'EBITDA. Sopra 3× inizia a essere elevato", "Current Ratio: attivo corrente / passivo corrente. Sotto 1 = possibili problemi di liquidità a breve", "Interest Coverage: EBIT / oneri finanziari. Sotto 2× = rischio di difficoltà nel servire il debito"] },
      { h: "Dividendi", list: ["Dividend Yield: dividendo annuo / prezzo. Misura il rendimento cedolare dell'azione", "Payout Ratio: dividendi / utile netto. Sopra 80–90% potrebbe non essere sostenibile nel tempo", "Dividend Growth Rate: tasso di crescita storico del dividendo. Aziende con 10+ anni di crescita consecutiva = 'dividend aristocrats'"] },
    ]
  },
  {
    id: "macro", icon: "🌍", title: "Macroeconomia",
    tag: "Contesto", color: "#90caf9",
    summary: "Come PIL, inflazione, tassi e politiche delle banche centrali muovono i mercati.",
    sections: [
      { h: "Banca Centrale Europea (BCE)", body: "La BCE fissa i tassi di interesse nell'eurozona per controllare l'inflazione (target: 2%). Tassi alti → credito più caro → meno investimenti e consumi → inflazione scende ma economia rallenta. Tassi bassi → credito economico → stimolo all'economia ma rischio inflazione." },
      { h: "Impatto dei tassi sui mercati", list: ["Obbligazioni: tassi salgono → prezzi bond scendono (relazione inversa)", "Azioni: tassi alti comprimono i multipli (P/E scende) e aumentano il costo del debito aziendale", "Banche: tassi alti migliorano il margine di interesse (beneficio)", "Utilities/Real Estate: tassi alti penalizzano settori ad alto debito e che competono con i bond come fonte di reddito", "Tecnologia: tassi alti penalizzano le aziende growth (i flussi di cassa futuri valgono meno se attualizzati a tassi più alti)"] },
      { h: "Ciclo economico e rotazione settoriale", list: ["Espansione (PIL accelera): cicliche (auto, lusso, industriali), tech", "Picco (inflazione sale, BCE alza tassi): finanziari, energia, materie prime", "Recessione (PIL scende): difensivi (utilities, healthcare, food), oro", "Ripresa (primissimi segnali): cicliche early-cycle (auto, costruzioni), finanziari"] },
      { h: "Dati macro da monitorare", list: ["PIL (Prodotto Interno Lordo): crescita economica. Due trimestri negativi = recessione tecnica", "CPI (Consumer Price Index): inflazione al consumo. Target BCE: 2%", "PMI (Purchasing Managers Index): anticipatore del ciclo. Sopra 50 = espansione; sotto 50 = contrazione", "Tasso di disoccupazione: indicatore lagging (ritarda rispetto al ciclo)", "Fiducia dei consumatori: anticipatore dei consumi", "Spread BTP/Bund: rischio-paese Italia. Monitorarlo sempre se sei investito in BTP o banche italiane"] },
      { h: "Effetti valutari", body: "Euro forte: penalizza gli esportatori (Ferrari, Luxottica, Moncler con molti ricavi in USD/Asia). Euro debole: favorisce gli esportatori ma aumenta il costo delle materie prime importate (petrolio, gas in USD). Importante per valutare ETF non coperti dal rischio cambio." },
    ]
  },
  {
    id: "gestione_rischio", icon: "🛡️", title: "Gestione del Rischio",
    tag: "Strategia", color: "#ef9a9a",
    summary: "Regole e tecniche per proteggere il capitale e sopravvivere ai mercati nel lungo periodo.",
    sections: [
      { h: "Regola n°1: preserva il capitale", body: "Il principio più importante dell'investimento: evitare perdite grandi è più importante di ottenere guadagni grandi. Una perdita del 50% richiede un guadagno del 100% per recuperare il pareggio. Questo asimmetria rende la gestione del rischio prioritaria rispetto alla ricerca di rendimenti." },
      { h: "Position sizing", body: "Quanti soldi allocare a ogni posizione? Regola comune: non più del 5–10% del portafoglio su un singolo titolo. Per strumenti rischiosi (derivati, small-cap): max 2–3%. Questo limita il danno se una posizione va male completamente." },
      { h: "Stop loss — la regola fondamentale", list: ["Imposta sempre uno stop loss prima di aprire una posizione", "Stop comune: −7% / −10% dal prezzo di ingresso per le azioni", "Non spostare mai lo stop verso il basso ('aspetto che risalga')", "Trailing stop: segue il prezzo al rialzo, proteggendo i profitti accumulati", "Stop mentale vs ordine reale: il secondo è obbligatorio. Il primo viene sempre violato dalle emozioni"] },
      { h: "Diversificazione", body: "Non concentrare il portafoglio in pochi titoli o settori. Correlazione: i titoli dello stesso settore tendono a muoversi insieme. Diversificare per settore (banche + utilities + tech + healthcare), per geografia (Italia + Europa + USA), per asset class (azioni + obbligazioni + ETC oro)." },
      { h: "Rapporto rischio/rendimento", body: "Prima di ogni operazione valuta: quanto puoi guadagnare vs quanto puoi perdere? Un'operazione con target +15% e stop a −5% ha un R/R di 3:1. Cerca sempre R/R di almeno 2:1. Con un R/R 2:1 puoi guadagnare anche se hai solo il 40% di operazioni vincenti." },
      { h: "Errori psicologici da evitare", list: ["FOMO (Fear of Missing Out): comprare dopo un grande rialzo solo per paura di perdere il movimento", "Averaging down sui perdenti: aggiungere a posizioni in perdita sperando nel recupero", "Lasciare correre le perdite e chiudere subito i profitti (esatto opposto di quello che si dovrebbe fare)", "Overtrading: operare troppo frequentemente, pagando troppe commissioni e prendendo decisioni emotive", "Ancoraggio: non vendere perché 'aspetto di ritornare al prezzo di carico'"] },
      { h: "Checklist pre-operazione", list: ["Ho uno stop loss definito prima di entrare?", "Il rischio è max 2–5% del portafoglio?", "Il rapporto rischio/rendimento è almeno 2:1?", "Sto operando seguendo un piano o un'emozione?", "Il mercato è aperto e liquido?"] },
    ]
  },
  {
    id: "fiscalita", icon: "💼", title: "Fiscalità degli Investimenti",
    tag: "Pratico", color: "#b0bec5",
    summary: "Come vengono tassati dividendi, plusvalenze e cedole in Italia.",
    sections: [
      { h: "Aliquote principali", list: ["26% (imposta sostitutiva): plusvalenze da azioni, ETF, derivati, certificati, valute; dividendi azionari; interessi su corporate bond", "12,5%: rendimenti da titoli di Stato italiani ed equiparati (BTP, BOT, CCT, BTPi, BTP Valore) e di paesi white-list OCSE"] },
      { h: "Redditi di capitale vs redditi diversi", body: "Differenza cruciale per la compensazione: Redditi di capitale (dividendi, proventi ETF, interessi) NON possono essere compensati con minusvalenze. Redditi diversi (plusvalenze da vendita di azioni, ETF, derivati) SÌ possono essere compensati con minusvalenze pregresse entro 4 anni." },
      { h: "Compensazione minusvalenze", body: "Se vendi un'azione in perdita (es. −€500), questa minusvalenza può essere usata nei 4 anni successivi per ridurre le tasse sulle plusvalenze. ATTENZIONE: i guadagni da ETF sono redditi di capitale, quindi le minusvalenze da ETF non compensano i guadagni da altri ETF. Paradossale ma è la legge italiana." },
      { h: "Regimi fiscali", list: ["Regime dichiarativo: calcoli tu le imposte e le versi nella dichiarazione dei redditi. Più flessibile, permette compensazioni ottimizzate", "Regime amministrato: il broker trattiene automaticamente le imposte su ogni operazione. Semplice ma meno ottimizzabile", "Regime gestito: solo per gestioni patrimoniali. Tassazione sul risultato netto annuale maturato"] },
      { h: "Tasse accessorie", list: ["Imposta di bollo: 0,2% annuo sul controvalore del deposito titoli, calcolato al 31/12 e addebitato a inizio anno", "Tobin Tax (ITT): 0,1% sugli acquisti di azioni di società italiane con capitalizzazione >€500M sui mercati regolamentati; 0,2% fuori mercato", "IVAFE: 0,2% annuo su attività finanziarie detenute all'estero (per i conti esteri)"] },
      { h: "Dichiarazione dei redditi", body: "Nel Quadro RT del Modello Redditi (o nel 730 con Quadro T/W) si dichiarano le plusvalenze. Il sostituto d'imposta (broker in regime amministrato) rilascia la Certificazione delle Ritenute. Conserva tutti i documenti di acquisto per calcolare le plusvalenze." },
    ]
  },
];
