export const fmt = (n, dec = 2) =>
  n?.toLocaleString("it-IT", { minimumFractionDigits: dec, maximumFractionDigits: dec });

export const fmtEur = (n) => "€" + fmt(Math.abs(n));

export const fmtPct = (n) => (n >= 0 ? "+" : "") + fmt(n) + "%";

export const clr = (n) => (n >= 0 ? "#00e676" : "#ff1744");

export const clrCls = (n) => (n >= 0 ? "pos" : "neg");

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });

export const fmtSaveDate = (iso) =>
  new Date(iso).toLocaleString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
