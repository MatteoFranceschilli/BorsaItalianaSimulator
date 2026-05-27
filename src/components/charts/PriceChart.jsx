import { memo } from "react";
import { fmt } from "../../utils/formatters.js";

const PriceChart = memo(function PriceChart({ data, id, w = 400, h = 150 }) {
  if (!data || data.length < 2) {
    return <div style={{ color: "var(--g5)", textAlign: "center", paddingTop: 60 }}>Dati insufficienti</div>;
  }
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
  const gradId = `g${id || "chart"}`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#${gradId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" />
      {[0, 0.25, 0.5, 0.75, 1].map(f => {
        const yv = mn + f * range;
        const y = H - f * H + 10;
        return (
          <g key={f}>
            <line x1={pad} y1={y} x2={pad + W} y2={y} stroke="#2a2a2a" strokeWidth="1" />
            <text x={pad - 2} y={y + 4} fill="#666" fontSize="9" textAnchor="end">€{fmt(yv)}</text>
          </g>
        );
      })}
    </svg>
  );
});

export default PriceChart;
