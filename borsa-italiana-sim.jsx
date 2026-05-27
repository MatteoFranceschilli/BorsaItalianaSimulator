import { useState, useEffect, useRef, useCallback } from "react";

// ── DATI STRUMENTI FINANZIARI ─────────────────────────────────────────────────
const STOCKS = [
  // ── FTSE MIB (40 titoli principali) ─────────────────────────────────────
  { id: "ENI",     name: "ENI S.p.A.",               sector: "Energia",       price: 14.82,  beta: 0.90, div: 6.2 },
  { id: "ENEL",    name: "Enel S.p.A.",              sector: "Utilities",     price: 6.43,   beta: 0.70, div: 7.1 },
  { id: "ISP",     name: "Intesa Sanpaolo",           sector: "Banche",        price: 3.67,   beta: 1.20, div: 8.4 },
  { id: "UCG",     name: "UniCredit",                sector: "Banche",        price: 37.14,  beta: 1.40, div: 3.8 },
  { id: "STM",     name: "STMicroelectronics",        sector: "Tecnologia",    price: 24.31,  beta: 1.80, div: 0.8 },
  { id: "TIT",     name: "Telecom Italia",            sector: "Telecom",       price: 0.265,  beta: 1.10, div: 0.0 },
  { id: "STLA",    name: "Stellantis N.V.",           sector: "Auto",          price: 16.72,  beta: 1.30, div: 4.2 },
  { id: "RACE",    name: "Ferrari N.V.",              sector: "Auto",          price: 398.50, beta: 0.95, div: 0.9 },
  { id: "EL",      name: "EssilorLuxottica",          sector: "Lusso",         price: 192.30, beta: 0.85, div: 1.8 },
  { id: "PRY",     name: "Prysmian S.p.A.",           sector: "Industriale",   price: 58.90,  beta: 1.10, div: 1.4 },
  { id: "A2A",     name: "A2A S.p.A.",               sector: "Utilities",     price: 2.18,   beta: 0.75, div: 4.9 },
  { id: "AZM",     name: "Azimut Holding",            sector: "Finanza",       price: 23.40,  beta: 1.20, div: 5.6 },
  { id: "BMED",    name: "Banca Mediolanum",          sector: "Banche",        price: 10.85,  beta: 1.00, div: 6.1 },
  { id: "CNH",     name: "CNH Industrial",            sector: "Industriale",   price: 13.67,  beta: 1.25, div: 2.1 },
  { id: "DIA",     name: "DiaSorin S.p.A.",           sector: "Healthcare",    price: 96.40,  beta: 0.80, div: 1.2 },
  { id: "HERA",    name: "Hera S.p.A.",               sector: "Utilities",     price: 3.74,   beta: 0.65, div: 5.3 },
  { id: "IGD",     name: "IGD SIIQ",                  sector: "Real Estate",   price: 3.12,   beta: 0.90, div: 7.8 },
  { id: "INW",     name: "Inwit S.p.A.",              sector: "Telecom",       price: 10.24,  beta: 0.70, div: 3.9 },
  { id: "LDO",     name: "Leonardo S.p.A.",           sector: "Difesa",        price: 28.76,  beta: 1.05, div: 1.6 },
  { id: "MB",      name: "Mediobanca",                sector: "Banche",        price: 15.42,  beta: 1.15, div: 4.3 },
  { id: "MONC",    name: "Moncler S.p.A.",            sector: "Lusso",         price: 58.20,  beta: 1.10, div: 1.7 },
  { id: "NEXI",    name: "Nexi S.p.A.",               sector: "FinTech",       price: 7.83,   beta: 1.35, div: 0.0 },
  { id: "PIRC",    name: "Pirelli & C.",              sector: "Auto",          price: 5.26,   beta: 1.00, div: 5.1 },
  { id: "PST",     name: "Poste Italiane",            sector: "Servizi",       price: 12.95,  beta: 0.60, div: 6.5 },
  { id: "REC",     name: "Recordati S.p.A.",          sector: "Pharma",        price: 47.30,  beta: 0.75, div: 2.8 },
  { id: "SRG",     name: "Snam S.p.A.",               sector: "Energia",       price: 4.89,   beta: 0.55, div: 6.8 },
  { id: "TEN",     name: "Tenaris S.A.",              sector: "Energia",       price: 15.80,  beta: 1.05, div: 3.4 },
  { id: "TRN",     name: "Terna S.p.A.",              sector: "Utilities",     price: 7.34,   beta: 0.50, div: 5.7 },
  { id: "UNI",     name: "UnipolSai Assicurazioni",   sector: "Assicurazioni", price: 2.87,   beta: 0.90, div: 7.2 },
  { id: "WBD",     name: "Webuild S.p.A.",            sector: "Costruzioni",   price: 3.15,   beta: 1.30, div: 2.0 },
  { id: "BMPS",    name: "Banca Monte dei Paschi",    sector: "Banche",        price: 5.74,   beta: 1.50, div: 2.1 },
  { id: "BAMI",    name: "Banco BPM",                 sector: "Banche",        price: 7.42,   beta: 1.30, div: 5.2 },
  { id: "BZU",     name: "Buzzi S.p.A.",              sector: "Cemento",       price: 34.80,  beta: 1.00, div: 2.7 },
  { id: "ACEA",    name: "Acea S.p.A.",               sector: "Utilities",     price: 11.60,  beta: 0.70, div: 5.1 },
  { id: "IIG",     name: "Italgas S.p.A.",            sector: "Utilities",     price: 5.83,   beta: 0.60, div: 5.9 },
  { id: "ERG",     name: "ERG S.p.A.",                sector: "Energia",       price: 24.70,  beta: 0.80, div: 4.3 },
  { id: "ENAV",    name: "ENAV S.p.A.",               sector: "Aerospazio",    price: 4.18,   beta: 0.65, div: 5.4 },
  { id: "CPR",     name: "Campari Group",             sector: "Bevande",       price: 9.87,   beta: 0.85, div: 1.4 },
  { id: "SOL",     name: "SOL S.p.A.",                sector: "Chimico",       price: 18.90,  beta: 0.70, div: 2.4 },
  { id: "UNIPOL",  name: "Unipol Gruppo",             sector: "Assicurazioni", price: 9.48,   beta: 1.05, div: 4.8 },
  // ── FTSE Italia Mid Cap ──────────────────────────────────────────────────
  { id: "IMA",     name: "IMA S.p.A.",                sector: "Industriale",   price: 68.50,  beta: 0.95, div: 1.9 },
  { id: "SFER",    name: "Salvatore Ferragamo",        sector: "Lusso",         price: 12.30,  beta: 1.00, div: 3.6 },
  { id: "TOD",     name: "Tod's S.p.A.",              sector: "Lusso",         price: 41.80,  beta: 0.90, div: 2.2 },
  { id: "BURE",    name: "Brunello Cucinelli",         sector: "Lusso",         price: 87.40,  beta: 0.80, div: 1.1 },
  { id: "MARR",    name: "Marr S.p.A.",               sector: "Food & Bev.",   price: 18.60,  beta: 0.75, div: 3.8 },
  { id: "IGT",     name: "IGT / Lotterie Naz.",       sector: "Gaming",        price: 22.10,  beta: 0.95, div: 3.2 },
  { id: "OVS",     name: "OVS S.p.A.",                sector: "Retail",        price: 2.87,   beta: 1.30, div: 3.5 },
  { id: "FNM",     name: "FNM – Ferrovie Nord Milano", sector: "Trasporti",    price: 1.35,   beta: 0.70, div: 2.9 },
  { id: "SABAF",   name: "Sabaf S.p.A.",              sector: "Industriale",   price: 23.60,  beta: 0.85, div: 3.1 },
  { id: "MASI",    name: "Masi Agricola",             sector: "Food & Bev.",   price: 8.40,   beta: 0.60, div: 2.3 },
  { id: "BRGI",    name: "Brembo S.p.A.",             sector: "Auto",          price: 12.45,  beta: 1.10, div: 2.6 },
  { id: "DNLM",    name: "Datalogic S.p.A.",          sector: "Tecnologia",    price: 11.20,  beta: 1.20, div: 2.8 },
  { id: "CRED",    name: "Credito Emiliano (Credem)", sector: "Banche",        price: 11.80,  beta: 1.00, div: 4.8 },
  { id: "GEL",     name: "Generalfinance S.p.A.",     sector: "Finanza",       price: 6.70,   beta: 1.10, div: 4.2 },
  // ── FTSE Italia STAR ─────────────────────────────────────────────────────
  { id: "REPLY",   name: "Reply S.p.A.",              sector: "IT Consulting", price: 148.30, beta: 1.30, div: 0.6 },
  { id: "WIIT",    name: "WIIT S.p.A.",               sector: "Cloud / IT",    price: 34.50,  beta: 1.40, div: 0.5 },
  { id: "GVS",     name: "GVS S.p.A.",                sector: "Healthcare",    price: 7.12,   beta: 0.90, div: 2.1 },
  { id: "TECH",    name: "Technogym S.p.A.",          sector: "Sport & Fit.",  price: 8.62,   beta: 1.05, div: 2.0 },
  { id: "EXO",     name: "Exprivia S.p.A.",           sector: "Tecnologia",    price: 3.46,   beta: 1.25, div: 0.0 },
  { id: "PRIM",    name: "Prima Industrie",           sector: "Industriale",   price: 29.40,  beta: 1.15, div: 1.8 },
  { id: "LVEN",    name: "LVenture Group",            sector: "VC / PMI",      price: 0.87,   beta: 1.50, div: 0.0 },
  { id: "SESA",    name: "Sesa S.p.A.",               sector: "IT Consulting", price: 134.50, beta: 1.20, div: 1.3 },
];

const ETFS = [
  // ── Azionari Italia / Europa ──────────────────────────────────────────────
  { id: "XMIB",    name: "Xtrackers FTSE MIB UCITS ETF",         price: 29.45,  beta: 1.00,  type: "Az. Italia",    ter: 0.30 },
  { id: "IMIB",    name: "iShares FTSE MIB UCITS ETF",           price: 31.10,  beta: 1.00,  type: "Az. Italia",    ter: 0.35 },
  { id: "EXW1",    name: "iShares Core Euro Stoxx 50 ETF",       price: 51.20,  beta: 0.95,  type: "Az. Europa",    ter: 0.10 },
  { id: "EXSA",    name: "Xtrackers Euro Stoxx 50 EUR Hdg",      price: 48.90,  beta: 0.93,  type: "Az. Europa",    ter: 0.09 },
  { id: "IESE",    name: "iShares MSCI Europe UCITS ETF",        price: 22.60,  beta: 0.90,  type: "Az. Europa",    ter: 0.12 },
  { id: "SMEA",    name: "iShares MSCI Europe Small Cap",        price: 38.40,  beta: 1.05,  type: "Az. Eur. Small", ter: 0.58 },
  // ── Azionari USA / Globale ────────────────────────────────────────────────
  { id: "CSSPX",   name: "iShares Core S&P 500 UCITS ETF",       price: 558.30, beta: 0.85,  type: "Az. USA",       ter: 0.07 },
  { id: "SP500H",  name: "Xtrackers S&P 500 EUR Hdg",            price: 72.80,  beta: 0.85,  type: "Az. USA Hdg",   ter: 0.09 },
  { id: "CNDX",    name: "iShares Nasdaq 100 UCITS ETF",         price: 91.30,  beta: 1.15,  type: "Az. USA Tech",  ter: 0.33 },
  { id: "VWRL",    name: "Vanguard FTSE All-World UCITS ETF",    price: 108.70, beta: 0.90,  type: "Az. Globale",   ter: 0.22 },
  { id: "SWDA",    name: "iShares Core MSCI World UCITS ETF",    price: 97.50,  beta: 0.88,  type: "Az. Globale",   ter: 0.20 },
  { id: "EM",      name: "iShares MSCI Emerging Markets",        price: 33.40,  beta: 1.10,  type: "Az. Emergenti", ter: 0.18 },
  { id: "IIND",    name: "iShares MSCI India UCITS ETF",         price: 43.70,  beta: 1.20,  type: "Az. India",     ter: 0.65 },
  { id: "TOPIX",   name: "iShares Core MSCI Japan IMI",          price: 7.20,   beta: 0.75,  type: "Az. Giappone",  ter: 0.15 },
  { id: "KCHINA",  name: "KraneShares CSI China Internet",       price: 24.80,  beta: 1.30,  type: "Az. Cina",      ter: 0.70 },
  // ── Obbligazionari ───────────────────────────────────────────────────────
  { id: "XBTP",    name: "iShares Euro Govt Bond 7-10yr",        price: 112.30, beta: 0.20,  type: "Obblig. Gov.",  ter: 0.09 },
  { id: "IBTS",    name: "iShares USD Treasury Bond 7-10yr Hdg", price: 97.80,  beta: 0.15,  type: "Obblig. USA",   ter: 0.10 },
  { id: "VGOV",    name: "Vanguard EUR Govt Bond UCITS ETF",     price: 24.60,  beta: 0.18,  type: "Obblig. Gov.",  ter: 0.07 },
  { id: "HYG",     name: "iShares EUR High Yield Corp Bond",     price: 86.40,  beta: 0.45,  type: "Obblig. HY",    ter: 0.50 },
  { id: "IEAC",    name: "iShares Core EUR Corp Bond",           price: 114.20, beta: 0.30,  type: "Obblig. Corp.",  ter: 0.20 },
  { id: "SEMB",    name: "iShares J.P. Morgan EM Bond EUR Hdg",  price: 82.60,  beta: 0.55,  type: "Obblig. EM",    ter: 0.50 },
  // ── Materie Prime (ETC) ───────────────────────────────────────────────────
  { id: "GOLD",    name: "Invesco Physical Gold ETC",            price: 185.60, beta: -0.10, type: "Oro",           ter: 0.12 },
  { id: "IGLN",    name: "iShares Physical Gold ETC",            price: 41.80,  beta: -0.08, type: "Oro",           ter: 0.15 },
  { id: "SILVER",  name: "WisdomTree Physical Silver",           price: 22.30,  beta: 0.20,  type: "Argento",       ter: 0.19 },
  { id: "OIL",     name: "WisdomTree WTI Crude Oil ETC",         price: 5.78,   beta: 0.60,  type: "Petrolio",      ter: 0.49 },
  { id: "AIGA",    name: "WisdomTree Agriculture ETC",           price: 8.90,   beta: 0.30,  type: "Agricoltura",   ter: 0.49 },
  { id: "COPPER",  name: "WisdomTree Copper ETC",                price: 31.40,  beta: 0.70,  type: "Metalli Ind.",  ter: 0.39 },
  // ── Tematici / Settoriali ─────────────────────────────────────────────────
  { id: "RENEW",   name: "iShares Global Clean Energy UCITS",    price: 18.40,  beta: 1.20,  type: "Clean Energy",  ter: 0.65 },
  { id: "ROBO",    name: "ROBO Global Robotics & Automation",    price: 52.70,  beta: 1.35,  type: "Robotica",      ter: 0.80 },
  { id: "CYBE",    name: "L&G Cybersecurity UCITS ETF",          price: 29.10,  beta: 1.25,  type: "Cybersecurity", ter: 0.75 },
  { id: "HEAL",    name: "iShares Healthcare Innovation UCITS",  price: 12.80,  beta: 0.85,  type: "Healthcare",    ter: 0.40 },
  { id: "IFSB",    name: "iShares Global Financials UCITS ETF",  price: 32.50,  beta: 1.15,  type: "Finanziari",    ter: 0.51 },
  { id: "IDVY",    name: "iShares Euro Dividend UCITS ETF",      price: 22.80,  beta: 0.70,  type: "Dividendo",     ter: 0.40 },
  { id: "WATERLX", name: "Lyxor MSCI Water ESG Filtered ETF",    price: 38.40,  beta: 0.85,  type: "Water/ESG",     ter: 0.60 },
  { id: "HSML",    name: "HSBC MSCI World Small Cap ETF",        price: 19.60,  beta: 1.10,  type: "Az. Small Cap", ter: 0.35 },
];

const BONDS = [
  // ── BTP a tasso fisso ────────────────────────────────────────────────────
  { id: "BOT6M",     name: "BOT 6 Mesi",                price: 99.20,  coupon: 0.00,  maturity: "30/11/2025", rating: "BBB",  duration: 0.5 },
  { id: "BOT12M",    name: "BOT 12 Mesi",               price: 98.30,  coupon: 0.00,  maturity: "30/06/2026", rating: "BBB",  duration: 1.0 },
  { id: "BTPV27",    name: "BTP Valore 2027 3.25%",     price: 100.40, coupon: 3.25,  maturity: "02/12/2027", rating: "BBB",  duration: 2.8 },
  { id: "BTP2026",   name: "BTP 01/06/2026 2.50%",      price: 98.40,  coupon: 2.50,  maturity: "01/06/2026", rating: "BBB",  duration: 1.2 },
  { id: "BTP2027",   name: "BTP 15/11/2027 3.00%",      price: 98.10,  coupon: 3.00,  maturity: "15/11/2027", rating: "BBB",  duration: 2.5 },
  { id: "BTP2028",   name: "BTP 01/08/2028 3.45%",      price: 99.20,  coupon: 3.45,  maturity: "01/08/2028", rating: "BBB",  duration: 3.3 },
  { id: "BTP2029",   name: "BTP 15/04/2029 4.20%",      price: 102.80, coupon: 4.20,  maturity: "15/04/2029", rating: "BBB",  duration: 4.1 },
  { id: "BTP2030",   name: "BTP 15/03/2030 3.00%",      price: 96.80,  coupon: 3.00,  maturity: "15/03/2030", rating: "BBB",  duration: 4.8 },
  { id: "BTP2032",   name: "BTP 01/02/2032 1.65%",      price: 89.50,  coupon: 1.65,  maturity: "01/02/2032", rating: "BBB",  duration: 6.5 },
  { id: "BTP2033",   name: "BTP 01/08/2033 4.35%",      price: 103.60, coupon: 4.35,  maturity: "01/08/2033", rating: "BBB",  duration: 7.1 },
  { id: "BTP2035",   name: "BTP 01/03/2035 3.75%",      price: 98.40,  coupon: 3.75,  maturity: "01/03/2035", rating: "BBB",  duration: 8.5 },
  { id: "BTP2037",   name: "BTP 01/11/2037 4.75%",      price: 106.20, coupon: 4.75,  maturity: "01/11/2037", rating: "BBB",  duration: 9.8 },
  { id: "BTP2040",   name: "BTP 01/09/2040 5.00%",      price: 109.20, coupon: 5.00,  maturity: "01/09/2040", rating: "BBB",  duration: 11.2 },
  { id: "BTP2044",   name: "BTP 01/09/2044 4.00%",      price: 96.10,  coupon: 4.00,  maturity: "01/09/2044", rating: "BBB",  duration: 14.3 },
  { id: "BTP2050",   name: "BTP 01/03/2050 2.45%",      price: 74.20,  coupon: 2.45,  maturity: "01/03/2050", rating: "BBB",  duration: 18.4 },
  { id: "BTP2072",   name: "BTP 01/03/2072 2.15%",      price: 57.80,  coupon: 2.15,  maturity: "01/03/2072", rating: "BBB",  duration: 28.6 },
  // ── BTP indicizzati inflazione (BTPi) ─────────────────────────────────────
  { id: "BTPI28",    name: "BTPi 15/05/2028 Linker",    price: 105.60, coupon: 0.40,  maturity: "15/05/2028", rating: "BBB",  duration: 3.2 },
  { id: "BTPI30",    name: "BTPi 15/05/2030 Linker",    price: 103.20, coupon: 0.65,  maturity: "15/05/2030", rating: "BBB",  duration: 4.9 },
  { id: "BTPI36",    name: "BTPi 15/09/2036 Linker",    price: 98.30,  coupon: 0.40,  maturity: "15/09/2036", rating: "BBB",  duration: 9.8 },
  // ── CCT a tasso variabile ──────────────────────────────────────────────────
  { id: "CCT27",     name: "CCT 15/10/2027 Float",      price: 99.10,  coupon: 3.80,  maturity: "15/10/2027", rating: "BBB",  duration: 2.3 },
  { id: "CCT28",     name: "CCT 15/04/2028 Float",      price: 98.80,  coupon: 3.95,  maturity: "15/04/2028", rating: "BBB",  duration: 3.1 },
  { id: "CCT29",     name: "CCT 15/10/2029 Float",      price: 97.60,  coupon: 4.05,  maturity: "15/10/2029", rating: "BBB",  duration: 4.3 },
  // ── Corporate bond ────────────────────────────────────────────────────────
  { id: "ENIBD",     name: "ENI Bond 2029 2.875%",      price: 96.40,  coupon: 2.875, maturity: "13/01/2029", rating: "BBB+", duration: 3.8 },
  { id: "ENELBD",    name: "Enel Green Bond 2028 3.5%", price: 97.80,  coupon: 3.50,  maturity: "24/09/2028", rating: "BBB+", duration: 3.2 },
  { id: "TITBD",     name: "TIM Bond 2027 3.625%",      price: 94.20,  coupon: 3.625, maturity: "25/05/2027", rating: "BB+",  duration: 2.1 },
  { id: "ISPBD",     name: "Intesa SP Tier2 2030 4.75%",price: 102.10, coupon: 4.75,  maturity: "20/06/2030", rating: "BBB",  duration: 4.5 },
  { id: "UCGBD",     name: "UniCredit Sub. 2031 4.875%",price: 99.30,  coupon: 4.875, maturity: "15/02/2031", rating: "BBB-", duration: 5.3 },
  { id: "LDOBD",     name: "Leonardo Bond 2029 3.375%", price: 101.20, coupon: 3.375, maturity: "29/01/2029", rating: "BBB-", duration: 3.6 },
  { id: "CPRGBD",    name: "Campari Bond 2026 2.00%",   price: 98.50,  coupon: 2.00,  maturity: "31/10/2026", rating: "BBB-", duration: 1.6 },
  { id: "SRGBD",     name: "Snam Bond 2030 3.25%",      price: 99.10,  coupon: 3.25,  maturity: "15/07/2030", rating: "BBB+", duration: 4.9 },
];

const DERIVATIVES = [
  // ── Futures su indici (IDEM) ──────────────────────────────────────────────
  { id: "FTSEMIBFUT", name: "FTSE MIB Future (FIB) Giu25",       price: 33850, multiplier: 5,   margin: 0.08, type: "Future",   underlying: "FTSE MIB", expiry: "20/06/2025" },
  { id: "MINIFIB",    name: "MiniFIB Future Giu25",               price: 33850, multiplier: 1,   margin: 0.08, type: "Future",   underlying: "FTSE MIB", expiry: "20/06/2025" },
  { id: "MICROFIB",   name: "MicroFIB Future Giu25",              price: 33850, multiplier: 0.1, margin: 0.08, type: "Future",   underlying: "FTSE MIB", expiry: "20/06/2025" },
  { id: "FIBSET25",   name: "FTSE MIB Future (FIB) Set25",        price: 33720, multiplier: 5,   margin: 0.08, type: "Future",   underlying: "FTSE MIB", expiry: "19/09/2025" },
  { id: "FIBDIC25",   name: "FTSE MIB Future (FIB) Dic25",        price: 33590, multiplier: 5,   margin: 0.08, type: "Future",   underlying: "FTSE MIB", expiry: "19/12/2025" },
  // ── Opzioni su indice (IDEM) ──────────────────────────────────────────────
  { id: "CALLFIB34K", name: "CALL FIB Strike 34000 Giu25",        price: 680,   strike: 34000, underlying: "FTSE MIB", type: "Option", optType: "call", delta: 0.55, expiry: "20/06/2025" },
  { id: "PUTFIB33K",  name: "PUT FIB Strike 33000 Giu25",         price: 540,   strike: 33000, underlying: "FTSE MIB", type: "Option", optType: "put",  delta: -0.48, expiry: "20/06/2025" },
  { id: "CALLFIB35K", name: "CALL FIB Strike 35000 Giu25",        price: 290,   strike: 35000, underlying: "FTSE MIB", type: "Option", optType: "call", delta: 0.30, expiry: "20/06/2025" },
  { id: "PUTFIB32K",  name: "PUT FIB Strike 32000 Giu25",         price: 310,   strike: 32000, underlying: "FTSE MIB", type: "Option", optType: "put",  delta: -0.29, expiry: "20/06/2025" },
  // ── Opzioni su azioni single stock (IDEM) ────────────────────────────────
  { id: "CALLENI15",  name: "CALL ENI Strike 15 Giu25",           price: 0.42,  strike: 15,  underlying: "ENI",  type: "Option", optType: "call", delta: 0.48, expiry: "20/06/2025" },
  { id: "PUTENI14",   name: "PUT ENI Strike 14 Giu25",            price: 0.38,  strike: 14,  underlying: "ENI",  type: "Option", optType: "put",  delta: -0.42, expiry: "20/06/2025" },
  { id: "CALLENI16",  name: "CALL ENI Strike 16 Set25",           price: 0.26,  strike: 16,  underlying: "ENI",  type: "Option", optType: "call", delta: 0.30, expiry: "19/09/2025" },
  { id: "PUTENI13",   name: "PUT ENI Strike 13 Set25",            price: 0.21,  strike: 13,  underlying: "ENI",  type: "Option", optType: "put",  delta: -0.28, expiry: "19/09/2025" },
  { id: "CALLENEL7",  name: "CALL ENEL Strike 7 Giu25",           price: 0.21,  strike: 7,   underlying: "ENEL", type: "Option", optType: "call", delta: 0.45, expiry: "20/06/2025" },
  { id: "PUTENEL6",   name: "PUT ENEL Strike 6 Giu25",            price: 0.19,  strike: 6,   underlying: "ENEL", type: "Option", optType: "put",  delta: -0.38, expiry: "20/06/2025" },
  { id: "CALLISP4",   name: "CALL ISP Strike 4.0 Giu25",          price: 0.09,  strike: 4.0, underlying: "ISP",  type: "Option", optType: "call", delta: 0.32, expiry: "20/06/2025" },
  { id: "PUTISP35",   name: "PUT ISP Strike 3.5 Giu25",           price: 0.11,  strike: 3.5, underlying: "ISP",  type: "Option", optType: "put",  delta: -0.35, expiry: "20/06/2025" },
  { id: "CALLUCG38",  name: "CALL UCG Strike 38 Giu25",           price: 1.85,  strike: 38,  underlying: "UCG",  type: "Option", optType: "call", delta: 0.52, expiry: "20/06/2025" },
  { id: "PUTUCG35",   name: "PUT UCG Strike 35 Giu25",            price: 1.42,  strike: 35,  underlying: "UCG",  type: "Option", optType: "put",  delta: -0.44, expiry: "20/06/2025" },
  { id: "CALLLDO30",  name: "CALL LDO Strike 30 Giu25",           price: 1.10,  strike: 30,  underlying: "LDO",  type: "Option", optType: "call", delta: 0.41, expiry: "20/06/2025" },
  { id: "PUTLDO27",   name: "PUT LDO Strike 27 Giu25",            price: 0.95,  strike: 27,  underlying: "LDO",  type: "Option", optType: "put",  delta: -0.39, expiry: "20/06/2025" },
  { id: "CALLRACE400",name: "CALL RACE Strike 400 Giu25",         price: 8.40,  strike: 400, underlying: "RACE", type: "Option", optType: "call", delta: 0.49, expiry: "20/06/2025" },
  { id: "PUTRACE380", name: "PUT RACE Strike 380 Giu25",          price: 7.20,  strike: 380, underlying: "RACE", type: "Option", optType: "put",  delta: -0.44, expiry: "20/06/2025" },
  // ── Covered Warrant (SeDeX) ───────────────────────────────────────────────
  { id: "CWCALLENI",  name: "CW CALL ENI Strike 15 Dic25",        price: 0.185, strike: 15,  underlying: "ENI",  type: "Warrant", optType: "call", delta: 0.42, expiry: "20/12/2025" },
  { id: "CWPUTENI",   name: "CW PUT ENI Strike 13 Dic25",         price: 0.140, strike: 13,  underlying: "ENI",  type: "Warrant", optType: "put",  delta: -0.36, expiry: "20/12/2025" },
  { id: "CWCALLENEL", name: "CW CALL ENEL Strike 7 Dic25",        price: 0.098, strike: 7,   underlying: "ENEL", type: "Warrant", optType: "call", delta: 0.38, expiry: "20/12/2025" },
  { id: "CWPUTUCG",   name: "CW PUT UCG Strike 34 Dic25",         price: 0.890, strike: 34,  underlying: "UCG",  type: "Warrant", optType: "put",  delta: -0.40, expiry: "20/12/2025" },
  { id: "CWCALLSTM",  name: "CW CALL STM Strike 26 Dic25",        price: 0.620, strike: 26,  underlying: "STM",  type: "Warrant", optType: "call", delta: 0.44, expiry: "20/12/2025" },
  // ── Certificati di investimento ───────────────────────────────────────────
  { id: "CERTBULLRACE", name: "Cert. Turbo BULL Ferrari ×5",      price: 8.25,  underlying: "RACE", leverage: 5,   barrier: 310.0, type: "Certificato", optType: "bull" },
  { id: "CERTBEARSTM",  name: "Cert. Turbo BEAR STM ×3",          price: 3.40,  underlying: "STM",  leverage: 3,   barrier: 28.0,  type: "Certificato", optType: "bear" },
  { id: "CERTBONUSENI", name: "Cert. Bonus Cap ENI – bar.12",     price: 13.80, underlying: "ENI",  bonus: 15.0,   barrier: 12.0,  type: "Certificato", optType: "bonus" },
  { id: "CERTEXPRESSISP",name: "Cert. Express ISP – bar.3.0",     price: 100.40,underlying: "ISP",  barrier: 3.0,  coupon: 6.5,    type: "Certificato", optType: "express" },
  { id: "CERTPHOENIXUCG",name: "Cert. Phoenix Memory UCG",        price: 98.20, underlying: "UCG",  barrier: 28.0, coupon: 8.0,    type: "Certificato", optType: "phoenix" },
  { id: "CERTBULLENI",   name: "Cert. Turbo BULL ENI ×4",         price: 3.12,  underlying: "ENI",  leverage: 4,   barrier: 12.0,  type: "Certificato", optType: "bull" },
];

const INDICES = [
  { id: "FTSEMIB_I", name: "FTSE MIB", value: 33852.4 },
  { id: "FTSEITA", name: "FTSE Italia All-Share", value: 36124.8 },
  { id: "FTSEMID", name: "FTSE Italia Mid Cap", value: 45213.6 },
  { id: "FTSESTAR", name: "FTSE Italia STAR", value: 52847.3 },
];

const FONDI = [
  { id:"ANIMA",    name:"Anima Azionario Italia A",       price:7.42,  beta:0.92, category:"Fondo", subtype:"Azionario Italia",   ter:1.80 },
  { id:"EURIZON",  name:"Eurizon Azioni PMI Italia",      price:22.80, beta:0.85, category:"Fondo", subtype:"Azionario Italia",   ter:1.95 },
  { id:"MEDIOL",   name:"Mediolanum Flessibile Italia",   price:14.50, beta:0.70, category:"Fondo", subtype:"Bilanciato",          ter:2.10 },
  { id:"ARCA",     name:"Arca Obbligazionario Europa",    price:11.20, beta:0.15, category:"Fondo", subtype:"Obbligazionario",     ter:0.90 },
  { id:"KAIROS",   name:"Kairos International Sicav",     price:108.40,beta:0.60, category:"Fondo", subtype:"Long/Short Equity",   ter:2.50 },
  { id:"ALGEBRIS", name:"Algebris Financial Credit",      price:95.30, beta:0.35, category:"Fondo", subtype:"Obbligazionario HY",  ter:1.20 },
  { id:"BANKERS",  name:"Bankers European Growth A",      price:31.60, beta:1.05, category:"Fondo", subtype:"Azionario Europa",    ter:1.70 },
  { id:"PIMCOGI",  name:"PIMCO GIS Income Fund",          price:10.85, beta:0.30, category:"Fondo", subtype:"Obbligazionario",     ter:1.05 },
  { id:"MSCIW",    name:"Morgan Stanley Global Brands A", price:47.20, beta:0.75, category:"Fondo", subtype:"Azionario Globale",   ter:1.60 },
  { id:"FINECO",   name:"Fideuram Rendimento Globale",    price:8.95,  beta:0.50, category:"Fondo", subtype:"Bilanciato",          ter:1.85 },
];

const ALL_INSTRUMENTS = [
  ...STOCKS.map(s => ({ ...s, category: "Azioni" })),
  ...ETFS.map(e => ({ ...e, category: "ETF/ETC" })),
  ...BONDS.map(b => ({ ...b, category: "Obbligazioni" })),
  ...DERIVATIVES.map(d => ({ ...d, category: "Derivati" })),
  ...FONDI,
];

// ── DESCRIZIONI OPERAZIONI ───────────────────────────────────────────────────
const OP_DESCRIPTIONS = {
  "market-buy": {
    icon: "⚡", label: "Acquisto a Mercato",
    color: "#00e676", riskLevel: 1,
    short: "Eseguito subito al miglior prezzo disponibile (ask).",
    when: "Vuoi entrare immediatamente — notizia positiva, breakout tecnico, conferma segnale.",
    pro: ["Esecuzione garantita", "Nessuna attesa", "Semplicità massima"],
    con: ["Prezzo non controllato (slippage)", "Spread bid/ask a tuo sfavore", "Sconsigliato su titoli illiquidi"],
    example: "ENI quota €14.82. Invii market buy 100 azioni → eseguito a €14.83 (spread). Paghi €1.483 + €1,48 commissione.",
    note: null,
  },
  "market-sell": {
    icon: "⚡", label: "Vendita a Mercato",
    color: "#ff1744", riskLevel: 1,
    short: "Eseguita subito al miglior prezzo disponibile (bid).",
    when: "Uscita rapida dalla posizione — stop manuale, notizia negativa, necessità liquidità.",
    pro: ["Esecuzione garantita", "Uscita immediata", "Nessun ordine in pending"],
    con: ["Prezzo bid = peggiore del last price", "In crolli: slippage elevato", "Gap overnight non coperti"],
    example: "Hai ENI a €14.82. Invii market sell 100 → eseguito a €14.81 (bid). Ricevi €1.481 − €1,48 commissione.",
    note: null,
  },
  "limit-buy": {
    icon: "🎯", label: "Ordine Limite — Acquisto",
    color: "#29b6f6", riskLevel: 0,
    short: "Compra solo se il prezzo scende al livello da te impostato (o sotto).",
    when: "Vuoi comprare in pullback, attendere un supporto tecnico, o ottenere un prezzo di ingresso migliore dell'attuale.",
    pro: ["Controllo totale del prezzo di acquisto", "Puoi impostarlo e dimenticartelo", "Nessuno slippage al ribasso"],
    con: ["Potrebbe non venire mai eseguito", "Il prezzo potrebbe non tornare mai al limite", "Perdi il rialzo se il titolo sale subito"],
    example: "ENI quota €14.82. Imposti buy limit a €14.50. Se ENI scende a €14.50 → ordine eseguito. Se non scende → nessun acquisto.",
    note: null,
  },
  "limit-sell": {
    icon: "🎯", label: "Ordine Limite — Vendita (Take Profit)",
    color: "#ffd740", riskLevel: 0,
    short: "Vende solo se il prezzo sale al livello da te impostato (o sopra). Funziona come take profit automatico.",
    when: "Hai una posizione in guadagno e vuoi bloccare il profitto a un prezzo target senza monitorare continuamente.",
    pro: ["Blocca automaticamente i profitti", "Attivo anche quando sei offline", "Nessuno slippage al rialzo"],
    con: ["Il prezzo potrebbe non raggiungere il target", "Potresti vendere troppo presto se il titolo continua a salire", "Richiede disciplina nel rispettare il target"],
    example: "Hai comprato ENI a €14.00, ora quota €14.82. Imposti sell limit a €15.50 → ordine eseguito solo se ENI raggiunge €15.50.",
    note: null,
  },
  "stop-sell": {
    icon: "🛡️", label: "Stop Loss",
    color: "#ff6d00", riskLevel: 0,
    short: "Vende automaticamente quando il prezzo scende sotto la soglia impostata. Protezione fondamentale del capitale.",
    when: "Sempre, su ogni posizione aperta. Lo stop loss è la prima cosa da impostare dopo un acquisto.",
    pro: ["Limita automaticamente le perdite", "Elimina l'emozione dalla decisione di uscita", "Protegge il capitale anche di notte o offline"],
    con: ["In crolli rapidi: eseguito a prezzo peggiore dello stop (slippage)", "Gap overnight possono saltare lo stop", "Stop troppo vicino: triggerato dalla volatilità normale"],
    example: "Compri ENI a €14.82, imposti stop a €13.80 (−7%). Se ENI scende a €13.80 → vendita automatica. Perdita massima controllata.",
    note: "⚠️ Regola pratica: stop all'−5/8/10% dal prezzo di acquisto in base al tuo profilo di rischio. Mai spostare lo stop verso il basso.",
  },
};

// ── WIKI ─────────────────────────────────────────────────────────────────────
const WIKI_ARTICLES = [
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

// ── UTILS ─────────────────────────────────────────────────────────────────────
const fmt = (n, dec = 2) => n?.toLocaleString("it-IT", { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtEur = (n) => "€" + fmt(Math.abs(n));
const fmtPct = (n) => (n >= 0 ? "+" : "") + fmt(n) + "%";
const clr = (n) => n >= 0 ? "#00e676" : "#ff1744";
const clrCls = (n) => n >= 0 ? "pos" : "neg";

function gaussRand() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function generatePriceChange(instrument, marketSentiment, deltaTime) {
  const beta = instrument.beta || 1.0;
  const annualVol = instrument.category === "Obbligazioni" ? 0.03
    : instrument.category === "ETF/ETC" ? 0.12
    : instrument.category === "Derivati" ? 0.4
    : 0.22;
  const dtYears = deltaTime / (365 * 24 * 3600);
  const drift = (0.06 * beta - 0.5 * annualVol * annualVol) * dtYears;
  const shock = annualVol * Math.sqrt(dtYears) * gaussRand();
  const marketEffect = marketSentiment * 0.002 * beta;
  return Math.exp(drift + shock + marketEffect) - 1;
}

// ── COMPONENT ────────────────────────────────────────────────────────────────
export default function BorsaItaliana() {
  const [tab, setTab] = useState("dashboard");
  const [subTab, setSubTab] = useState("Azioni");

  // Prezzi live
  const [prices, setPrices] = useState(() => {
    const p = {};
    ALL_INSTRUMENTS.forEach(i => { p[i.id] = { current: i.price, prev: i.price, open: i.price, high: i.price, low: i.price, pctChange: 0 }; });
    INDICES.forEach(i => { p[i.id] = { current: i.value, prev: i.value, open: i.value, high: i.value, low: i.value, pctChange: 0 }; });
    return p;
  });

  // Portfolio
  const [cash, setCash] = useState(1000);
  const [portfolio, setPortfolio] = useState({});
  const [trades, setTrades] = useState([]);
  const [orders, setOrders] = useState([]);

  // Sim settings
  const [speed, setSpeed] = useState(24);
  const [running, setRunning] = useState(true);
  const [simTime, setSimTime] = useState(new Date("2025-01-02T09:00:00"));
  const [marketSentiment, setMarketSentiment] = useState(0);
  const [marketStatus, setMarketStatus] = useState("APERTO");

  // Chart data
  const [priceHistory, setPriceHistory] = useState(() => {
    const h = {};
    ALL_INSTRUMENTS.forEach(i => { h[i.id] = [{ t: 0, v: i.price }]; });
    INDICES.forEach(i => { h[i.id] = [{ t: 0, v: i.value }]; });
    return h;
  });
  const [indexHistory, setIndexHistory] = useState(() =>
    INDICES.map(i => ({ id: i.id, history: [{ t: 0, v: i.value }] }))
  );

  // Order form
  const [selectedInstr, setSelectedInstr] = useState(null);
  const [orderType, setOrderType] = useState("market");
  const [orderSide, setOrderSide] = useState("buy");
  const [orderQty, setOrderQty] = useState(1);
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [orderMsg, setOrderMsg] = useState("");
  const [showOpDesc, setShowOpDesc] = useState(false);
  const [wikiOpenId, setWikiOpenId] = useState(null);
  const [wikiSearch, setWikiSearch] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [theme, setTheme] = useState("dark");

  // ── SCHERMATA INIZIALE & SALVATAGGIO ─────────────────────────────────────
  const [screen, setScreen]         = useState("start");   // "start"|"newGame"|"loadGame"|"playing"
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput]   = useState("");
  const [saveId, setSaveId]         = useState(null);
  const saveIdRef                   = useRef(null);   // ref per evitare closure stale
  const [savedGames, setSavedGames] = useState([]);
  const [saveMsg, setSaveMsg]       = useState("");
  const [loadingGames, setLoadingGames] = useState(false);

  const STORAGE_KEY = "borsa_all_saves";

  // Fallback in-memory se window.storage non è disponibile
  const memoryStorageRef = useRef({});
  const storageAvailableRef = useRef(null); // null=non testato, true/false

  const storageGet = async (key) => {
    if (storageAvailableRef.current === false) {
      const v = memoryStorageRef.current[key];
      return v ? { value: v } : null;
    }
    try {
      const r = await window.storage.get(key, false);
      storageAvailableRef.current = true;
      return r;
    } catch (_) {
      const v = memoryStorageRef.current[key];
      return v ? { value: v } : null;
    }
  };

  const storageSet = async (key, value) => {
    if (storageAvailableRef.current === false) {
      memoryStorageRef.current[key] = value;
      return true;
    }
    try {
      const r = await window.storage.set(key, value, false);
      if (!r) throw new Error("null");
      storageAvailableRef.current = true;
      return true;
    } catch (_) {
      // fallback in-memory
      storageAvailableRef.current = false;
      memoryStorageRef.current[key] = value;
      return true;
    }
  };

  const updateSaveId = (id) => { saveIdRef.current = id; setSaveId(id); };

  const saveGame = useCallback(async (explicitState) => {
    try {
      const id = saveIdRef.current || ("g" + Date.now());
      if (!saveIdRef.current) { saveIdRef.current = id; setSaveId(id); }

      const portfolioValue = Object.entries(explicitState.portfolio || {})
        .reduce((s, [pid, pos]) => s + (explicitState.prices?.[pid]?.current || 0) * pos.qty, 0);

      const saveEntry = {
        id,
        savedAt:        new Date().toISOString(),
        playerName:     explicitState.playerName || "",
        cash:           Math.round((explicitState.cash || 0) * 100) / 100,
        portfolioValue: Math.round(portfolioValue * 100) / 100,
        simTime:        (explicitState.simTime instanceof Date ? explicitState.simTime : new Date()).toISOString(),
        speed:          explicitState.speed || 24,
        portfolio:      explicitState.portfolio || {},
        orders:         (explicitState.orders || []).slice(0, 20),
        priceAlerts:    (explicitState.priceAlerts || []).slice(0, 20),
        trades:         (explicitState.trades || []).slice(0, 50),
      };

      let allSaves = [];
      try {
        const raw = await storageGet(STORAGE_KEY);
        if (raw && raw.value) allSaves = JSON.parse(raw.value);
      } catch (_) {}

      const updated = [saveEntry, ...allSaves.filter(s => s.id !== id)].slice(0, 10);
      await storageSet(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch(e) {
      console.error("[saveGame]", e?.message || e);
      return String(e?.message || "errore");
    }
  }, []);

  const loadSavedGames = async () => {
    setLoadingGames(true);
    try {
      const raw = await storageGet(STORAGE_KEY);
      if (raw && raw.value) setSavedGames(JSON.parse(raw.value));
      else setSavedGames([]);
    } catch { setSavedGames([]); }
    setLoadingGames(false);
  };

  const loadGame = async (id) => {
    try {
      const raw = await storageGet(STORAGE_KEY);
      if (!raw || !raw.value) return;
      const allSaves = JSON.parse(raw.value);
      const s = allSaves.find(x => x.id === id);
      if (!s) return;
      setRunning(false);
      setPlayerName(s.playerName);
      updateSaveId(id);
      setCash(s.cash);
      setPortfolio(s.portfolio || {});
      setTrades(s.trades || []);
      setOrders(s.orders || []);
      setPriceAlerts(s.priceAlerts || []);
      setSimTime(new Date(s.simTime));
      setSpeed(s.speed || 24);
      tRef.current = 0; lastSaveRef.current = Date.now(); saveIdRef.current = id;
      setScreen("playing");
      setTimeout(() => setRunning(true), 100);
    } catch(e) { console.error("Errore caricamento:", e); }
  };

  const deleteGame = async (id) => {
    try {
      const raw = await storageGet(STORAGE_KEY);
      let allSaves = [];
      if (raw && raw.value) allSaves = JSON.parse(raw.value);
      const updated = allSaves.filter(x => x.id !== id);
      await storageSet(STORAGE_KEY, JSON.stringify(updated));
      setSavedGames(updated);
    } catch(e) { console.error("Errore eliminazione:", e); }
  };

  const [alerts, setAlerts] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [alertInstr, setAlertInstr] = useState("");
  const [alertPrice, setAlertPrice] = useState("");
  const [alertDir, setAlertDir] = useState("above");

  // Screen flicker
  const [tick, setTick] = useState(0);
  const tickerRef = useRef([]);
  const prevPricesRef = useRef({});

  const intervalRef = useRef(null);
  const tRef = useRef(0);
  const lastSaveRef = useRef(Date.now());

  const addAlert = useCallback((msg, type = "info") => {
    const id = Date.now();
    setAlerts(a => [{ id, msg, type, time: new Date().toLocaleTimeString("it-IT") }, ...a.slice(0, 29)]);
    setTimeout(() => setAlerts(a => a.filter(x => x.id !== id)), 8000);
  }, []);

  // Market hours check
  const checkMarketHours = (dt) => {
    const h = dt.getHours(), m = dt.getMinutes(), dow = dt.getDay();
    if (dow === 0 || dow === 6) return "CHIUSO";
    const mins = h * 60 + m;
    if (mins < 9 * 60 || mins >= 17 * 60 + 30) return "CHIUSO";
    if (mins < 9 * 60 + 15) return "PRE-APERTURA";
    return "APERTO";
  };

  // Simulation tick
  useEffect(() => {
    if (!running) return;
    const realInterval = 1000; // 1 sec real = speed seconds sim
    intervalRef.current = setInterval(() => {
      const simSeconds = speed;
      tRef.current += simSeconds;

      setSimTime(prev => {
        const next = new Date(prev.getTime() + simSeconds * 1000);
        const status = checkMarketHours(next);
        setMarketStatus(status);
        return next;
      });

      // Random sentiment drift
      setMarketSentiment(prev => Math.max(-3, Math.min(3, prev + gaussRand() * 0.3)));

      if (marketStatus === "APERTO") {
        const t = tRef.current;

        setPrices(prev => {
          const next = { ...prev };
          prevPricesRef.current = { ...prev };
          ALL_INSTRUMENTS.forEach(instr => {
            const chg = generatePriceChange(instr, marketSentiment, simSeconds);
            const oldP = next[instr.id].current;
            const newP = Math.max(oldP * 0.5, oldP * (1 + chg));
            next[instr.id] = {
              current: newP,
              prev: oldP,
              open: next[instr.id].open,
              high: Math.max(next[instr.id].high, newP),
              low: Math.min(next[instr.id].low, newP),
              pctChange: (newP / next[instr.id].open - 1) * 100,
            };
          });
          INDICES.forEach(idx => {
            const chg = generatePriceChange({ beta: 1.0 }, marketSentiment, simSeconds);
            const oldV = next[idx.id].current;
            const newV = oldV * (1 + chg);
            next[idx.id] = {
              current: newV,
              prev: oldV,
              open: next[idx.id].open,
              high: Math.max(next[idx.id].high, newV),
              low: Math.min(next[idx.id].low, newV),
              pctChange: (newV / next[idx.id].open - 1) * 100,
            };
          });
          return next;
        });

        // Price history (sample every 30 sim seconds)
        if (t % 30 === 0) {
          setPriceHistory(prev => {
            const next = { ...prev };
            ALL_INSTRUMENTS.forEach(instr => {
              next[instr.id] = [...(prev[instr.id] || []).slice(-200), { t, v: prices[instr.id]?.current || instr.price }];
            });
            return next;
          });
        }

        // Check limit/stop orders
        setOrders(prevOrders => {
          const remaining = [];
          prevOrders.forEach(ord => {
            const cp = prices[ord.instrId]?.current;
            if (!cp) { remaining.push(ord); return; }
            let triggered = false;
            if (ord.type === "limit" && ord.side === "buy" && cp <= ord.limitPrice) triggered = true;
            if (ord.type === "limit" && ord.side === "sell" && cp >= ord.limitPrice) triggered = true;
            if (ord.type === "stop" && ord.side === "sell" && cp <= ord.stopPrice) triggered = true;
            if (triggered) {
              executeTrade(ord.instrId, ord.side, ord.qty, cp, "limit/stop", addAlert, setCash, setPortfolio, setTrades);
              addAlert(`Ordine eseguito: ${ord.side === "buy" ? "BUY" : "SELL"} ${ord.qty}x ${ord.instrId} @ €${fmt(cp)}`, "success");
            } else {
              remaining.push(ord);
            }
          });
          return remaining;
        });

        // Check price alerts
        setPriceAlerts(prevAlerts => {
          return prevAlerts.filter(a => {
            const cp = prices[a.instrId]?.current;
            if (!cp) return true;
            const triggered = a.dir === "above" ? cp >= a.targetPrice : cp <= a.targetPrice;
            if (triggered) {
              addAlert(`🔔 ALERT: ${a.instrId} ha raggiunto €${fmt(cp)} (target: €${fmt(a.targetPrice)})`, "warning");
              return false;
            }
            return true;
          });
        });

        // Dividendi (ogni giorno simulato con prob)
        if (Math.random() < 0.001 * simSeconds / 3600) {
          setPortfolio(prev => {
            Object.entries(prev).forEach(([id, pos]) => {
              const instr = ALL_INSTRUMENTS.find(i => i.id === id);
              if (instr?.div && instr.div > 0 && pos.qty > 0) {
                const divAmount = pos.qty * prices[id]?.current * (instr.div / 100 / 12);
                setCash(c => c + divAmount);
                addAlert(`💰 Dividendo ricevuto: €${fmt(divAmount)} da ${id}`, "success");
              }
            });
            return prev;
          });
        }

        // Auto-salvataggio ogni 15 minuti reali
        const now = Date.now();
        if (now - lastSaveRef.current >= 15 * 60 * 1000 && screen === "playing" && playerName) {
          lastSaveRef.current = now;
          saveGame({ playerName, cash, portfolio, trades, orders, priceAlerts, simTime, speed, prices, priceHistory });
        }
      }

      setTick(t => t + 1);
    }, realInterval);

    return () => clearInterval(intervalRef.current);
  }, [running, speed, marketStatus, marketSentiment, prices, addAlert, screen, playerName, cash, portfolio, trades, orders, priceAlerts, simTime, saveGame]);

  // Esegui trade
  function executeTrade(instrId, side, qty, price, type, alertFn, setCashFn, setPortFn, setTradesFn) {
    const commission = Math.max(1.5, price * qty * 0.001);
    if (side === "buy") {
      const total = price * qty + commission;
      setCashFn(c => {
        if (c < total) { alertFn?.(`Fondi insufficienti: serve €${fmt(total)}`, "error"); return c; }
        setPortFn(p => {
          const existing = p[instrId] || { qty: 0, avgPrice: 0, totalCost: 0 };
          const newQty = existing.qty + qty;
          const newCost = existing.totalCost + price * qty;
          return { ...p, [instrId]: { qty: newQty, avgPrice: newCost / newQty, totalCost: newCost } };
        });
        setTradesFn(t => [{ id: Date.now(), instrId, side, qty, price, commission, total, time: new Date().toLocaleString("it-IT"), type }, ...t]);
        return c - total;
      });
    } else {
      setCashFn(c => {
        setPortFn(p => {
          const existing = p[instrId];
          if (!existing || existing.qty < qty) {
            alertFn?.(`Quantità insufficiente in portafoglio`, "error");
            return p;
          }
          const revenue = price * qty - commission;
          setCashFn(cc => cc + revenue);
          const newQty = existing.qty - qty;
          const newPort = { ...p };
          if (newQty === 0) delete newPort[instrId];
          else newPort[instrId] = { qty: newQty, avgPrice: existing.avgPrice, totalCost: existing.avgPrice * newQty };
          setTradesFn(t => [{ id: Date.now(), instrId, side, qty, price, commission, total: revenue, time: new Date().toLocaleString("it-IT"), type }, ...t]);
          return newPort;
        });
        return c;
      });
    }
  }

  const handleOrder = () => {
    if (!selectedInstr) { setOrderMsg("Seleziona uno strumento"); return; }
    const p = prices[selectedInstr.id]?.current;
    if (!p) return;
    const qty = parseInt(orderQty);
    if (isNaN(qty) || qty <= 0) { setOrderMsg("Quantità non valida"); return; }

    if (orderType === "market") {
      executeTrade(selectedInstr.id, orderSide, qty, p, "market", addAlert, setCash, setPortfolio, setTrades);
      setOrderMsg(`Ordine market ${orderSide === "buy" ? "BUY" : "SELL"} eseguito @ €${fmt(p)}`);
    } else if (orderType === "limit") {
      const lp = parseFloat(limitPrice);
      if (isNaN(lp)) { setOrderMsg("Prezzo limite non valido"); return; }
      setOrders(o => [...o, { id: Date.now(), instrId: selectedInstr.id, side: orderSide, qty, type: "limit", limitPrice: lp, time: new Date().toLocaleString("it-IT") }]);
      setOrderMsg(`Ordine limite inserito: ${orderSide} ${qty}x ${selectedInstr.id} @ €${fmt(lp)}`);
    } else if (orderType === "stop") {
      const sp = parseFloat(stopPrice);
      if (isNaN(sp)) { setOrderMsg("Prezzo stop non valido"); return; }
      setOrders(o => [...o, { id: Date.now(), instrId: selectedInstr.id, side: orderSide, qty, type: "stop", stopPrice: sp, time: new Date().toLocaleString("it-IT") }]);
      setOrderMsg(`Stop loss inserito: ${qty}x ${selectedInstr.id} trigger @ €${fmt(sp)}`);
    }
  };

  const addPriceAlert = () => {
    if (!alertInstr || !alertPrice) return;
    const p = parseFloat(alertPrice);
    if (isNaN(p)) return;
    setPriceAlerts(a => [...a, { id: Date.now(), instrId: alertInstr, targetPrice: p, dir: alertDir }]);
    addAlert(`Alert impostato: ${alertInstr} ${alertDir === "above" ? "≥" : "≤"} €${fmt(p)}`, "info");
    setAlertInstr(""); setAlertPrice("");
  };

  // Portfolio stats
  const portfolioValue = Object.entries(portfolio).reduce((sum, [id, pos]) => {
    return sum + (prices[id]?.current || 0) * pos.qty;
  }, 0);
  const totalValue = cash + portfolioValue;
  const totalPnl = totalValue - 1000;
  const totalPnlPct = (totalValue / 1000 - 1) * 100;

  // Portfolio positions with PnL
  const positions = Object.entries(portfolio).map(([id, pos]) => {
    const cp = prices[id]?.current || pos.avgPrice;
    const mktVal = cp * pos.qty;
    const pnl = (cp - pos.avgPrice) * pos.qty;
    const pnlPct = (cp / pos.avgPrice - 1) * 100;
    const instr = ALL_INSTRUMENTS.find(i => i.id === id);
    return { id, ...pos, currentPrice: cp, mktVal, pnl, pnlPct, name: instr?.name || id, category: instr?.category };
  });

  // Mini sparkline component
  const Sparkline = ({ id, w = 120, h = 30 }) => {
    const data = priceHistory[id] || [];
    if (data.length < 2) return <svg width={w} height={h}><line x1="0" y1={h / 2} x2={w} y2={h / 2} stroke="#444" strokeWidth="1" /></svg>;
    const vals = data.map(d => d.v);
    const mn = Math.min(...vals), mx = Math.max(...vals);
    const range = mx - mn || 1;
    const pts = data.map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d.v - mn) / range) * h;
      return `${x},${y}`;
    }).join(" ");
    const last = vals[vals.length - 1];
    const first = vals[0];
    const color = last >= first ? "#00e676" : "#ff1744";
    return (
      <svg width={w} height={h} style={{ overflow: "visible" }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" opacity="0.8" />
      </svg>
    );
  };

  // Chart Component
  const PriceChart = ({ id, w = 400, h = 150 }) => {
    const data = priceHistory[id] || [];
    if (data.length < 2) return <div style={{ color: "var(--g5)", textAlign: "center", paddingTop: 60 }}>Dati insufficienti</div>;
    const vals = data.map(d => d.v);
    const mn = Math.min(...vals) * 0.998, mx = Math.max(...vals) * 1.002;
    const range = mx - mn || 1;
    const pad = 40;
    const W = w - pad, H = h - 20;
    const pts = data.map((d, i) => {
      const x = pad + (i / (data.length - 1)) * W;
      const y = H - ((d.v - mn) / range) * H + 10;
      return `${x},${y}`;
    }).join(" ");
    const last = vals[vals.length - 1], first = vals[0];
    const color = last >= first ? "#00e676" : "#ff1744";
    const fillPts = `${pad},${H + 10} ${pts} ${pad + W},${H + 10}`;
    return (
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={fillPts} fill={`url(#g${id})`} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" />
        {[0, 0.25, 0.5, 0.75, 1].map(f => {
          const yv = mn + f * range;
          const y = H - f * H + 10;
          return <g key={f}>
            <line x1={pad} y1={y} x2={pad + W} y2={y} stroke="#2a2a2a" strokeWidth="1" />
            <text x={pad - 2} y={y + 4} fill="#666" fontSize="9" textAnchor="end">€{fmt(yv)}</text>
          </g>;
        })}
      </svg>
    );
  };

  const filteredInstruments = ALL_INSTRUMENTS.filter(i => i.category === subTab);

  const InstrumentRow = ({ instr }) => {
    const p = prices[instr.id];
    if (!p) return null;
    const changed = p.current !== p.prev;
    const up = p.current > p.prev;
    return (
      <tr
        className={`instr-row ${changed ? (up ? "flash-up" : "flash-down") : ""}`}
        onClick={() => setSelectedInstr(instr)}
        style={{ cursor: "pointer", background: selectedInstr?.id === instr.id ? "rgba(0,230,118,0.05)" : "" }}
      >
        <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{instr.id}</td>
        <td style={{ color: "var(--gc)", fontSize: 12 }}>{instr.name}</td>
        <td style={{ color: "var(--ga)", fontSize: 11 }}>{instr.sector || instr.type || instr.category}</td>
        <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: up ? "#00e676" : "#ff1744" }}>
          {instr.category === "Indici" ? fmt(p.current, 1) : `€${fmt(p.current)}`}
        </td>
        <td style={{ textAlign: "right", color: clr(p.pctChange), fontFamily: "monospace", fontSize: 12 }}>{fmtPct(p.pctChange)}</td>
        <td style={{ textAlign: "right", color: "var(--g5)", fontSize: 11, fontFamily: "monospace" }}>
          H: €{fmt(p.high)} / L: €{fmt(p.low)}
        </td>
        <td><Sparkline id={instr.id} w={80} h={24} /></td>
        <td>
          <button className="btn-buy-sm" onClick={e => { e.stopPropagation(); setSelectedInstr(instr); setOrderSide("buy"); setTab("trading"); }}>BUY</button>
          <button className="btn-sell-sm" onClick={e => { e.stopPropagation(); setSelectedInstr(instr); setOrderSide("sell"); setTab("trading"); }}>SELL</button>
        </td>
      </tr>
    );
  };

  // ── MODAL DESCRIZIONE OPERAZIONE ─────────────────────────────────────────
  // ── WIKI ARTICLE MODAL ───────────────────────────────────────────────────
  const WikiArticle = ({ articleId, onClose }) => {
    const a = WIKI_ARTICLES.find(x => x.id === articleId);
    if (!a) return null;
    const tagColors = { "Base":"#00e676","Avanzato":"#ff6d00","Strumenti":"#29b6f6","Strategia":"#ef9a9a","Pratico":"#b0bec5","Contesto":"#90caf9" };
    return (
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:600,display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",padding:"16px"}}>
        <div onClick={e=>e.stopPropagation()} style={{background:"var(--bg2)",border:`1px solid ${a.color}44`,borderTop:`3px solid ${a.color}`,borderRadius:6,padding:24,maxWidth:640,width:"100%",marginTop:8,marginBottom:24}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:20}}>
            <span style={{fontSize:30,lineHeight:1}}>{a.icon}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontFamily:"Space Mono",fontSize:16,fontWeight:700,color:a.color}}>{a.title}</span>
                <span style={{fontFamily:"Space Mono",fontSize:9,padding:"2px 7px",borderRadius:10,background:`${tagColors[a.tag]}22`,color:tagColors[a.tag],border:`1px solid ${tagColors[a.tag]}44`}}>{a.tag}</span>
              </div>
              <div style={{fontSize:12,color:"#777",marginTop:4}}>{a.summary}</div>
            </div>
            <button onClick={onClose} style={{background:"none",border:"1px solid var(--border-inline2)",color:"#666",fontSize:12,cursor:"pointer",padding:"4px 10px",borderRadius:3,fontFamily:"Space Mono",flexShrink:0}}>✕ chiudi</button>
          </div>
          {a.sections.map((s,i)=>(
            <div key={i} style={{marginBottom:18}}>
              <div style={{fontFamily:"Space Mono",fontSize:10,fontWeight:700,color:a.color,textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${a.color}22`,paddingBottom:5,marginBottom:8}}>{s.h}</div>
              {s.body && <p style={{fontSize:12,color:"#bbb",lineHeight:1.75,marginBottom:4}}>{s.body}</p>}
              {s.list && (
                <ul style={{paddingLeft:0,listStyle:"none",display:"flex",flexDirection:"column",gap:5}}>
                  {s.list.map((item,j)=>{
                    const colonIdx = item.indexOf(":");
                    const hasBold = colonIdx > 0 && colonIdx < 40;
                    return (
                      <li key={j} style={{display:"flex",gap:8,fontSize:12,color:"#aaa",lineHeight:1.6}}>
                        <span style={{color:a.color,flexShrink:0,marginTop:1}}>›</span>
                        <span>{hasBold ? <><strong style={{color:"#ddd"}}>{item.slice(0,colonIdx)}</strong>{item.slice(colonIdx)}</> : item}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
          <div style={{borderTop:"1px solid var(--border-inline)",paddingTop:14,marginTop:6}}>
            <div style={{fontSize:10,color:"var(--text3)",fontFamily:"Space Mono",marginBottom:8}}>ALTRI ARTICOLI</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {WIKI_ARTICLES.filter(x=>x.id!==articleId).map(x=>(
                <button key={x.id} onClick={()=>setWikiOpenId(x.id)}
                  style={{background:"transparent",border:"1px solid var(--border-inline)",color:"#555",padding:"4px 10px",borderRadius:3,cursor:"pointer",fontSize:10,fontFamily:"Space Mono"}}
                >{x.icon} {x.title}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const opKey = orderType === "stop" ? "stop-sell" : `${orderType}-${orderSide}`;
  const currentOpDesc = OP_DESCRIPTIONS[opKey];

  const OpDescModal = () => {
    const d = currentOpDesc;
    if (!d || !showOpDesc) return null;
    const RiskDot = ({ filled }) => (
      <span style={{
        display: "inline-block", width: 8, height: 8, borderRadius: "50%", marginRight: 3,
        background: filled ? d.color : "var(--border-inline2)", border: `1px solid ${filled ? d.color : "var(--border-inline2)"}`
      }} />
    );
    return (
      <div
        onClick={() => setShowOpDesc(false)}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{ background: "var(--bg2)", border: `1px solid ${d.color}55`, borderTop: `3px solid ${d.color}`, borderRadius: 6, padding: 24, maxWidth: 500, width: "100%", maxHeight: "85vh", overflowY: "auto" }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>{d.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Space Mono", fontSize: 14, fontWeight: 700, color: d.color }}>{d.label}</div>
              <div style={{ fontSize: 12, color: "var(--g8)", marginTop: 3 }}>{d.short}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "Space Mono" }}>RISCHIO</span>
              {[0, 1, 2].map(i => <RiskDot key={i} filled={i <= d.riskLevel} />)}
            </div>
            <button onClick={() => setShowOpDesc(false)} style={{ background: "none", border: "none", color: "var(--g5)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
          </div>

          {/* Quando usarlo */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>⏱ Quando usarlo</div>
            <div style={{ fontSize: 12, color: "var(--gc)", lineHeight: 1.6, background: "var(--bg-inline2)", borderRadius: 3, padding: "8px 10px" }}>{d.when}</div>
          </div>

          {/* Pro / Contro */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#00e676", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>✓ Vantaggi</div>
              {d.pro.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                  <span style={{ color: "#00e676", flexShrink: 0 }}>+</span>
                  <span style={{ fontSize: 11, color: "var(--ga)", lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#ff1744", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>✗ Svantaggi</div>
              {d.con.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                  <span style={{ color: "#ff1744", flexShrink: 0 }}>−</span>
                  <span style={{ fontSize: 11, color: "var(--ga)", lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Esempio */}
          <div style={{ marginBottom: d.note ? 12 : 0 }}>
            <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>📋 Esempio pratico</div>
            <div style={{ fontSize: 12, color: "var(--gb)", lineHeight: 1.6, background: `${d.color}08`, border: `1px solid ${d.color}22`, borderRadius: 3, padding: "8px 10px", fontFamily: "Space Mono" }}>{d.example}</div>
          </div>

          {/* Nota */}
          {d.note && (
            <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(255,109,0,0.06)", border: "1px solid rgba(255,109,0,0.25)", borderRadius: 3, fontSize: 11, color: "#ff9e40", lineHeight: 1.5 }}>{d.note}</div>
          )}
        </div>
      </div>
    );
  };

  // ── SCHERMATE INIZIALI ────────────────────────────────────────────────────
  const fmtDate = iso => new Date(iso).toLocaleDateString("it-IT", { day:"2-digit", month:"short", year:"numeric" });
  const fmtSaveDate = iso => new Date(iso).toLocaleString("it-IT", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" });

  const baseScreenStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Barlow:wght@300;400;600&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    .theme-dark { --bg:#080b10; --bg2:#0d1117; --bg3:#111820; --border:#1e2730; --border2:#243040; --gold:#e8c96c; --green:#00e676; --red:#ff1744; --text:#e0e6f0; --text2:#8090a0; --text3:#4a5a6a; --accent:#00c8ff; }
    .theme-light { --bg:#f0f2f5; --bg2:#ffffff; --bg3:#e8edf2; --border:#d0d8e4; --border2:#b8c4d0; --gold:#8a6c00; --green:#007a3d; --red:#c4001a; --text:#1a232e; --text2:#3a5060; --text3:#5a6a7a; --accent:#006fa8; }
    body, .app { font-family:'Barlow',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }
    .screen-wrap { display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px; }
    .screen-card { background:var(--bg2); border:1px solid var(--border); border-radius:8px; padding:36px 28px; max-width:440px; width:100%; }
    .s-btn { display:block; width:100%; padding:13px; border-radius:4px; font-family:'Space Mono',monospace; font-size:13px; font-weight:700; cursor:pointer; transition:all 0.2s; margin-bottom:10px; text-align:center; }
    .s-btn-gold { background:linear-gradient(135deg,#e8c96c,#c9a84c); border:none; color:#080b10; }
    .s-btn-ghost { background:transparent; border:1px solid var(--border2); color:var(--text2); }
    .s-btn:disabled { opacity:0.35; cursor:default; }
    .s-btn:not(:disabled):hover { opacity:0.88; transform:translateY(-1px); }
    input.s-input { background:var(--bg3); border:1px solid var(--border2); color:var(--text); padding:12px 14px; border-radius:4px; font-family:'Space Mono',monospace; font-size:15px; outline:none; width:100%; text-align:center; margin-bottom:14px; }
    input.s-input:focus { border-color:#e8c96c; }
    .save-row { background:var(--bg3); border:1px solid var(--border); border-radius:6px; padding:14px; margin-bottom:8px; display:flex; align-items:center; gap:12px; cursor:pointer; transition:border-color 0.2s; }
    .save-row:hover { border-color:#e8c96c; }
  `;

  if (screen === "start") return (
    <div className={`app theme-${theme}`}>
      <style>{baseScreenStyle}</style>
      <div className="screen-wrap">
        <div className="screen-card" style={{ textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:14 }}>🇮🇹</div>
          <div style={{ fontFamily:"Space Mono", fontSize:20, fontWeight:700, color:"var(--gold)", letterSpacing:2, marginBottom:2 }}>BORSA ITALIANA</div>
          <div style={{ fontFamily:"Space Mono", fontSize:10, color:"var(--text3)", letterSpacing:4, marginBottom:32 }}>SIMULATORE</div>
          <button className="s-btn s-btn-gold" onClick={() => setScreen("newGame")}>▶ NUOVA PARTITA</button>
          <button className="s-btn s-btn-ghost" onClick={() => { setScreen("loadGame"); loadSavedGames(); }}>📂 CARICA PARTITA</button>
          <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            style={{ background:"transparent", border:"none", color:"var(--text3)", fontSize:11, fontFamily:"Space Mono", cursor:"pointer", marginTop:10 }}>
            {theme === "dark" ? "☀️ Tema chiaro" : "🌙 Tema scuro"}
          </button>
        </div>
      </div>
    </div>
  );

  if (screen === "newGame") return (
    <div className={`app theme-${theme}`}>
      <style>{baseScreenStyle}</style>
      <div className="screen-wrap">
        <div className="screen-card" style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"Space Mono", fontSize:13, fontWeight:700, color:"var(--gold)", letterSpacing:2, marginBottom:20 }}>▶ NUOVA PARTITA</div>
          <div style={{ fontSize:13, color:"var(--text2)", marginBottom:22, lineHeight:1.7 }}>
            Inizierai con un capitale di <strong style={{ color:"var(--gold)" }}>€1.000</strong>.<br/>Come ti chiami?
          </div>
          <input className="s-input"
            placeholder="Il tuo nome..."
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && nameInput.trim()) {
                setPlayerName(nameInput.trim()); updateSaveId(`save_${Date.now()}`); setRunning(true); setScreen("playing");
              }
            }}
            autoFocus
          />
          <button className="s-btn s-btn-gold" disabled={!nameInput.trim()}
            onClick={() => { setPlayerName(nameInput.trim()); updateSaveId(`save_${Date.now()}`); setRunning(true); setScreen("playing"); }}>
            ▶ INIZIA
          </button>
          <button className="s-btn s-btn-ghost" onClick={() => setScreen("start")}>← Indietro</button>
        </div>
      </div>
    </div>
  );

  if (screen === "loadGame") return (
    <div className={`app theme-${theme}`}>
      <style>{baseScreenStyle}</style>
      <div className="screen-wrap" style={{ alignItems:"flex-start" }}>
        <div className="screen-card" style={{ maxWidth:540, marginTop:20 }}>
          <button className="s-btn s-btn-ghost" style={{ marginBottom:16 }} onClick={() => setScreen("start")}>← Indietro</button>
          <div style={{ fontFamily:"Space Mono", fontSize:13, fontWeight:700, color:"var(--gold)", letterSpacing:2, marginBottom:18 }}>📂 CARICA PARTITA</div>

          {loadingGames && <div style={{ textAlign:"center", color:"var(--text3)", fontFamily:"Space Mono", fontSize:12, padding:24 }}>Caricamento...</div>}

          {!loadingGames && savedGames.length === 0 && (
            <div style={{ textAlign:"center", padding:28 }}>
              <div style={{ fontSize:32, marginBottom:10 }}>📭</div>
              <div style={{ fontFamily:"Space Mono", fontSize:12, color:"var(--text3)" }}>Nessuna partita salvata</div>
            </div>
          )}

          {!loadingGames && savedGames.map(g => {
            const total = g.cash + (g.portfolioValue || 0);
            const pnl = total - 1000;
            return (
              <div key={g.id} className="save-row" onClick={() => loadGame(g.id)}>
                <div style={{ fontSize:26, flexShrink:0 }}>👤</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"Space Mono", fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:6 }}>{g.playerName}</div>
                  <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                    {[
                      ["Capitale", `€${fmt(total)}`, "var(--gold)"],
                      ["P&L", `${pnl>=0?"+":""}€${fmt(Math.abs(pnl))}`, pnl>=0?"var(--green)":"var(--red)"],
                      ["Data gioco", fmtDate(g.simTime), "var(--text2)"],
                      ["Salvata il", fmtSaveDate(g.savedAt), "var(--text3)"],
                    ].map(([label, val, color]) => (
                      <div key={label}>
                        <div style={{ fontSize:9, color:"var(--text3)", fontFamily:"Space Mono", textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>{label}</div>
                        <div style={{ fontFamily:"Space Mono", fontSize:12, fontWeight:700, color }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteGame(g.id); }}
                  style={{ flexShrink:0, background:"transparent", border:"1px solid rgba(196,0,26,0.3)", color:"var(--red)", padding:"4px 8px", borderRadius:3, cursor:"pointer", fontSize:11, fontFamily:"Space Mono" }}>✕</button>
              </div>
            );
          })}

          <button className="s-btn s-btn-ghost" style={{ marginTop:10, borderStyle:"dashed" }} onClick={() => setScreen("newGame")}>+ Nuova partita</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`app theme-${theme}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Barlow+Condensed:wght@300;400;600;700&family=Barlow:wght@300;400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── TEMA SCURO (default) ── */
        .theme-dark {
          --bg:      #080b10;
          --bg2:     #0d1117;
          --bg3:     #111820;
          --border:  #1e2730;
          --border2: #243040;
          --gold:    #e8c96c;
          --gold2:   #c9a84c;
          --green:   #00e676;
          --red:     #ff1744;
          --blue:    #29b6f6;
          --text:    #e0e6f0;
          --text2:   #8090a0;
          --text3:   #4a5a6a;
          --accent:  #00c8ff;
          --hdr-bg:  linear-gradient(180deg,#0a0e14,#0d1117);
          --card-hover: rgba(255,255,255,0.02);
          --flash-up: rgba(0,230,118,0.12);
          --flash-dn: rgba(255,23,68,0.12);
          /* grigi inline */
          --g9: #999; --g8: #888; --g7: #777; --g6: #666;
          --g5: #555; --ga: #aaa; --gb: #bbb; --gc: #ccc;
          --gc2: #ccc; --border-inline: #1e2730; --border-inline2: #2a3a4a;
          --bg-inline: rgba(0,0,0,0.3); --bg-inline2: rgba(255,255,255,0.02);
        }

        /* ── TEMA CHIARO ── */
        .theme-light {
          --bg:      #f0f2f5;
          --bg2:     #ffffff;
          --bg3:     #e8edf2;
          --border:  #d0d8e4;
          --border2: #b8c4d0;
          --gold:    #8a6c00;
          --gold2:   #a07c10;
          --green:   #007a3d;
          --red:     #c4001a;
          --blue:    #0072a8;
          --text:    #1a232e;
          --text2:   #3a5060;
          --text3:   #5a6a7a;
          --accent:  #006fa8;
          --hdr-bg:  linear-gradient(180deg,#1a2535,#1e2d40);
          --card-hover: rgba(0,0,0,0.02);
          --flash-up: rgba(0,122,61,0.10);
          --flash-dn: rgba(196,0,26,0.10);
          /* grigi inline → versioni leggibili su sfondo chiaro */
          --g9: #445566; --g8: #3a5060; --g7: #334455; --g6: #2a3a4a;
          --g5: #223344; --ga: #4a5a6a; --gb: #3a4a5a; --gc: #2a3a4a;
          --gc2: #334455; --border-inline: #c8d4e0; --border-inline2: #b0c0d0;
          --bg-inline: rgba(0,0,0,0.04); --bg-inline2: rgba(0,0,0,0.02);
        }

        body { background: var(--bg); }

        .app {
          font-family: 'Barlow', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          overflow-x: clip;
        }

        /* HEADER */
        .header {
          background: var(--hdr-bg);
          border-bottom: 1px solid var(--border2);
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          height: 58px;
          position: sticky;
          top: 0;
          z-index: 100;
          white-space: nowrap;
        }

        .logo {
          font-family: 'Space Mono', monospace;
          font-size: 17px;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 2px;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .logo span { color: var(--accent); }

        .index-ticker {
          display: flex;
          gap: 18px;
          flex: 1;
          overflow: hidden;
        }

        .idx-chip {
          display: flex;
          gap: 5px;
          align-items: baseline;
          white-space: nowrap;
        }

        .idx-name {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: var(--text2);
        }

        .idx-val {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          color: var(--text);
        }

        .idx-chg {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: auto;
          flex-shrink: 0;
        }

        .market-badge {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 3px;
          letter-spacing: 1px;
        }

        .market-open  { background: rgba(0,230,118,0.15); color: var(--green); border: 1px solid rgba(0,230,118,0.3); }
        .market-closed{ background: rgba(255,23,68,0.15);  color: var(--red);   border: 1px solid rgba(255,23,68,0.3); }
        .market-pre   { background: rgba(255,193,7,0.15);  color: #ffc107;      border: 1px solid rgba(255,193,7,0.3); }

        .sim-time {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: var(--gold);
          flex-shrink: 0;
        }

        .speed-ctrl {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .speed-btn {
          background: var(--bg3);
          border: 1px solid var(--border2);
          color: var(--text2);
          width: 26px;
          height: 26px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .speed-btn:hover { border-color: var(--accent); color: var(--accent); }

        .speed-label {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: var(--accent);
          min-width: 52px;
          text-align: center;
        }

        .play-btn {
          background: var(--bg3);
          border: 1px solid var(--border2);
          color: var(--text);
          padding: 5px 12px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.15s;
        }
        .play-btn:hover { border-color: var(--gold); color: var(--gold); }

        /* PORTFOLIO STRIP */
        .portfolio-strip {
          background: var(--bg2);
          border-bottom: 1px solid var(--border);
          padding: 8px 16px;
          display: flex;
          gap: 24px;
          align-items: center;
          flex-wrap: wrap;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .portfolio-strip::-webkit-scrollbar { display: none; }

        .pf-metric { display: flex; flex-direction: column; gap: 2px; flex-shrink: 0; }
        .pf-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; font-family: 'Space Mono', monospace; }
        .pf-value { font-family: 'Space Mono', monospace; font-size: 15px; font-weight: 700; color: var(--text); }
        .pf-value.pos { color: var(--green); }
        .pf-value.neg { color: var(--red); }
        .pf-value.gold { color: var(--gold); }

        /* TABS */
        .tabs {
          display: flex;
          background: var(--bg2);
          border-bottom: 1px solid var(--border);
          padding: 0;
          gap: 0;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .tabs::-webkit-scrollbar { display: none; }

        .tab {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 13px 18px;
          cursor: pointer;
          color: var(--text3);
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .tab:hover { color: var(--text2); }
        .tab.active { color: var(--gold); border-bottom-color: var(--gold); }

        /* MAIN */
        .main { padding: 20px; }

        /* CARDS */
        .card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 4px;
          overflow: hidden;
        }

        .card-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,0.02);
        }

        .card-title {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* TABLES */
        table { width: 100%; border-collapse: collapse; }
        thead th {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 8px 10px;
          text-align: left;
          border-bottom: 1px solid var(--border);
          background: var(--bg);
          position: sticky;
          top: 0;
        }
        tbody td { padding: 8px 10px; border-bottom: 1px solid rgba(30,39,48,0.5); font-size: 13px; }
        .instr-row:hover { background: rgba(255,255,255,0.02) !important; }

        @keyframes flashUp { 0% { background: var(--flash-up); } 100% { background: transparent; } }
        @keyframes flashDown { 0% { background: var(--flash-dn); } 100% { background: transparent; } }
        .flash-up td { animation: flashUp 0.5s ease-out; }
        .flash-down td { animation: flashDown 0.5s ease-out; }

        /* BUTTONS */
        .btn-buy-sm {
          background: rgba(0,230,118,0.1);
          border: 1px solid rgba(0,230,118,0.3);
          color: var(--green);
          padding: 3px 9px;
          border-radius: 2px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          cursor: pointer;
          margin-right: 4px;
          transition: all 0.15s;
        }
        .btn-buy-sm:hover { background: rgba(0,230,118,0.25); }

        .btn-sell-sm {
          background: rgba(255,23,68,0.1);
          border: 1px solid rgba(255,23,68,0.3);
          color: var(--red);
          padding: 3px 9px;
          border-radius: 2px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-sell-sm:hover { background: rgba(255,23,68,0.25); }

        .btn-primary {
          background: linear-gradient(135deg, #e8c96c, #c9a84c);
          border: none;
          color: #080b10;
          padding: 10px 20px;
          border-radius: 3px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

        .btn-buy {
          background: linear-gradient(135deg, #00e676, #00b248);
          border: none;
          color: #080b10;
          padding: 10px 20px;
          border-radius: 3px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          flex: 1;
        }

        .btn-sell {
          background: linear-gradient(135deg, #ff1744, #b2102f);
          border: none;
          color: #fff;
          padding: 10px 20px;
          border-radius: 3px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          flex: 1;
        }

        .btn-outline {
          background: transparent;
          border: 1px solid var(--border2);
          color: var(--text2);
          padding: 6px 14px;
          border-radius: 3px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
        .btn-outline.active { border-color: var(--gold); color: var(--gold); background: rgba(232,201,108,0.05); }

        /* INPUTS */
        input, select {
          background: var(--bg);
          border: 1px solid var(--border2);
          color: var(--text);
          padding: 8px 12px;
          border-radius: 3px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
        }
        input:focus, select:focus { border-color: var(--accent); }
        select option { background: var(--bg2); }

        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .form-label { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }

        /* GRID */
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .grid-main { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }

        /* ALERTS */
        .alerts-container {
          position: fixed;
          bottom: 16px;
          right: 16px;
          z-index: 999;
          display: flex;
          flex-direction: column-reverse;
          gap: 8px;
          max-width: 320px;
        }

        .alert-toast {
          padding: 10px 14px;
          border-radius: 4px;
          font-family: 'Barlow', sans-serif;
          font-size: 12px;
          border-left: 3px solid;
          animation: slideIn 0.3s ease-out;
          background: var(--bg3);
        }

        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        .alert-info { border-color: var(--accent); color: var(--text); }
        .alert-success { border-color: var(--green); color: var(--green); }
        .alert-warning { border-color: var(--gold); color: var(--gold); }
        .alert-error { border-color: var(--red); color: var(--red); }

        /* SENTIMENT BAR */
        .sentiment-bar {
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--red), #333, var(--green));
          position: relative;
          margin: 4px 0;
        }
        .sentiment-dot {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--gold);
          top: -3px;
          transform: translateX(-50%);
          transition: left 0.5s;
        }

        /* SUBTABS */
        .subtabs {
          display: flex;
          gap: 4px;
          padding: 8px 14px;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
        }

        .sub-chip {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          padding: 3px 10px;
          border-radius: 2px;
          cursor: pointer;
          border: 1px solid var(--border2);
          color: var(--text2);
          transition: all 0.15s;
        }
        .sub-chip.active {
          background: rgba(232,201,108,0.1);
          border-color: var(--gold);
          color: var(--gold);
        }

        /* SCROLLABLE TABLE */
        .table-scroll { overflow-y: auto; max-height: 450px; }

        /* POS/NEG */
        .pos { color: var(--green) !important; }
        .neg { color: var(--red) !important; }

        /* ORDER BOOK SIMULATION */
        .ob-row {
          display: flex;
          justify-content: space-between;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          padding: 2px 8px;
        }

        /* PROGRESS BAR */
        .pbar-wrap { background: var(--bg); border-radius: 2px; height: 4px; overflow: hidden; }
        .pbar { height: 100%; border-radius: 2px; transition: width 0.5s; }

        /* SECTOR SUMMARY */
        .sector-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 8px;
          padding: 12px;
        }

        .sector-card {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 8px 10px;
        }

        .ticker-tape {
          background: var(--bg);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 4px 0;
          overflow: hidden;
          white-space: nowrap;
        }

        .ticker-inner {
          display: inline-flex;
          gap: 40px;
          animation: tickerScroll 60s linear infinite;
        }

        @keyframes tickerScroll {
          from { transform: translateX(100vw); }
          to { transform: translateX(-100%); }
        }

        .ticker-item {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          display: inline-flex;
          gap: 6px;
        }

        @media (max-width: 768px) {
          /* Grids */
          .grid-main { grid-template-columns: 1fr; }
          .grid2     { grid-template-columns: 1fr; }
          .grid3     { grid-template-columns: 1fr 1fr; }

          /* Header mobile: scrollabile */
          .header {
            height: auto;
            flex-wrap: nowrap;
            padding: 7px 10px;
            gap: 8px;
            overflow-x: auto;
            overflow-y: hidden;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .header::-webkit-scrollbar { display: none; }
          .logo { font-size: 13px; }
          .idx-name { font-size: 10px; }
          .idx-val  { font-size: 11px; }
          .idx-chg  { font-size: 10px; }
          .sim-time { font-size: 10px; }
          .speed-label { font-size: 9px; min-width: 36px; }
          .play-btn { font-size: 11px; padding: 3px 8px; }
          .market-badge { font-size: 9px; padding: 2px 6px; }
          .speed-btn { width: 22px; height: 22px; }

          /* Portfolio strip mobile */
          .portfolio-strip { flex-wrap: nowrap; padding: 6px 10px; gap: 14px; }
          .pf-value { font-size: 13px; }
          .pf-label { font-size: 9px; }

          /* Tabs mobile */
          .tab { font-size: 13px; padding: 10px 13px; }

          /* Main padding */
          .main { padding: 10px; }

          /* Tabelle */
          .table-scroll { overflow-x: auto; max-height: 380px; }
          .table-scroll table { min-width: 500px; }
          tbody td { font-size: 12px; padding: 6px 8px; }
          thead th { font-size: 10px; padding: 6px 8px; }

          /* Trading */
          .grid-main > div:first-child { order: 2; }
          .grid-main > div:last-child  { order: 1; }
        }

        @media (max-width: 480px) {
          .grid3 { grid-template-columns: 1fr; }
          .tab   { font-size: 12px; padding: 9px 11px; }
          .ticker-tape { display: none; }
        }

        /* ── TEMA CHIARO: override hardcoded dark colors ── */
        .theme-light body,
        .theme-light { background: var(--bg); color: var(--text); }

        .theme-light .card { background: var(--bg2); border-color: var(--border); }
        .theme-light .card-header { background: rgba(0,0,0,0.03); border-color: var(--border); }
        .theme-light thead th { background: #e8edf2; color: #4a6070; border-color: var(--border); }
        .theme-light tbody td { border-color: var(--border); color: var(--text); }
        .theme-light .instr-row:hover { background: rgba(0,0,0,0.03) !important; }
        .theme-light .table-scroll { border-color: var(--border); }

        .theme-light input,
        .theme-light select {
          background: #fff;
          border-color: var(--border2);
          color: var(--text);
        }
        .theme-light input:focus,
        .theme-light select:focus { border-color: var(--accent); }
        .theme-light select option { background: #fff; color: var(--text); }

        .theme-light .pf-strip,
        .theme-light .portfolio-strip { background: #fff; border-color: var(--border); }
        .theme-light .tabs { background: #fff; border-color: var(--border); }
        .theme-light .tab { color: #6a7a8a; }
        .theme-light .tab.active { color: var(--gold); border-bottom-color: var(--gold); }
        .theme-light .tab:hover { color: var(--text); }
        .theme-light .subtabs { border-color: var(--border); }
        .theme-light .sub-chip { border-color: var(--border2); color: #6a7a8a; }
        .theme-light .sub-chip.active { background: rgba(138,108,0,0.08); border-color: var(--gold); color: var(--gold); }

        .theme-light .header { border-color: var(--border2); box-shadow: 0 1px 8px rgba(0,0,0,0.12); }
        .theme-light .speed-btn { background: #e8edf2; border-color: var(--border2); color: var(--text2); }
        .theme-light .play-btn { background: #e8edf2; border-color: var(--border2); color: var(--text); }
        .theme-light .ticker-tape { background: #e8edf2; border-color: var(--border); }

        .theme-light .btn-outline { border-color: var(--border2); color: var(--text2); }
        .theme-light .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
        .theme-light .btn-outline.active { background: rgba(138,108,0,0.08); border-color: var(--gold); color: var(--gold); }
        .theme-light .btn-buy-sm { background: rgba(0,122,61,0.08); border-color: rgba(0,122,61,0.35); color: var(--green); }
        .theme-light .btn-sell-sm { background: rgba(196,0,26,0.08); border-color: rgba(196,0,26,0.35); color: var(--red); }

        .theme-light .alert-toast { background: #fff; border: 1px solid var(--border2); box-shadow: 0 2px 12px rgba(0,0,0,0.1); color: var(--text); }
        .theme-light .alert-success { border-left-color: var(--green) !important; color: var(--green) !important; }
        .theme-light .alert-error   { border-left-color: var(--red) !important;   color: var(--red) !important; }
        .theme-light .alert-warning { border-left-color: #996600 !important;      color: #996600 !important; }
        .theme-light .alert-info    { border-left-color: var(--accent) !important; color: var(--accent) !important; }

        .theme-light .ob-row { color: var(--text); }
        .theme-light .pbar-wrap { background: var(--border); }
        .theme-light .sentiment-bar { opacity: 0.8; }

        /* Modals sul tema chiaro */
        .theme-light [style*="background:\"#0d1117\""],
        .theme-light [style*="background: \"#0d1117\""] { background: #fff !important; }
      `}</style>

      {/* TICKER TAPE */}
      <div className="ticker-tape">
        <div className="ticker-inner">
          {[...STOCKS, ...ETFS].map(i => {
            const p = prices[i.id];
            if (!p) return null;
            return (
              <span key={i.id} className="ticker-item">
                <span style={{ color: "#e8c96c" }}>{i.id}</span>
                <span style={{ color: "var(--gc)" }}>€{fmt(p.current)}</span>
                <span style={{ color: clr(p.pctChange) }}>{fmtPct(p.pctChange)}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* HEADER */}
      <div className="header">
        <div className="logo">
          🇮🇹 <span>BORSA</span>ITALIANA <span style={{ color: "var(--text3)", fontSize: 12 }}>SIM</span>
        </div>
        <div className="index-ticker">
          {INDICES.map(idx => {
            const p = prices[idx.id];
            if (!p) return null;
            return (
              <div className="idx-chip" key={idx.id}>
                <span className="idx-name">{idx.name}</span>
                <span className="idx-val">{fmt(p.current, 1)}</span>
                <span className="idx-chg" style={{ color: clr(p.pctChange) }}>{fmtPct(p.pctChange)}</span>
              </div>
            );
          })}
        </div>
        <div className="header-right">
          <span className="sim-time">
            {simTime.toLocaleDateString("it-IT", { weekday: "short", day: "2-digit", month: "short" })} {simTime.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className={`market-badge ${marketStatus === "APERTO" ? "market-open" : marketStatus === "PRE-APERTURA" ? "market-pre" : "market-closed"}`}>
            {marketStatus}
          </span>
          <div className="speed-ctrl">
            <button className="speed-btn" onClick={() => setSpeed(s => Math.max(1, s / 2))}>−</button>
            <span className="speed-label">×{speed}</span>
            <button className="speed-btn" onClick={() => setSpeed(s => Math.min(3600, s * 2))}>+</button>
          </div>
          <button className="play-btn" onClick={() => setRunning(r => !r)}>
            {running ? "⏸ PAUSA" : "▶ PLAY"}
          </button>
          <button className="play-btn" style={{ color: "#00e676", borderColor: "#00e676" }}
            onClick={async () => {
              setSaveMsg("...");
              const result = await saveGame({ playerName, cash, portfolio, trades, orders, priceAlerts, simTime, speed, prices, priceHistory });
              const inMemory = storageAvailableRef.current === false;
              setSaveMsg(result === true ? (inMemory ? "✓ Salvato (sessione)" : "✓ Salvato") : "✗ " + String(result).slice(0, 18));
              setTimeout(() => setSaveMsg(""), 3500);
            }}>
            {saveMsg || "💾 SALVA"}
          </button>
          <button className="play-btn" style={{ color: "#ff6d00", borderColor: "#ff6d00" }}
            onClick={() => setShowReset(true)}>
            ↺ RESET
          </button>
          <button
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            style={{ background:"transparent", border:"1px solid var(--border2)", color:"var(--text2)", padding:"3px 9px", borderRadius:3, cursor:"pointer", fontFamily:"Space Mono, monospace", fontSize:13, flexShrink:0 }}
            title={theme === "dark" ? "Passa al tema chiaro" : "Passa al tema scuro"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button className="play-btn"
            onClick={() => { setRunning(false); setScreen("start"); }}
            style={{ color:"var(--text3)", borderColor:"var(--border2)", flexShrink:0 }}
            title="Torna alla schermata iniziale">
            🏠
          </button>
          {playerName && (
            <span style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"var(--gold)", flexShrink:0, borderLeft:"1px solid var(--border2)", paddingLeft:10 }}>
              👤 {playerName}
            </span>
          )}
        </div>
      </div>

      {/* PORTFOLIO STRIP */}
      <div className="portfolio-strip">
        <div className="pf-metric">
          <span className="pf-label">Liquidità</span>
          <span className="pf-value gold">{fmtEur(cash)}</span>
        </div>
        <div className="pf-metric">
          <span className="pf-label">Portafoglio</span>
          <span className="pf-value">{fmtEur(portfolioValue)}</span>
        </div>
        <div className="pf-metric">
          <span className="pf-label">Totale</span>
          <span className="pf-value gold">{fmtEur(totalValue)}</span>
        </div>
        <div className="pf-metric">
          <span className="pf-label">P&L</span>
          <span className={`pf-value ${clrCls(totalPnl)}`}>{totalPnl >= 0 ? "+" : ""}{fmtEur(totalPnl)} ({fmtPct(totalPnlPct)})</span>
        </div>
        <div className="pf-metric">
          <span className="pf-label">Posizioni</span>
          <span className="pf-value">{positions.length}</span>
        </div>
        <div className="pf-metric">
          <span className="pf-label">Ordini Attivi</span>
          <span className="pf-value" style={{ color: orders.length > 0 ? "#ffc107" : "#4a5a6a" }}>{orders.length}</span>
        </div>
        <div className="pf-metric" style={{ marginLeft: "auto" }}>
          <span className="pf-label">Sentiment Mercato</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="sentiment-bar" style={{ width: 100 }}>
              <div className="sentiment-dot" style={{ left: `${((marketSentiment + 3) / 6) * 100}%` }} />
            </div>
            <span style={{ fontFamily: "Space Mono", fontSize: 10, color: clr(marketSentiment) }}>
              {marketSentiment > 0.5 ? "BULL" : marketSentiment < -0.5 ? "BEAR" : "NEUTRO"}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN TABS */}
      <div className="tabs">
        {["dashboard", "mercati", "trading", "portafoglio", "ordini", "storico", "analisi", "alert", "wiki"].map(t => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "dashboard" ? "📊 Dashboard" :
              t === "mercati" ? "📈 Mercati" :
                t === "trading" ? "⚡ Trading" :
                  t === "portafoglio" ? "💼 Portafoglio" :
                    t === "ordini" ? `🔔 Ordini (${orders.length})` :
                      t === "storico" ? "📋 Storico" :
                        t === "analisi" ? "🔬 Analisi" :
                          t === "alert" ? "🚨 Alert" : "📚 Wiki"}
          </button>
        ))}
      </div>

      <div className="main">

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Top indices */}
            <div className="grid3">
              {INDICES.map(idx => {
                const p = prices[idx.id];
                if (!p) return null;
                return (
                  <div className="card" key={idx.id}>
                    <div className="card-header">
                      <span className="card-title">{idx.name}</span>
                      <span style={{ color: clr(p.pctChange), fontFamily: "monospace", fontSize: 11 }}>{fmtPct(p.pctChange)}</span>
                    </div>
                    <div style={{ padding: "10px 14px" }}>
                      <div style={{ fontFamily: "Space Mono", fontSize: 22, fontWeight: 700, color: clr(p.pctChange) }}>{fmt(p.current, 1)}</div>
                      <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: "var(--text3)" }}>A: {fmt(p.open, 1)}</span>
                        <span style={{ fontSize: 11, color: "#00e676" }}>H: {fmt(p.high, 1)}</span>
                        <span style={{ fontSize: 11, color: "#ff1744" }}>L: {fmt(p.low, 1)}</span>
                      </div>
                      <div style={{ marginTop: 8 }}><Sparkline id={idx.id} w={220} h={40} /></div>
                    </div>
                  </div>
                );
              })}
              {/* Portfolio Summary */}
              <div className="card">
                <div className="card-header"><span className="card-title">Il Mio Portafoglio</span></div>
                <div style={{ padding: "10px 14px" }}>
                  <div style={{ fontFamily: "Space Mono", fontSize: 22, fontWeight: 700, color: "#e8c96c" }}>{fmtEur(totalValue)}</div>
                  <div style={{ marginTop: 4, fontFamily: "Space Mono", fontSize: 14, color: clr(totalPnl) }}>
                    {totalPnl >= 0 ? "+" : ""}{fmtEur(totalPnl)} ({fmtPct(totalPnlPct)})
                  </div>
                  <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 2 }}>CASH</div>
                      <div className="pbar-wrap">
                        <div className="pbar" style={{ width: `${(cash / totalValue) * 100}%`, background: "#29b6f6" }} />
                      </div>
                      <div style={{ fontSize: 10, color: "#29b6f6", marginTop: 2 }}>{fmt((cash / totalValue) * 100)}%</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 2 }}>INVESTITO</div>
                      <div className="pbar-wrap">
                        <div className="pbar" style={{ width: `${(portfolioValue / totalValue) * 100}%`, background: "#e8c96c" }} />
                      </div>
                      <div style={{ fontSize: 10, color: "#e8c96c", marginTop: 2 }}>{fmt((portfolioValue / totalValue) * 100)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top movers + positions */}
            <div className="grid2">
              <div className="card">
                <div className="card-header"><span className="card-title">🚀 Top Rialzisti</span></div>
                <div className="table-scroll" style={{ maxHeight: 220 }}>
                  <table>
                    <thead><tr><th>Titolo</th><th>Prezzo</th><th>Var%</th><th>Grafico</th></tr></thead>
                    <tbody>
                      {[...STOCKS].sort((a, b) => (prices[b.id]?.pctChange || 0) - (prices[a.id]?.pctChange || 0)).slice(0, 8).map(s => {
                        const p = prices[s.id];
                        return (
                          <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => { setSelectedInstr({ ...s, category: "Azioni" }); setTab("trading"); }}>
                            <td style={{ color: "#e8c96c", fontFamily: "monospace", fontWeight: 700 }}>{s.id}</td>
                            <td style={{ fontFamily: "monospace", fontSize: 12 }}>€{fmt(p?.current)}</td>
                            <td style={{ color: clr(p?.pctChange || 0), fontFamily: "monospace", fontSize: 12 }}>{fmtPct(p?.pctChange || 0)}</td>
                            <td><Sparkline id={s.id} w={70} h={22} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <div className="card-header"><span className="card-title">📉 Top Ribassisti</span></div>
                <div className="table-scroll" style={{ maxHeight: 220 }}>
                  <table>
                    <thead><tr><th>Titolo</th><th>Prezzo</th><th>Var%</th><th>Grafico</th></tr></thead>
                    <tbody>
                      {[...STOCKS].sort((a, b) => (prices[a.id]?.pctChange || 0) - (prices[b.id]?.pctChange || 0)).slice(0, 8).map(s => {
                        const p = prices[s.id];
                        return (
                          <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => { setSelectedInstr({ ...s, category: "Azioni" }); setTab("trading"); }}>
                            <td style={{ color: "#e8c96c", fontFamily: "monospace", fontWeight: 700 }}>{s.id}</td>
                            <td style={{ fontFamily: "monospace", fontSize: 12 }}>€{fmt(p?.current)}</td>
                            <td style={{ color: clr(p?.pctChange || 0), fontFamily: "monospace", fontSize: 12 }}>{fmtPct(p?.pctChange || 0)}</td>
                            <td><Sparkline id={s.id} w={70} h={22} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Positions preview */}
            {positions.length > 0 && (
              <div className="card">
                <div className="card-header"><span className="card-title">💼 Posizioni Aperte</span></div>
                <div className="table-scroll" style={{ maxHeight: 200 }}>
                  <table>
                    <thead><tr><th>Titolo</th><th>Qtà</th><th>Prezzo Medio</th><th>Prezzo Attuale</th><th>Valore</th><th>P&L</th><th>P&L%</th></tr></thead>
                    <tbody>
                      {positions.map(pos => (
                        <tr key={pos.id}>
                          <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{pos.id}</td>
                          <td style={{ fontFamily: "monospace" }}>{pos.qty}</td>
                          <td style={{ fontFamily: "monospace", color: "var(--g8)" }}>€{fmt(pos.avgPrice)}</td>
                          <td style={{ fontFamily: "monospace" }}>€{fmt(pos.currentPrice)}</td>
                          <td style={{ fontFamily: "monospace" }}>€{fmt(pos.mktVal)}</td>
                          <td style={{ fontFamily: "monospace", color: clr(pos.pnl) }}>{pos.pnl >= 0 ? "+" : ""}{fmtEur(pos.pnl)}</td>
                          <td style={{ fontFamily: "monospace", color: clr(pos.pnlPct) }}>{fmtPct(pos.pnlPct)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MERCATI ── */}
        {tab === "mercati" && (
          <div className="card">
            <div className="subtabs">
              {["Azioni", "ETF/ETC", "Obbligazioni", "Derivati", "Fondo"].map(st => (
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
                  {filteredInstruments.map(i => <InstrumentRow key={i.id} instr={i} />)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TRADING ── */}
        {tab === "trading" && (
          <div className="grid-main">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Search */}
              <div className="card">
                <div className="card-header"><span className="card-title">🔍 Cerca Strumento</span></div>
                <div style={{ padding: 12 }}>
                  <select
                    value={selectedInstr?.id || ""}
                    onChange={e => {
                      const instr = ALL_INSTRUMENTS.find(i => i.id === e.target.value);
                      setSelectedInstr(instr || null);
                    }}
                  >
                    <option value="">-- Seleziona --</option>
                    {["Azioni", "ETF/ETC", "Obbligazioni", "Derivati", "Fondo"].map(cat => (
                      <optgroup key={cat} label={cat}>
                        {ALL_INSTRUMENTS.filter(i => i.category === cat).map(i => (
                          <option key={i.id} value={i.id}>{i.id} — {i.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chart */}
              {selectedInstr && (
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">{selectedInstr.id} — {selectedInstr.name}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 20, color: clr(prices[selectedInstr.id]?.pctChange || 0) }}>
                      €{fmt(prices[selectedInstr.id]?.current)}
                    </span>
                  </div>
                  <div style={{ padding: "0 0 8px 0" }}>
                    <PriceChart id={selectedInstr.id} w={500} h={160} />
                  </div>
                  <div style={{ display: "flex", gap: 20, padding: "0 16px 12px" }}>
                    {[
                      ["Apertura", prices[selectedInstr.id]?.open],
                      ["Massimo", prices[selectedInstr.id]?.high],
                      ["Minimo", prices[selectedInstr.id]?.low],
                      ["Var%", null],
                      ["Beta", selectedInstr.beta],
                      ["Div. Yield", selectedInstr.div ? selectedInstr.div + "%" : "—"],
                    ].map(([lbl, val]) => (
                      <div key={lbl}>
                        <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 2, fontFamily: "Space Mono" }}>{lbl}</div>
                        <div style={{ fontFamily: "Space Mono", fontSize: 12, color: lbl === "Var%" ? clr(prices[selectedInstr.id]?.pctChange || 0) : "#ccc" }}>
                          {lbl === "Var%" ? fmtPct(prices[selectedInstr.id]?.pctChange || 0) : lbl === "Beta" || lbl === "Div. Yield" ? val : `€${fmt(val)}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Book Simulation */}
              {selectedInstr && (
                <div className="card">
                  <div className="card-header"><span className="card-title">📒 Book Ordini (Simulato)</span></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                    <div>
                      <div style={{ padding: "4px 8px", background: "rgba(0,230,118,0.05)", borderBottom: "1px solid var(--border)" }}>
                        <span style={{ fontFamily: "Space Mono", fontSize: 10, color: "#00e676" }}>BID — Acquisto</span>
                      </div>
                      {Array.from({ length: 5 }, (_, i) => {
                        const cp = prices[selectedInstr.id]?.current || selectedInstr.price;
                        const bidP = cp * (1 - 0.0002 * (i + 1));
                        const qty = Math.floor(Math.random() * 900 + 100);
                        return (
                          <div key={i} className="ob-row" style={{ background: `rgba(0,230,118,${0.04 - i * 0.007})` }}>
                            <span style={{ color: "#00e676" }}>€{fmt(bidP)}</span>
                            <span style={{ color: "var(--g6)" }}>{qty}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      <div style={{ padding: "4px 8px", background: "rgba(255,23,68,0.05)", borderBottom: "1px solid var(--border)" }}>
                        <span style={{ fontFamily: "Space Mono", fontSize: 10, color: "#ff1744" }}>ASK — Vendita</span>
                      </div>
                      {Array.from({ length: 5 }, (_, i) => {
                        const cp = prices[selectedInstr.id]?.current || selectedInstr.price;
                        const askP = cp * (1 + 0.0002 * (i + 1));
                        const qty = Math.floor(Math.random() * 900 + 100);
                        return (
                          <div key={i} className="ob-row" style={{ background: `rgba(255,23,68,${0.04 - i * 0.007})` }}>
                            <span style={{ color: "#ff1744" }}>€{fmt(askP)}</span>
                            <span style={{ color: "var(--g6)" }}>{qty}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ORDER PANEL */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="card">
                <div className="card-header"><span className="card-title">⚡ Inserisci Ordine</span></div>
                <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>

                  {/* BUY/SELL toggle */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      style={{ flex: 1, padding: "8px", borderRadius: 3, border: "1px solid", fontFamily: "Space Mono", fontSize: 13, fontWeight: 700, cursor: "pointer", background: orderSide === "buy" ? "rgba(0,230,118,0.15)" : "transparent", borderColor: orderSide === "buy" ? "#00e676" : "var(--border-inline2)", color: orderSide === "buy" ? "#00e676" : "var(--text3)" }}
                      onClick={() => setOrderSide("buy")}
                    >ACQUISTA</button>
                    <button
                      style={{ flex: 1, padding: "8px", borderRadius: 3, border: "1px solid", fontFamily: "Space Mono", fontSize: 13, fontWeight: 700, cursor: "pointer", background: orderSide === "sell" ? "rgba(255,23,68,0.15)" : "transparent", borderColor: orderSide === "sell" ? "#ff1744" : "var(--border-inline2)", color: orderSide === "sell" ? "#ff1744" : "var(--text3)" }}
                      onClick={() => setOrderSide("sell")}
                    >VENDI</button>
                  </div>

                  {/* Instrument */}
                  <div className="form-group">
                    <label className="form-label">Strumento</label>
                    <select value={selectedInstr?.id || ""} onChange={e => setSelectedInstr(ALL_INSTRUMENTS.find(i => i.id === e.target.value) || null)}>
                      <option value="">-- Seleziona --</option>
                      {["Azioni", "ETF/ETC", "Obbligazioni", "Derivati", "Fondo"].map(cat => (
                        <optgroup key={cat} label={cat}>
                          {ALL_INSTRUMENTS.filter(i => i.category === cat).map(i => (
                            <option key={i.id} value={i.id}>{i.id} — {i.name}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Order type */}
                  <div className="form-group">
                    <label className="form-label">Tipo Ordine</label>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {[["market", "Market"], ["limit", "Limite"], ["stop", "Stop Loss"]].map(([v, l]) => (
                        <button key={v} className={`btn-outline ${orderType === v ? "active" : ""}`} onClick={() => setOrderType(v)}>{l}</button>
                      ))}
                    </div>
                  </div>

                  {/* Descrizione operazione inline */}
                  {currentOpDesc && (
                    <div style={{ background: `${currentOpDesc.color}09`, border: `1px solid ${currentOpDesc.color}30`, borderLeft: `3px solid ${currentOpDesc.color}`, borderRadius: "0 4px 4px 0", padding: "9px 12px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{currentOpDesc.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "Space Mono", fontSize: 10, fontWeight: 700, color: currentOpDesc.color, marginBottom: 3 }}>{currentOpDesc.label}</div>
                        <div style={{ fontSize: 11, color: "var(--g9)", lineHeight: 1.5 }}>{currentOpDesc.short}</div>
                      </div>
                      <button
                        onClick={() => setShowOpDesc(true)}
                        style={{ flexShrink: 0, background: "transparent", border: `1px solid ${currentOpDesc.color}44`, color: currentOpDesc.color, fontSize: 10, fontFamily: "Space Mono", padding: "3px 8px", borderRadius: 3, cursor: "pointer", whiteSpace: "nowrap" }}
                      >
                        Dettagli ›
                      </button>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="form-group">
                    <label className="form-label">Quantità</label>
                    <input type="number" min="1" value={orderQty} onChange={e => setOrderQty(e.target.value)} />
                  </div>

                  {/* Limit price */}
                  {orderType === "limit" && (
                    <div className="form-group">
                      <label className="form-label">Prezzo Limite (€)</label>
                      <input type="number" step="0.01" value={limitPrice} onChange={e => setLimitPrice(e.target.value)} placeholder="es. 14.50" />
                    </div>
                  )}

                  {/* Stop price */}
                  {orderType === "stop" && (
                    <div className="form-group">
                      <label className="form-label">Prezzo Stop (€)</label>
                      <input type="number" step="0.01" value={stopPrice} onChange={e => setStopPrice(e.target.value)} placeholder="es. 13.80" />
                    </div>
                  )}

                  {/* Cost estimate */}
                  {selectedInstr && (
                    <div style={{ background: "var(--bg-inline)", border: "1px solid var(--border)", borderRadius: 3, padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono" }}>Prezzo attuale:</span>
                        <span style={{ fontSize: 11, fontFamily: "Space Mono", color: "var(--gc)" }}>€{fmt(prices[selectedInstr.id]?.current)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono" }}>Controvalore:</span>
                        <span style={{ fontSize: 11, fontFamily: "Space Mono", color: "var(--gc)" }}>€{fmt((prices[selectedInstr.id]?.current || 0) * parseInt(orderQty || 0))}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono" }}>Commissione est.:</span>
                        <span style={{ fontSize: 11, fontFamily: "Space Mono", color: "#ffc107" }}>€{fmt(Math.max(1.5, (prices[selectedInstr.id]?.current || 0) * parseInt(orderQty || 0) * 0.001))}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: 4 }}>
                        <span style={{ fontSize: 11, color: "var(--gc)", fontFamily: "Space Mono", fontWeight: 700 }}>Totale:</span>
                        <span style={{ fontSize: 12, fontFamily: "Space Mono", fontWeight: 700, color: orderSide === "buy" ? "#ff1744" : "#00e676" }}>
                          {orderSide === "buy" ? "-" : "+"}€{fmt(Math.max(1.5, (prices[selectedInstr.id]?.current || 0) * parseInt(orderQty || 0) * 1.001))}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleOrder}
                    className={orderSide === "buy" ? "btn-buy" : "btn-sell"}
                    disabled={marketStatus !== "APERTO" && orderType === "market"}
                  >
                    {orderType === "market" ? (orderSide === "buy" ? "ACQUISTA ORA" : "VENDI ORA") : (orderSide === "buy" ? "INSERISCI ORDINE BUY" : "INSERISCI ORDINE SELL")}
                  </button>

                  {marketStatus !== "APERTO" && orderType === "market" && (
                    <div style={{ textAlign: "center", fontSize: 11, color: "#ff1744", fontFamily: "Space Mono" }}>⚠ Mercato {marketStatus}</div>
                  )}

                  {orderMsg && (
                    <div style={{ padding: "8px 10px", background: "rgba(0,200,255,0.05)", border: "1px solid rgba(0,200,255,0.2)", borderRadius: 3, fontSize: 11, color: "#29b6f6", fontFamily: "Space Mono" }}>
                      {orderMsg}
                    </div>
                  )}
                </div>
              </div>

              {/* Posizione corrente */}
              {selectedInstr && portfolio[selectedInstr.id] && (
                <div className="card">
                  <div className="card-header"><span className="card-title">💼 Posizione in {selectedInstr.id}</span></div>
                  <div style={{ padding: 12 }}>
                    {(() => {
                      const pos = portfolio[selectedInstr.id];
                      const cp = prices[selectedInstr.id]?.current || pos.avgPrice;
                      const pnl = (cp - pos.avgPrice) * pos.qty;
                      const pnlPct = (cp / pos.avgPrice - 1) * 100;
                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono" }}>Quantità:</span>
                            <span style={{ fontSize: 12, fontFamily: "Space Mono", color: "var(--gc)" }}>{pos.qty}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono" }}>Prezzo medio:</span>
                            <span style={{ fontSize: 12, fontFamily: "Space Mono", color: "var(--gc)" }}>€{fmt(pos.avgPrice)}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono" }}>Valore attuale:</span>
                            <span style={{ fontSize: 12, fontFamily: "Space Mono", color: "#e8c96c" }}>€{fmt(cp * pos.qty)}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: 6 }}>
                            <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono" }}>P&L:</span>
                            <span style={{ fontSize: 13, fontFamily: "Space Mono", fontWeight: 700, color: clr(pnl) }}>
                              {pnl >= 0 ? "+" : ""}{fmtEur(pnl)} ({fmtPct(pnlPct)})
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PORTAFOGLIO ── */}
        {tab === "portafoglio" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Summary cards */}
            <div className="grid3">
              {[
                ["Valore Totale", fmtEur(totalValue), "#e8c96c"],
                ["Liquidità", fmtEur(cash), "#29b6f6"],
                ["Investito", fmtEur(portfolioValue), "#888"],
                ["P&L Totale", `${totalPnl >= 0 ? "+" : ""}${fmtEur(totalPnl)}`, clr(totalPnl)],
                ["P&L%", fmtPct(totalPnlPct), clr(totalPnlPct)],
                ["Operazioni", trades.length, "#888"],
              ].map(([lbl, val, color]) => (
                <div className="card" key={lbl}>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "Space Mono", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{lbl}</div>
                    <div style={{ fontSize: 22, fontFamily: "Space Mono", fontWeight: 700, color }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>

            {positions.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
                <div style={{ fontFamily: "Space Mono", fontSize: 14 }}>Nessuna posizione aperta</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>Vai su Trading per acquistare strumenti</div>
              </div>
            ) : (
              <div className="card">
                <div className="card-header">
                  <span className="card-title">📊 Posizioni Aperte ({positions.length})</span>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Codice</th>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th style={{ textAlign: "right" }}>Qtà</th>
                        <th style={{ textAlign: "right" }}>Pr. Medio</th>
                        <th style={{ textAlign: "right" }}>Pr. Attuale</th>
                        <th style={{ textAlign: "right" }}>Valore Mkt</th>
                        <th style={{ textAlign: "right" }}>P&L €</th>
                        <th style={{ textAlign: "right" }}>P&L %</th>
                        <th>Trend</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map(pos => (
                        <tr key={pos.id}>
                          <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{pos.id}</td>
                          <td style={{ color: "var(--gc)", fontSize: 11 }}>{pos.name}</td>
                          <td style={{ color: "var(--g5)", fontSize: 11 }}>{pos.category}</td>
                          <td style={{ textAlign: "right", fontFamily: "monospace" }}>{pos.qty}</td>
                          <td style={{ textAlign: "right", fontFamily: "monospace", color: "var(--g8)" }}>€{fmt(pos.avgPrice)}</td>
                          <td style={{ textAlign: "right", fontFamily: "monospace" }}>€{fmt(pos.currentPrice)}</td>
                          <td style={{ textAlign: "right", fontFamily: "monospace", color: "#e8c96c" }}>€{fmt(pos.mktVal)}</td>
                          <td style={{ textAlign: "right", fontFamily: "monospace", color: clr(pos.pnl) }}>
                            {pos.pnl >= 0 ? "+" : ""}{fmtEur(pos.pnl)}
                          </td>
                          <td style={{ textAlign: "right", fontFamily: "monospace", color: clr(pos.pnlPct) }}>
                            {fmtPct(pos.pnlPct)}
                          </td>
                          <td><Sparkline id={pos.id} w={80} h={22} /></td>
                          <td>
                            <button className="btn-sell-sm" onClick={() => {
                              executeTrade(pos.id, "sell", pos.qty, pos.currentPrice, "market", addAlert, setCash, setPortfolio, setTrades);
                              addAlert(`SELL ALL: ${pos.id} @ €${fmt(pos.currentPrice)}`, "info");
                            }}>CHIUDI</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ORDINI ATTIVI ── */}
        {tab === "ordini" && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">🔔 Ordini Attivi ({orders.length})</span>
              {orders.length > 0 && (
                <button className="btn-outline" onClick={() => setOrders([])}>Cancella Tutti</button>
              )}
            </div>
            {orders.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
                <div style={{ fontFamily: "Space Mono", fontSize: 14 }}>Nessun ordine in attesa</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Strumento</th>
                    <th>Tipo</th>
                    <th>Direzione</th>
                    <th style={{ textAlign: "right" }}>Qtà</th>
                    <th style={{ textAlign: "right" }}>Prezzo Trigger</th>
                    <th style={{ textAlign: "right" }}>Prezzo Attuale</th>
                    <th>Inserito</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(ord => {
                    const cp = prices[ord.instrId]?.current;
                    const trigger = ord.limitPrice || ord.stopPrice;
                    const dist = cp && trigger ? ((trigger / cp - 1) * 100) : null;
                    return (
                      <tr key={ord.id}>
                        <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{ord.instrId}</td>
                        <td style={{ color: "var(--g8)", fontSize: 12, fontFamily: "monospace" }}>{ord.type.toUpperCase()}</td>
                        <td style={{ color: ord.side === "buy" ? "#00e676" : "#ff1744", fontFamily: "monospace", fontWeight: 700 }}>
                          {ord.side === "buy" ? "BUY" : "SELL"}
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "monospace" }}>{ord.qty}</td>
                        <td style={{ textAlign: "right", fontFamily: "monospace", color: "#ffc107" }}>€{fmt(trigger)}</td>
                        <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                          €{fmt(cp)}
                          {dist !== null && <span style={{ marginLeft: 6, fontSize: 10, color: clr(-dist) }}>({fmtPct(dist)})</span>}
                        </td>
                        <td style={{ fontSize: 11, color: "var(--text3)" }}>{ord.time}</td>
                        <td>
                          <button className="btn-outline" onClick={() => setOrders(o => o.filter(x => x.id !== ord.id))}>✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── STORICO ── */}
        {tab === "storico" && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">📋 Storico Operazioni ({trades.length})</span>
            </div>
            {trades.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
                <div style={{ fontFamily: "Space Mono", fontSize: 14 }}>Nessuna operazione ancora</div>
              </div>
            ) : (
              <div className="table-scroll" style={{ maxHeight: 600 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Data/Ora</th>
                      <th>Strumento</th>
                      <th>Tipo</th>
                      <th style={{ textAlign: "right" }}>Qtà</th>
                      <th style={{ textAlign: "right" }}>Prezzo</th>
                      <th style={{ textAlign: "right" }}>Commissione</th>
                      <th style={{ textAlign: "right" }}>Totale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map(t => (
                      <tr key={t.id}>
                        <td style={{ fontSize: 11, color: "var(--text3)" }}>{t.time}</td>
                        <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{t.instrId}</td>
                        <td style={{ color: t.side === "buy" ? "#00e676" : "#ff1744", fontFamily: "monospace", fontWeight: 700 }}>
                          {t.side === "buy" ? "BUY" : "SELL"}
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "monospace" }}>{t.qty}</td>
                        <td style={{ textAlign: "right", fontFamily: "monospace" }}>€{fmt(t.price)}</td>
                        <td style={{ textAlign: "right", fontFamily: "monospace", color: "#ffc107" }}>€{fmt(t.commission)}</td>
                        <td style={{ textAlign: "right", fontFamily: "monospace", color: t.side === "buy" ? "#ff1744" : "#00e676", fontWeight: 700 }}>
                          {t.side === "buy" ? "-" : "+"}€{fmt(t.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ANALISI ── */}
        {tab === "analisi" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Portfolio stats */}
            <div className="grid3">
              {(() => {
                const returns = positions.map(p => p.pnlPct);
                const posCount = returns.filter(r => r > 0).length;
                const negCount = returns.filter(r => r < 0).length;
                const avgReturn = returns.length ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
                const totalCommissions = trades.reduce((sum, t) => sum + t.commission, 0);
                const winRate = returns.length ? (posCount / returns.length) * 100 : 0;
                const bestPos = positions.reduce((best, p) => (!best || p.pnlPct > best.pnlPct) ? p : best, null);
                const worstPos = positions.reduce((worst, p) => (!worst || p.pnlPct < worst.pnlPct) ? p : worst, null);
                return [
                  ["Ritorno Medio Posizioni", fmtPct(avgReturn), clr(avgReturn)],
                  ["Win Rate", fmt(winRate) + "%", winRate >= 50 ? "#00e676" : "#ff1744"],
                  ["Commissioni Totali", fmtEur(totalCommissions), "#ffc107"],
                  ["Posizioni Positive", posCount, "#00e676"],
                  ["Posizioni Negative", negCount, "#ff1744"],
                  ["Miglior Titolo", bestPos ? `${bestPos.id} (${fmtPct(bestPos.pnlPct)})` : "—", "#00e676"],
                  ["Peggior Titolo", worstPos ? `${worstPos.id} (${fmtPct(worstPos.pnlPct)})` : "—", "#ff1744"],
                  ["N. Operazioni", trades.length, "#ccc"],
                  ["Esposizione Mercato", fmt((portfolioValue / totalValue) * 100) + "%", "#888"],
                ].map(([lbl, val, color]) => (
                  <div className="card" key={lbl}>
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "Space Mono", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{lbl}</div>
                      <div style={{ fontSize: 18, fontFamily: "Space Mono", fontWeight: 700, color }}>{val}</div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Sector analysis */}
            <div className="card">
              <div className="card-header"><span className="card-title">📊 Analisi per Settore (Portafoglio)</span></div>
              {positions.length === 0 ? (
                <div style={{ padding: 20, color: "var(--text3)", textAlign: "center", fontSize: 12 }}>Nessuna posizione aperta</div>
              ) : (
                <div className="sector-grid">
                  {(() => {
                    const byCategory = {};
                    positions.forEach(p => {
                      const cat = p.category || "Altro";
                      if (!byCategory[cat]) byCategory[cat] = { mktVal: 0, pnl: 0 };
                      byCategory[cat].mktVal += p.mktVal;
                      byCategory[cat].pnl += p.pnl;
                    });
                    return Object.entries(byCategory).map(([cat, data]) => (
                      <div className="sector-card" key={cat}>
                        <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "Space Mono", marginBottom: 4 }}>{cat}</div>
                        <div style={{ fontSize: 14, fontFamily: "Space Mono", fontWeight: 700, color: "#e8c96c" }}>€{fmt(data.mktVal)}</div>
                        <div style={{ fontSize: 12, fontFamily: "Space Mono", color: clr(data.pnl) }}>
                          {data.pnl >= 0 ? "+" : ""}{fmtEur(data.pnl)}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--g5)", marginTop: 4 }}>
                          {fmt((data.mktVal / portfolioValue) * 100)}% ptf
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>

            {/* Market performance */}
            <div className="card">
              <div className="card-header"><span className="card-title">📈 Performance Mercato — Top & Flop Settori</span></div>
              <div style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {(() => {
                  const sectors = {};
                  STOCKS.forEach(s => {
                    if (!sectors[s.sector]) sectors[s.sector] = [];
                    sectors[s.sector].push(prices[s.id]?.pctChange || 0);
                  });
                  return Object.entries(sectors).map(([sec, changes]) => {
                    const avg = changes.reduce((a, b) => a + b, 0) / changes.length;
                    return { sec, avg };
                  }).sort((a, b) => b.avg - a.avg).map(({ sec, avg }) => (
                    <div key={sec} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "var(--g8)", width: 120, flexShrink: 0 }}>{sec}</span>
                      <div style={{ flex: 1 }}>
                        <div className="pbar-wrap">
                          <div className="pbar" style={{
                            width: `${Math.min(100, Math.abs(avg) * 10 + 50)}%`,
                            background: avg >= 0 ? "#00e676" : "#ff1744",
                            opacity: 0.6
                          }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "Space Mono", color: clr(avg), width: 60, textAlign: "right" }}>{fmtPct(avg)}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ── ALERT ── */}
        {tab === "alert" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <div className="card-header"><span className="card-title">🔔 Imposta Alert Prezzo</span></div>
              <div style={{ padding: 14, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div className="form-group" style={{ minWidth: 200 }}>
                  <label className="form-label">Strumento</label>
                  <select value={alertInstr} onChange={e => setAlertInstr(e.target.value)}>
                    <option value="">-- Seleziona --</option>
                    {ALL_INSTRUMENTS.map(i => <option key={i.id} value={i.id}>{i.id} — {i.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ minWidth: 120 }}>
                  <label className="form-label">Direzione</label>
                  <select value={alertDir} onChange={e => setAlertDir(e.target.value)}>
                    <option value="above">Supera (≥)</option>
                    <option value="below">Scende sotto (≤)</option>
                  </select>
                </div>
                <div className="form-group" style={{ minWidth: 120 }}>
                  <label className="form-label">Prezzo Target (€)</label>
                  <input type="number" step="0.01" value={alertPrice} onChange={e => setAlertPrice(e.target.value)} placeholder="es. 15.00" />
                </div>
                <button className="btn-primary" style={{ width: "auto", padding: "6px 20px" }} onClick={addPriceAlert}>
                  + Aggiungi Alert
                </button>
              </div>
            </div>

            {/* Active alerts */}
            <div className="card">
              <div className="card-header"><span className="card-title">📋 Alert Attivi ({priceAlerts.length})</span></div>
              {priceAlerts.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", color: "var(--text3)" }}>Nessun alert impostato</div>
              ) : (
                <table>
                  <thead><tr><th>Strumento</th><th>Condizione</th><th>Target</th><th>Prezzo Attuale</th><th>Distanza</th><th></th></tr></thead>
                  <tbody>
                    {priceAlerts.map(a => {
                      const cp = prices[a.instrId]?.current;
                      const dist = cp ? ((a.targetPrice / cp - 1) * 100) : null;
                      return (
                        <tr key={a.id}>
                          <td style={{ color: "#e8c96c", fontWeight: 700, fontFamily: "monospace" }}>{a.instrId}</td>
                          <td style={{ color: "var(--g8)" }}>{a.dir === "above" ? "Supera ≥" : "Scende ≤"}</td>
                          <td style={{ fontFamily: "monospace", color: "#ffc107" }}>€{fmt(a.targetPrice)}</td>
                          <td style={{ fontFamily: "monospace" }}>€{fmt(cp)}</td>
                          <td style={{ fontFamily: "monospace", color: clr(dist || 0), fontSize: 12 }}>
                            {dist !== null ? fmtPct(dist) : "—"}
                          </td>
                          <td>
                            <button className="btn-outline" onClick={() => setPriceAlerts(pa => pa.filter(x => x.id !== a.id))}>✕</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Recent notifications */}
            <div className="card">
              <div className="card-header"><span className="card-title">📢 Log Notifiche</span></div>
              <div style={{ maxHeight: 300, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                {alerts.length === 0 ? (
                  <div style={{ color: "var(--text3)", fontSize: 12, textAlign: "center", padding: 20 }}>Nessuna notifica</div>
                ) : alerts.map(a => (
                  <div key={a.id} style={{ padding: "6px 10px", borderLeft: `3px solid ${a.type === "success" ? "#00e676" : a.type === "error" ? "#ff1744" : a.type === "warning" ? "#ffc107" : "#29b6f6"}`, background: "var(--bg-inline)", borderRadius: "0 3px 3px 0" }}>
                    <span style={{ fontSize: 10, color: "var(--text3)", marginRight: 8, fontFamily: "Space Mono" }}>{a.time}</span>
                    <span style={{ fontSize: 12 }}>{a.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── WIKI ── */}
        {tab === "wiki" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Search */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">📚 Guida agli Strumenti Finanziari</span>
                <span style={{ fontFamily:"Space Mono", fontSize:10, color:"var(--text3)" }}>{WIKI_ARTICLES.length} articoli</span>
              </div>
              <div style={{ padding:"12px 14px" }}>
                <input
                  placeholder="🔍 Cerca argomento..."
                  value={wikiSearch}
                  onChange={e => setWikiSearch(e.target.value)}
                  style={{ marginBottom:0 }}
                />
              </div>
            </div>

            {/* Article grid */}
            {(() => {
              const tagOrder = ["Base","Avanzato","Strumenti","Strategia","Contesto","Pratico"];
              const tagColors = { "Base":"#00e676","Avanzato":"#ff6d00","Strumenti":"#29b6f6","Strategia":"#ef9a9a","Contesto":"#90caf9","Pratico":"#b0bec5" };
              const filtered = WIKI_ARTICLES.filter(a =>
                !wikiSearch ||
                a.title.toLowerCase().includes(wikiSearch.toLowerCase()) ||
                a.summary.toLowerCase().includes(wikiSearch.toLowerCase()) ||
                a.sections.some(s => s.h.toLowerCase().includes(wikiSearch.toLowerCase()) || (s.body||"").toLowerCase().includes(wikiSearch.toLowerCase()))
              );
              const grouped = tagOrder.reduce((acc, tag) => {
                const arts = filtered.filter(a => a.tag === tag);
                if (arts.length) acc[tag] = arts;
                return acc;
              }, {});
              return Object.entries(grouped).map(([tag, arts]) => (
                <div key={tag}>
                  <div style={{ fontFamily:"Space Mono", fontSize:10, color:tagColors[tag], textTransform:"uppercase", letterSpacing:2, marginBottom:8, display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:tagColors[tag] }}/>
                    {tag}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:10 }}>
                    {arts.map(a => (
                      <div key={a.id} onClick={() => setWikiOpenId(a.id)}
                        style={{ background:"var(--bg2)", border:`1px solid ${a.color}33`, borderLeft:`3px solid ${a.color}`, borderRadius:4, padding:"14px 16px", cursor:"pointer", transition:"all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.background="#111820"; e.currentTarget.style.borderColor=`${a.color}88`; }}
                        onMouseLeave={e => { e.currentTarget.style.background="var(--bg2)"; e.currentTarget.style.borderColor=`${a.color}33`; }}
                      >
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                          <span style={{ fontSize:20 }}>{a.icon}</span>
                          <span style={{ fontFamily:"Space Mono", fontSize:13, fontWeight:700, color:a.color }}>{a.title}</span>
                        </div>
                        <div style={{ fontSize:11, color:"#777", lineHeight:1.5, marginBottom:10 }}>{a.summary}</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                          {a.sections.slice(0,4).map((s,i) => (
                            <span key={i} style={{ fontSize:9, fontFamily:"Space Mono", color:"var(--text3)", background:"rgba(255,255,255,0.03)", border:"1px solid var(--border-inline)", borderRadius:2, padding:"1px 5px" }}>{s.h}</span>
                          ))}
                          {a.sections.length > 4 && <span style={{ fontSize:9, color:"var(--text3)" }}>+{a.sections.length-4} altri</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </div>

      {/* FLOATING ALERTS */}
      <div className="alerts-container">
        {alerts.slice(0, 4).map(a => (
          <div key={a.id} className={`alert-toast alert-${a.type}`}>
            {a.msg}
          </div>
        ))}
      </div>

      {/* MODALS */}
      <OpDescModal />
      {showReset && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:700, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:"var(--bg2)", border:"1px solid #ff6d00", borderTop:"3px solid #ff6d00", borderRadius:6, padding:28, maxWidth:360, width:"100%", textAlign:"center" }}>
            <div style={{ fontSize:32, marginBottom:12 }}>↺</div>
            <div style={{ fontFamily:"Space Mono", fontSize:14, fontWeight:700, color:"#ff6d00", marginBottom:8 }}>Reset Simulazione</div>
            <div style={{ fontSize:12, color:"#888", lineHeight:1.6, marginBottom:24 }}>
              Tutti i dati verranno azzerati:<br/>portafoglio, trade, ordini, prezzi e storia grafici.<br/>Si ricomincia da €1.000.
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowReset(false)}
                style={{ flex:1, padding:"10px", background:"var(--bg3)", border:"1px solid var(--border-inline2)", color:"var(--text2)", borderRadius:3, fontFamily:"Space Mono", fontSize:12, cursor:"pointer" }}>
                Annulla
              </button>
              <button onClick={() => {
                setShowReset(false);
                setRunning(false);
                setCash(1000);
                setPortfolio({});
                setTrades([]);
                setOrders([]);
                setAlerts([]);
                setPriceAlerts([]);
                setMarketSentiment(0);
                setSimTime(new Date("2025-01-02T09:00:00"));
                setSpeed(24);
                setOrderMsg("");
                setSelectedInstr(null);
                tRef.current = 0; lastSaveRef.current = Date.now(); saveIdRef.current = null;
                const p = {};
                ALL_INSTRUMENTS.forEach(i => { p[i.id] = { current:i.price, prev:i.price, open:i.price, high:i.price, low:i.price, pctChange:0 }; });
                INDICES.forEach(i => { p[i.id] = { current:i.value, prev:i.value, open:i.value, high:i.value, low:i.value, pctChange:0 }; });
                setPrices(p);
                const h = {};
                ALL_INSTRUMENTS.forEach(i => { h[i.id] = [{ t:0, v:i.price }]; });
                INDICES.forEach(i => { h[i.id] = [{ t:0, v:i.value }]; });
                setPriceHistory(h);
                setTimeout(() => setRunning(true), 50);
              }}
                style={{ flex:1, padding:"10px", background:"rgba(255,109,0,0.15)", border:"1px solid #ff6d00", color:"#ff6d00", borderRadius:3, fontFamily:"Space Mono", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                ↺ Conferma Reset
              </button>
            </div>
          </div>
        </div>
      )}
      {wikiOpenId && <WikiArticle articleId={wikiOpenId} onClose={() => setWikiOpenId(null)} />}
    </div>
  );
}
