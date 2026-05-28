import { useState, useMemo } from "react";

export function useSortableTable(rows, { defaultKey = null, defaultDir = "asc", searchFn = null } = {}) {
  const [sortKey, setSortKey] = useState(defaultKey);
  const [sortDir, setSortDir] = useState(defaultDir);
  const [query, setQuery] = useState("");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const processed = useMemo(() => {
    let result = [...rows];

    if (query.trim() && searchFn) {
      const q = query.trim().toLowerCase();
      result = result.filter(row => searchFn(row, q));
    }

    if (sortKey) {
      result.sort((a, b) => {
        const av = typeof sortKey === "function" ? sortKey(a) : a[sortKey];
        const bv = typeof sortKey === "function" ? sortKey(b) : b[sortKey];
        if (av == null && bv == null) return 0;
        if (av == null) return sortDir === "asc" ? 1 : -1;
        if (bv == null) return sortDir === "asc" ? -1 : 1;
        if (typeof av === "number" && typeof bv === "number") {
          return sortDir === "asc" ? av - bv : bv - av;
        }
        const as = String(av).toLowerCase();
        const bs = String(bv).toLowerCase();
        return sortDir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
      });
    }

    return result;
  }, [rows, sortKey, sortDir, query]);

  return { rows: processed, sortKey, sortDir, handleSort, query, setQuery };
}
