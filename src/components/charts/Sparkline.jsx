import { memo } from "react";

const Sparkline = memo(function Sparkline({ data, w = 120, h = 30 }) {
  if (!data || data.length < 2) {
    return <svg width={w} height={h}><line x1="0" y1={h / 2} x2={w} y2={h / 2} stroke="#444" strokeWidth="1" /></svg>;
  }
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
});

export default Sparkline;
