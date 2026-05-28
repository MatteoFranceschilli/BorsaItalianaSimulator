export function TableSearch({ query, onChange, placeholder = "Cerca..." }) {
  return (
    <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)" }}>
      <input
        type="text"
        value={query}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "var(--bg3)",
          border: "1px solid var(--border2)",
          borderRadius: 3,
          padding: "5px 10px",
          color: "var(--text)",
          fontFamily: "Space Mono, monospace",
          fontSize: 11,
          outline: "none",
        }}
        onFocus={e => (e.target.style.borderColor = "var(--gold)")}
        onBlur={e => (e.target.style.borderColor = "var(--border2)")}
      />
    </div>
  );
}

export function SortableTh({ label, sk, sortKey, sortDir, onSort, style, children, ...rest }) {
  const active = sortKey === sk;
  return (
    <th
      onClick={() => onSort(sk)}
      style={{ cursor: "pointer", userSelect: "none", whiteSpace: "nowrap", ...style }}
      {...rest}
    >
      {label ?? children}
      <span style={{ marginLeft: 4, fontSize: 9, opacity: active ? 1 : 0.25, color: active ? "var(--gold)" : undefined }}>
        {active ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
      </span>
    </th>
  );
}
