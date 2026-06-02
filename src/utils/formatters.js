const IT = "it-IT";

export const fmt = (n, dec = 2) => {
  if (n == null || !isFinite(n)) return "—";
  return n.toLocaleString(IT, { minimumFractionDigits: dec, maximumFractionDigits: dec });
};

export const fmtEur = (n) => {
  if (n == null || !isFinite(n)) return "€—";
  return "€" + Math.abs(n).toLocaleString(IT, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const fmtPct = (n) => {
  if (n == null || !isFinite(n)) return "—%";
  return (n >= 0 ? "+" : "") + fmt(n) + "%";
};

export const clr = (n) => (n == null || isNaN(n) || n >= 0) ? "#00e676" : "#ff1744";

export const clrCls = (n) => (n == null || isNaN(n) || n >= 0) ? "pos" : "neg";

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(IT, { day: "2-digit", month: "short", year: "numeric" });

export const fmtSaveDate = (iso) =>
  new Date(iso).toLocaleString(IT, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
